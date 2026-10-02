import { getDBConnection } from '@/config/db';
import { NotificationType } from '@/enums/notification-type.enum';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { ProductVariantEntity } from '@/modules/catalog/products/product-variant/model/product-variant.entity';
import { OrderTrackingEntity } from '@/modules/sales/order-tracking/model/order-tracking.entity';
import { AddressType } from '@/modules/sales/shipping-address/enums/address-type.enum';
import { ShippingAddressEntity } from '@/modules/sales/shipping-address/model/shipping-address.entity';
import { ShippingChargeEntity } from '@/modules/sales/shipping-charge/model/shipping-charge.entity';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';
import { SettingEntity } from '@/modules/system/other/setting/model/setting.entity';
import { RoleEnum } from '@/modules/user/auth/enums/role.enum';
import { StatusEnum } from '@/modules/user/auth/enums/status.enum';
import { TypeEnum } from '@/modules/user/auth/enums/type.enum';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import { productDetailQuery } from '@/sqlQuery';
import { sendSms } from '@/utils/sendSms';
import { initiateSSLCommerzPayment } from '@/utils/sslcommerz.utils';
import { directOrderValidationSchema } from '@/validation';
import { Request, Response } from 'express';
import { In } from 'typeorm';
import { OrderStatus, PaymentMethod, PaymentStatus } from '../enums';
import { OrderItemEntity } from '../model/order-item.entity';
import { OrderEntity } from '../model/order.entity';
import { adjustStock, orderTracking } from './order.controller';

// @desc Get product details & delivery rates for landing page
// @route GET /api/v1/landing/product/:slug
// @access Public
export const getLandingProduct = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getLandingProduct ${req.method} ${req.url}`);

  const { slug } = req.params;
  const productVariantId = req.query.productVariantId ? Number(req.query.productVariantId) : null;

  const connection = await getDBConnection();

  // 1. Fetch rich product details
  const { query, values } = productDetailQuery(slug as string, productVariantId);
  const result = await connection.query(query, values);

  if (!result || !result[0]) {
    return res.status(404).json({
      success: false,
      message: `Product not found with slug #${slug}`,
    });
  }

  // 2. Fetch shipping charges
  const shippingRepo = connection.getRepository(ShippingChargeEntity);
  const shippingCharges = await shippingRepo.find({
    relations: ['district'],
    where: { status: true },
    order: { id: 'ASC' },
  });

  // Calculate default delivery rates: Inside Dhaka vs Outside Dhaka
  let insideDhakaCharge = 60;
  let outsideDhakaCharge = 120;

  for (const sc of shippingCharges) {
    const dName = (sc.district?.name || '').toLowerCase();
    if (dName.includes('dhaka')) {
      insideDhakaCharge = Number(sc.shippingCharge) || 60;
    } else {
      outsideDhakaCharge = Number(sc.shippingCharge) || 120;
    }
  }

  // 3. Fetch store settings (phone, whatsapp, site name, logo, delivery settings)
  const settingRepo = connection.getRepository(SettingEntity);
  const storeSetting = await settingRepo.findOne({ order: { id: 'DESC' } });

  // Extract landing delivery configuration from store settings
  const landingConfig = (storeSetting?.landingSetting as any) || {};

  const finalInsideDhaka =
    landingConfig.insideDhakaCharge !== undefined && landingConfig.insideDhakaCharge !== null && landingConfig.insideDhakaCharge !== ''
      ? Number(landingConfig.insideDhakaCharge)
      : insideDhakaCharge;

  const finalOutsideDhaka =
    landingConfig.outsideDhakaCharge !== undefined && landingConfig.outsideDhakaCharge !== null && landingConfig.outsideDhakaCharge !== ''
      ? Number(landingConfig.outsideDhakaCharge)
      : outsideDhakaCharge;

  const isFreeDeliveryActive =
    landingConfig.isFreeDeliveryActive !== undefined
      ? Boolean(landingConfig.isFreeDeliveryActive)
      : true;

  // Free delivery quantity rule:
  // If isFreeDeliveryActive is false -> null (disabled)
  // Else if landingConfig.freeDeliveryMinQty is explicitly configured (e.g. 2, 3, or null/0 to disable) -> use it
  // Else default to 2
  let freeDeliveryMinQty: number | null = 2;
  if (!isFreeDeliveryActive) {
    freeDeliveryMinQty = null;
  } else if (landingConfig.freeDeliveryMinQty !== undefined) {
    freeDeliveryMinQty =
      landingConfig.freeDeliveryMinQty === null || landingConfig.freeDeliveryMinQty === '' || Number(landingConfig.freeDeliveryMinQty) <= 0
        ? null
        : Number(landingConfig.freeDeliveryMinQty);
  }

  // Free delivery minimum order amount rule
  let freeDeliveryMinAmount: number | null = null;
  if (isFreeDeliveryActive) {
    if (landingConfig.freeDeliveryMinAmount !== undefined && landingConfig.freeDeliveryMinAmount !== null && landingConfig.freeDeliveryMinAmount !== '') {
      freeDeliveryMinAmount = Number(landingConfig.freeDeliveryMinAmount) > 0 ? Number(landingConfig.freeDeliveryMinAmount) : null;
    } else if (storeSetting?.orderFreeShippingAmount) {
      freeDeliveryMinAmount = Number(storeSetting.orderFreeShippingAmount) > 0 ? Number(storeSetting.orderFreeShippingAmount) : null;
    }
  }

  return res.status(200).json({
    success: true,
    message: `Landing product details fetched successfully`,
    data: {
      product: result[0],
      deliveryCharges: {
        insideDhaka: finalInsideDhaka,
        outsideDhaka: finalOutsideDhaka,
      },
      deliverySettings: {
        insideDhaka: finalInsideDhaka,
        outsideDhaka: finalOutsideDhaka,
        freeDeliveryMinQty,
        freeDeliveryMinAmount,
        isFreeDeliveryActive,
      },
      storeSetting: {
        siteName: storeSetting?.siteName || 'Fashion Store',
        phone: storeSetting?.phone || '',
        whatsapp: storeSetting?.whatsapp || storeSetting?.phone || '',
        currency: storeSetting?.currency || 'BDT',
      },
    },
  });
});

// @desc Direct guest order for Facebook/Instagram landing pages
// @route POST /api/v1/landing/order
// @access Public
export const directLandingOrder = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: directLandingOrder ${req.method} ${req.url}`);

  const validation = directOrderValidationSchema.safeParse(req.body);

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
      message: formattedErrors[0]?.message || 'Validation error',
    });
  }

  const {
    customerName,
    phoneNo,
    deliveryAddress,
    shippingCharge,
    subTotal,
    grandTotal,
    paymentMethod,
    note,
    orderItems,
  } = validation.data;

  const connection = await getDBConnection();
  const queryRunner = connection.createQueryRunner();

  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const sanitizedPhone = phoneNo.trim();
    const userRepo = queryRunner.manager.getRepository(UserEntity);

    // 1. Locate or create customer record
    let user = await userRepo.findOne({ where: { phone: sanitizedPhone } });

    if (!user) {
      // Find by guest email or create
      const cleanPhoneDigits = sanitizedPhone.replace(/\D/g, '');
      const guestEmail = `guest_${cleanPhoneDigits || Date.now()}@store-guest.com`;

      let existingUserByEmail = await userRepo.findOne({ where: { email: guestEmail } });

      if (existingUserByEmail) {
        user = existingUserByEmail;
      } else {
        const newUser = userRepo.create({
          name: customerName.trim(),
          phone: sanitizedPhone,
          email: guestEmail,
          address: deliveryAddress.trim(),
          type: TypeEnum.Customer,
          role: RoleEnum.User,
          status: StatusEnum.Active,
        });
        user = await userRepo.save(newUser);
      }
    }

    // 2. Create Shipping Address
    const shippingAddressRepo = queryRunner.manager.getRepository(ShippingAddressEntity);
    const newShippingAddress = shippingAddressRepo.create({
      name: customerName.trim(),
      phoneNo: sanitizedPhone,
      address: deliveryAddress.trim(),
      type: AddressType.Home,
      userId: user.id,
      status: true,
    });
    const savedShippingAddress = await shippingAddressRepo.save(newShippingAddress);

    // 3. Generate Tracking Number & Transaction ID
    const orderRepo = queryRunner.manager.getRepository(OrderEntity);
    const lastOrder = await orderRepo
      .createQueryBuilder('order')
      .select(['order.id'])
      .orderBy('order.id', 'DESC')
      .limit(1)
      .getOne();

    const nextId = (lastOrder?.id || 0) + 1;
    const trackingNo = `TRK-${nextId.toString().padStart(10, '0')}`;
    const tranId = `LP-${Date.now()}`;

    // 4. Create and Save Order
    const totalQty = orderItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

    const newOrder = orderRepo.create({
      trackingNo,
      tranId,
      totalQty,
      subTotal,
      shippingCharge,
      grandTotal,
      paymentMethod: paymentMethod === 'SSLCOMMERZ' ? PaymentMethod.SSLCOMMERZ : PaymentMethod.Cash,
      paymentStatus: PaymentStatus.NotPaid,
      status: OrderStatus.Pending,
      termsAndConditions: true,
      userId: user.id,
      shippingAddressId: savedShippingAddress.id,
      cancelResson: note ? `Landing Order Note: ${note}` : undefined,
    });

    const savedOrder = await orderRepo.save(newOrder);

    // 5. Fetch Variant Purchase Prices if needed
    const variantRepo = queryRunner.manager.getRepository(ProductVariantEntity);
    const variantIds = orderItems.map((item) => item.productVariantId);
    const foundVariants = await variantRepo.findBy({ id: In(variantIds) });
    const variantPriceMap = new Map(foundVariants.map((v: ProductVariantEntity) => [v.id, v.purchasePrice]));

    // 6. Create Order Items
    const orderItemRepo = queryRunner.manager.getRepository(OrderItemEntity);
    const orderItemEntities = orderItems.map((item) => {
      const pPrice = variantPriceMap.get(item.productVariantId) || item.purchasePrice || 0;
      return orderItemRepo.create({
        orderId: savedOrder.id,
        productId: item.productId,
        productVariantId: item.productVariantId,
        qty: item.qty,
        unitPrice: String(item.unitPrice),
        purchasePrice: String(pPrice),
        discountedUnitPrice: item.discountedUnitPrice ? String(item.discountedUnitPrice) : undefined,
        subTotal: String(item.subTotal),
        taxAmount: String(item.taxAmount || 0),
      });
    });

    const savedOrderItems = await orderItemRepo.save(orderItemEntities);

    // 7. Deduct Product Variant Stock
    await adjustStock(savedOrderItems, false, variantRepo);

    // 8. Order Tracking Initial Entry
    const orderTrackingRepo = queryRunner.manager.getRepository(OrderTrackingEntity);
    await orderTracking(
      {
        orderId: savedOrder.id,
        userId: user.id,
        location: 'অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে (FB/IG Ads Landing Page)। কনফার্মেশনের জন্য অপেক্ষমান।',
        status: OrderStatus.Pending,
      },
      orderTrackingRepo,
    );

    // 9. Notifications for Admin & Customer
    const notificationRepo = queryRunner.manager.getRepository(NotificationEntity);

    // Customer Notification
    const customerNotification = notificationRepo.create({
      type: NotificationType.OrderPlaced,
      title: 'Order Placed Successfully',
      message: `Your order #${savedOrder.id} has been placed. Tracking No: ${trackingNo}`,
      userId: user.id,
      orderId: savedOrder.id,
    });
    await notificationRepo.save(customerNotification);

    // Admin Notification
    const admins = await userRepo.find({
      where: { role: RoleEnum.Admin },
      select: ['id'],
    });

    if (admins.length > 0) {
      const adminNotifications = admins.map((admin: any) => ({
        type: NotificationType.AdminNewOrder,
        title: 'New Landing Page Ad Order!',
        message: `New FB/IG Ads Order #${savedOrder.id} received from ${customerName} (${sanitizedPhone}). Total: ৳${grandTotal}. Tracking: ${trackingNo}`,
        userId: admin.id,
        orderId: savedOrder.id,
      }));
      await notificationRepo.save(notificationRepo.create(adminNotifications as any));
    }

    // 10. Send SMS Notification to Customer
    try {
      const smsMessage = `ধন্যবাদ ${customerName}! আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। ট্র্যাকিং নং: ${trackingNo}। সর্বমোট: ৳${grandTotal}।`;
      sendSms(sanitizedPhone, smsMessage).catch((smsErr) => {
        logger.warn(`Failed to send SMS for order ${savedOrder.id}: ${smsErr?.message}`);
      });
    } catch (smsErr) {
      logger.warn(`SMS dispatch encountered error: ${smsErr}`);
    }

    // Commit Transaction
    if (queryRunner.isTransactionActive) {
      await queryRunner.commitTransaction();
    }

    // 11. Handle SSLCommerz online payment if chosen
    let paymentUrl: string | null = null;
    if (savedOrder.paymentMethod === PaymentMethod.SSLCOMMERZ) {
      try {
        paymentUrl = await initiateSSLCommerzPayment({
          tranId,
          amount: savedOrder.grandTotal,
          user,
        });
      } catch (sslErr: any) {
        logger.error(`SSLCommerz payment link creation error: ${sslErr?.message}`);
      }
    }

    return res.status(200).json({
      success: true,
      message: 'অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!',
      data: {
        orderId: savedOrder.id,
        trackingNo,
        grandTotal: savedOrder.grandTotal,
        customerName: user.name,
        phoneNo: user.phone,
        paymentMethod: savedOrder.paymentMethod,
        paymentUrl,
      },
    });
  } catch (error: any) {
    if (queryRunner.isTransactionActive) {
      await queryRunner.rollbackTransaction();
    }
    logger.error(`Landing order creation failed: ${error?.message || error}`);
    return res.status(500).json({
      success: false,
      message: error?.message || 'Failed to place order. Please try again or call our hotline.',
    });
  } finally {
    await queryRunner.release();
  }
});
