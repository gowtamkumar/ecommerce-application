import { NextFunction, Request, Response } from 'express';
import { getDBConnection } from '../../../config/db';
import { CouponType } from '../../../enums/coupon-type.enum';
import { CustomRequest } from '../../../enums/custom-request-type';
import { DiscountType } from '../../../enums/discount-type.enum';
import { NotificationType } from '../../../enums/notification-type.enum';
import { asyncHandler } from '../../../middlewares/async.middleware';
import { logger } from '../../../middlewares/logger';
import { cartValidationSchema } from '../../../validation';
import { cartIncrementDecrementValidationSchema } from '../../../validation/cart/cartIncrementDecrementValidationSchema';
import { updateCartValidationSchema } from '../../../validation/cart/updateCartValidation';
import { AppliedCouponEntity } from '../../coupon/model/applied-coupon.entity';
import { CouponEntity } from '../../coupon/model/coupon.entity';
import { NotificationEntity } from '../../other/notification/model/notification.entity';
import { SettingEntity } from '../../other/setting/model/setting.entity';
import { ShippingChargeEntity } from '../../shipping-charge/model/shipping-charge.entity';
import { incrementDecrementType } from '../enums/increment-decrement-type.enum';
import { CartEntity } from '../model/cart.entity';

// @desc Get all Cart
// @route GET /api/v1/Cart
// @access Public
// export const getCartByUser = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     const userId = req.id;
//     const connection = await getDBConnection();

//     const cart = await connection.query(
//       `
//         WITH selectedDiscounts AS (
//         SELECT DISTINCT ON (p.id)
//             p.id AS product_id,
//             d.id AS discount_id,
//             d.discount_strategy,
//             d.value AS discount_value,
//             d.scope,
//             d.promotion_type
//         FROM products p
//         LEFT JOIN discounts d ON (
//             (d.scope = 'Products' AND EXISTS (
//                 SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = d.id
//             )) OR
//             (d.scope = 'Category' AND EXISTS (
//                 SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id
//                 AND pc.category_id IN (
//                     SELECT category_id FROM applicable_categories WHERE discount_id = d.id
//                 )
//             )) OR
//             (d.scope = 'Brand' AND EXISTS (
//                 SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = d.id
//             )) OR
//             (d.scope = 'Global') OR
//             (d.scope = 'Product' AND p.discount_id = d.id)
//         )
//         WHERE
//             ((d.start_date <= NOW() AND d.end_date >= NOW()) OR d.id = p.discount_id)
//             OR d.status = 'Active'
//         ORDER BY p.id, d.priority DESC, d.value DESC
//     )
//     SELECT
//         carts.id,
//         carts.qty,
//         carts.product_variant_id AS "productVariantId",
//         sd.product_id AS "productId",
//         p.name,
//         p.slug,
//         p.thumbnail_image AS "thumbnailImage",
//         sd.discount_strategy AS "discountStrategy",
//         sd.discount_value AS "discountValue",
//         pv.unit_price AS "unitPrice",
//         pv.purchase_price AS "purchasePrice",

//         -- ✅ Calculate Discounted Price per unit
//         ROUND(
//             CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     pv.unit_price - sd.discount_value
//                 ELSE
//                     pv.unit_price
//             END,
//         2) AS "discountedUnitPrice",

//         -- ✅ Calculate Total Discounted Price for all quantities
//         ROUND(
//             (CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     pv.unit_price - sd.discount_value
//                 ELSE
//                     pv.unit_price
//             END) * carts.qty,
//         2) AS "totalDiscountedPrice",

//         -- ✅ Calculate Discount Amount per unit
//         ROUND(
//             CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     sd.discount_value
//                 ELSE
//                     0
//             END,
//         2) AS "discountAmountPerUnit",

//         -- ✅ Calculate Total Discount Amount for all quantities
//         ROUND(
//             (CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     sd.discount_value
//                 ELSE
//                     0
//             END) * carts.qty,
//         2) AS "totalDiscountAmount",

//         -- ✅ Calculate tax amount based on the discounted price
//         ROUND(
//             ((CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     pv.unit_price - sd.discount_value
//                 ELSE
//                     pv.unit_price
//             END) * COALESCE(t.value, 0) / 100) * carts.qty,
//         2) AS "taxAmount",

//         -- ✅ Calculate subtotal (discounted price + tax) * quantity
//         ROUND(
//             ((CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     pv.unit_price - sd.discount_value
//                 ELSE
//                     pv.unit_price
//             END) +
//             ((CASE
//                 WHEN sd.discount_strategy = 'Percentage' THEN
//                     pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//                 WHEN sd.discount_strategy = 'Fixed' THEN
//                     pv.unit_price - sd.discount_value
//                 ELSE
//                     pv.unit_price
//             END) * COALESCE(t.value, 0) / 100)) * carts.qty,
//         2) AS "subTotal"

//       FROM carts
//       LEFT JOIN products AS p ON p.id = carts.product_id
//       LEFT JOIN taxs AS t ON t.id = p.tax_id
//       LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
//       LEFT JOIN selectedDiscounts sd ON sd.product_id = p.id
//       WHERE carts.user_id = $1`,
//       [userId]
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Get cart by user",
//       data: cart,
//     });
//   }
// );

// @desc Get all Cart
// @route GET /api/v1/Cart
// @access Public
export const getCarts = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(CartEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Cart',
    data: result,
  });
});

export const cartListApplyCoupon = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: cartListApplyCoupon ${req.method} ${req.url}`);
  const { couponCode, districtId } = req.query;
  const userId = req?.id;

  if (!userId) {
    return res.status(400).json({ success: false, message: 'User not authenticated' });
  }

  const connection = await getDBConnection();

  // Initialize coupon-related variables
  let validCoupon: any = null;
  let couponDiscount = 0;
  let shippingCharge = 0; // Example flat shipping charge
  let message = '';

  if (couponCode) {
    const coupon = await connection
      .getRepository(CouponEntity)
      .createQueryBuilder('coupon')
      .select(['coupon', 'products'])
      .leftJoin('coupon.products', 'products')
      .where('coupon.code = :code', { code: couponCode })
      .andWhere('coupon.active = true')
      .andWhere('NOW() BETWEEN coupon.startDate AND coupon.expiryDate')
      .getOne();

    if (!coupon) {
      message = 'Invalid or expired coupon';

      // (Optional) Could Notify about Expired/Invalid coupon attempt
      // const notificationRepo = connection.getRepository(NotificationEntity);
      // await notificationRepo.save(notificationRepo.create({
      //   type: NotificationType.CouponExpired,
      //   title: 'Coupon Failed',
      //   message: `The coupon ${couponCode} is invalid or expired.`,
      //   userId,
      //   isRead: false,
      // }));
    }

    if (coupon) {
      // Check usage_per_user limit
      const totalUserUsage = await connection
        .getRepository(AppliedCouponEntity)
        .createQueryBuilder('appliedCoupon')
        .where('appliedCoupon.userId = :userId', { userId })
        .andWhere('appliedCoupon.couponId = :couponId', {
          couponId: coupon.id,
        })
        .getCount();

      if (totalUserUsage >= coupon.usagePerUser) {
        message = `You already applied ${totalUserUsage} time. You can only use this coupon ${coupon.usagePerUser} time(s)`;
      } else {
        message = 'Coupon applied successfully';
        validCoupon = coupon;

        // Notification: Coupon Applied Successfully
        const notificationRepo = connection.getRepository(NotificationEntity);
        // Check if we already notified for this coupon application to avoid spam?
        // Since this is a "check" logic often hit, let's limit it or just notify.
        // For now, simple notification.
        await notificationRepo.save(notificationRepo.create({
          type: NotificationType.CouponApplied,
          title: 'Coupon Applied',
          message: `Coupon ${coupon.code} applied successfully! Discount: ${coupon.value}${coupon.discountType === DiscountType.Percentage ? '%' : ''}`,
          userId,
          isRead: false,
        }));
      }
    }
  }

  // Step 2: Fetch the cart details
  const cart = await connection.query(
    `
        WITH selectedDiscounts AS (
        SELECT DISTINCT ON (p.id) 
            p.id AS product_id,  
            d.id AS discount_id,
            d.discount_strategy,
            d.value AS discount_value,
            d.scope,
            d.promotion_type
        FROM products p
        LEFT JOIN discounts d ON (
            (d.scope = 'Products' AND EXISTS (
                SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = d.id
            )) OR
            (d.scope = 'Category' AND EXISTS (
                SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id 
                AND pc.category_id IN (
                    SELECT category_id FROM applicable_categories WHERE discount_id = d.id
                )
            )) OR
            (d.scope = 'Brand' AND EXISTS (
                SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = d.id
            )) OR
            (d.scope = 'Global') OR
            (d.scope = 'Product' AND p.discount_id = d.id) 
        )   
        WHERE 
            ((d.start_date <= NOW() AND d.end_date >= NOW()) OR d.id = p.discount_id)
            AND d.status = 'Active'
        ORDER BY p.id, d.priority DESC, d.value DESC
    )
    SELECT 
        carts.id,
        carts.qty,
        carts.product_variant_id AS "productVariantId",
        carts.product_id AS "productId",
        p.name,
        p.slug,
        p.thumbnail_image AS "thumbnailImage",
        sd.discount_strategy AS "discountStrategy",
        sd.discount_value AS "discountValue",
        pv.unit_price AS "unitPrice",
        pv.purchase_price AS "purchasePrice",

            -- ✅ Calculate Sale Price
        ROUND(
            ((pv.unit_price) + 
            ((CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    pv.unit_price - (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    pv.unit_price - sd.discount_value
                ELSE 
                    pv.unit_price
            END) * COALESCE(t.value, 0) / 100)), 
        2) AS "salePrice",

        -- ✅ Calculate Discounted Price per unit
        ROUND(
            CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    pv.unit_price - (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    pv.unit_price - sd.discount_value
                ELSE 
                    pv.unit_price
            END, 
        2) AS "discountedUnitPrice",

        -- ✅ Calculate Total Discounted Price for all quantities
        ROUND(
            (CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    pv.unit_price - (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    pv.unit_price - sd.discount_value
                ELSE 
                    pv.unit_price
            END) * carts.qty, 
        2) AS "totalDiscountedPrice",

        -- ✅ Calculate Discount Amount per unit
        ROUND(
            CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    sd.discount_value
                ELSE 
                    0
            END, 
        2) AS "discountAmountPerUnit",

        -- ✅ Calculate Total Discount Amount for all quantities
        ROUND(
            (CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    sd.discount_value
                ELSE 
                    0
            END) * carts.qty, 
        2) AS "totalDiscountAmount",

        -- ✅ Calculate tax amount based on the discounted price
        ROUND(
            ((CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    pv.unit_price - (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    pv.unit_price - sd.discount_value
                ELSE 
                    pv.unit_price
            END) * COALESCE(t.value, 0) / 100) * carts.qty, 
        2) AS "taxAmount",

        -- ✅ Calculate subtotal (discounted price + tax) * quantity
        ROUND(
            ((CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    pv.unit_price - (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    pv.unit_price - sd.discount_value
                ELSE 
                    pv.unit_price
            END) + 
            ((CASE 
                WHEN sd.discount_strategy = 'Percentage' THEN 
                    pv.unit_price - (pv.unit_price * sd.discount_value / 100)
                WHEN sd.discount_strategy = 'Fixed' THEN 
                    pv.unit_price - sd.discount_value
                ELSE 
                    pv.unit_price
            END) * COALESCE(t.value, 0) / 100)) * carts.qty, 
        2) AS "subTotal"
    FROM carts 
    LEFT JOIN products AS p ON p.id = carts.product_id
    LEFT JOIN taxs AS t ON t.id = p.tax_id
    LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
    LEFT JOIN selectedDiscounts sd ON sd.product_id = p.id
    WHERE carts.user_id = $1`,
    [userId],
  );

  if (!cart.length) {
    // return res.status(400).json({ success: false, message: "Cart is empty" });
    return res.status(200).json({
      success: false,
      message: 'Cart is empty',
      data: {
        cartList: cart,
        cartSummary: {
          totalQty: 0,
          subTotal: '0.00', //unit_price + tax - discount
          totalItemsDiscount: '0.00', //item.totalDiscountAmount
          couponDiscount: '0.00',
          totalDiscount: '0.00', //coupon + totalitemdiscount
          totalTax: '0.00',
          shippingCharge: '0.00',
          grandTotal: '0.00',
          // totalSalePrice: "0.00",
        },
      },
    });
  }

  // Step 3: Calculate totals
  let totalQty = 0;
  let subTotal = 0;
  let totalItemsDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;
  // let totalSalePrice = 0;

  cart.forEach(
    (item: {
      qty: number;
      taxAmount: string;
      discountAmount: number;
      totalDiscountAmount: number | string;
      subTotal: string;
      salePrice: string;
    }) => {
      const qty = +item.qty || 0;
      const taxAmount = +item.taxAmount || 0;
      const discountAmount = +item.totalDiscountAmount || 0;
      const subtotalAmount = +item.subTotal;

      totalQty += +qty;
      // totalSalePrice = +item.salePrice * +qty;
      subTotal += +subtotalAmount;
      totalItemsDiscount += +discountAmount;
      totalTax += +taxAmount;
      grandTotal += +subtotalAmount;
    },
  );

  if (validCoupon) {
    if (grandTotal < validCoupon.minOrderAmount) {
      message = `Minmum order amount must be at least ${validCoupon.minOrderAmount} to apply this coupon`;
      validCoupon = null;
    }

    if (totalQty < +validCoupon.mincartValue) {
      message = `Cart value must be at least ${validCoupon.mincartValue} to apply this coupon`;
      validCoupon = null;
    }

    if (+validCoupon.usageCount === +validCoupon.usageLimit) {
      message = `Coupon usage limit reached`;
      validCoupon = null;
    }
  }

  // Step 4: Apply the coupon if provided
  if (validCoupon) {
    if (validCoupon.type === CouponType.Order) {
      if (validCoupon.discountType === DiscountType.Percentage) {
        couponDiscount = (+grandTotal * validCoupon.value) / 100;
      } else if (validCoupon.discountType === DiscountType.Fixed) {
        couponDiscount = validCoupon.value;
      }
    } else if (validCoupon.type === CouponType.Product) {
      const validProductIds = validCoupon.products.map((p: any) => p.productId);
      cart.forEach((item: any) => {
        if (validProductIds.includes(item.productId)) {
          if (validCoupon.discountType === DiscountType.Percentage) {
            couponDiscount += (+item.subTotal * +validCoupon.value) / 100;
          } else if (validCoupon.discountType === DiscountType.Fixed) {
            couponDiscount += validCoupon.value * item.qty;
          }
        }
      });
    }

    couponDiscount = Math.min(couponDiscount, validCoupon.maxDiscountValue || couponDiscount);

    // Check for FreeShipping
    // if (validCoupon.type === DiscountType.FreeShipping) {
    //   shippingCharge = 0;
    // }
  }

  const settingRepository = await connection.getRepository(SettingEntity);
  const setting = (await settingRepository.find())[0];

  grandTotal -= +couponDiscount;

  if (districtId) {
    const shippingAddressRepository = await connection.getRepository(ShippingChargeEntity);
    const findShippingAddress = await shippingAddressRepository.findOne({
      where: { districtId },
    });

    const newlog =
      +setting?.orderFreeShippingAmount > 0 && +setting?.orderFreeShippingAmount <= +grandTotal;

    if (districtId && newlog) {
      shippingCharge = 0;
    } else {
      shippingCharge = +findShippingAddress?.shippingCharge || 0;
    }
  }

  grandTotal += +shippingCharge;

  return res.status(200).json({
    success: true,
    message: !couponCode ? 'Get Cart list' : message,
    data: {
      cartList: cart,
      cartSummary: {
        totalQty,
        subTotal: subTotal.toFixed(2), //unit_price + tax - discount
        totalItemsDiscount: (+totalItemsDiscount || 0).toFixed(2), //item.totalDiscountAmount
        couponDiscount: couponDiscount.toFixed(2),
        totalDiscount: (totalItemsDiscount + couponDiscount).toFixed(2), //coupon + totalitemdiscount
        couponId: +couponDiscount > 0 && validCoupon ? validCoupon.id : null,
        totalTax: totalTax.toFixed(2),
        shippingCharge: shippingCharge.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
        // totalSalePrice: totalSalePrice.toFixed(2),
      },
    },
  });
});

// @desc Update a single Cart
// @route PUT /api/v1/Cart/:id
// @access Public
export const cartIncrementDecrement = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = cartIncrementDecrementValidationSchema.safeParse(req.body);

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = await connection.getRepository(CartEntity);
  const result = await repository.findOne({
    where: { id },
    relations: ['productVariant'],
  });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  let qty = 0;
  if (validation.data.type === incrementDecrementType.Increment) {
    if (result.productVariant.stockQty < validation.data.qty) {
      throw new Error(`Out of stock`);
    }
    qty = validation.data.qty;
  } else if (validation.data.type === incrementDecrementType.Decrement) {
    if (result.qty === 1) {
      throw new Error(`Minimum 1 qty should be keep otherwise you can remove`);
    } else {
      qty = validation.data.qty;
    }
  }

  const cartUpdate = await repository.save({ id: result.id, qty });

  return res.status(200).json({
    success: true,
    message: `Update a single Cart of id ${req.params.id}`,
    data: cartUpdate,
  });
});

// @desc Get a single Cart
// @route GET /api/v1/Cart/:id
// @access Public
export const getCart = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(CartEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Cart of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Cart
// @route POST /api/v1/Cart
// @access Public
export const createCart = asyncHandler(async (req: CustomRequest, res: Response) => {
  const connection = await getDBConnection();

  const userId = req.id;

  const validation = cartValidationSchema.safeParse({
    ...req.body,
    userId,
  });

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = connection.getRepository(CartEntity);

  const findCart = await repository.findOneBy({
    productId: validation.data.productId,
    userId,
  });

  if (findCart) {
    throw new Error(`This product is already added please update Quantity`);
  }

  const newCart = repository.create(validation.data);

  const added = await repository.save(newCart);

  return res.status(200).json({
    success: true,
    message: 'Add to Cart successfully',
    data: added,
  });
});

// @desc Update a single Cart
// @route PUT /api/v1/Cart/:id
// @access Public
export const updateCart = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = updateCartValidationSchema.safeParse({
    ...req.body,
  });
  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = await connection.getRepository(CartEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);

  await repository.save(updateData);

  return res.status(200).json({
    success: true,
    message: `Update a single Cart of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Cart
// @route DELETE /api/v1/cart/:id
// @access Public
export const deleteCart = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(CartEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Cart of id ${req.params.id}`,
    data: result,
  });
});

// export const cartListApplyCouponCodeOld = asyncHandler(
//   async (req: CustomRequest, res: Response) => {
//     logger.info(`Service: cartListApplyCouponCode ${req.method} ${req.url}`);
//     const { couponCode, shippingCost } = req.query;
//     const userId = req?.id;

//     if (!userId) {
//       return res
//         .status(400)
//         .json({ success: false, message: "User not authenticated" });
//     }

//     const connection = await getDBConnection();

//     // Initialize coupon-related variables
//     let validCoupon: any = null;
//     let couponDiscount = 0;
//     let shippingCharge = 0; // Example flat shipping charge
//     let message = "";

//     if (couponCode) {
//       const coupon = await connection
//         .getRepository(CouponEntity)
//         .createQueryBuilder("coupon")
//         .select(["coupon", "products"])
//         .leftJoin("coupon.products", "products")
//         .where("coupon.code = :code", { code: couponCode })
//         .andWhere("coupon.active = true")
//         .andWhere("NOW() BETWEEN coupon.startDate AND coupon.expiryDate")
//         .getOne();

//       if (!coupon) {
//         message = "Invalid or expired coupon";
//       }

//       if (coupon) {
//         // Check usage_per_user limit
//         const totalUserUsage = await connection
//           .getRepository(AppliedCouponEntity)
//           .createQueryBuilder("appliedCoupon")
//           .where("appliedCoupon.userId = :userId", { userId })
//           .andWhere("appliedCoupon.couponId = :couponId", {
//             couponId: coupon.id,
//           })
//           .getCount();

//         if (totalUserUsage >= coupon.usagePerUser) {
//           message = `You already applied ${totalUserUsage} You can only use this coupon ${coupon.usagePerUser} time(s)`;
//         } else {
//           message = "Coupon applied successfully";
//           validCoupon = coupon;
//         }
//       }
//     }

//     // Step 2: Fetch the cart details
//     const cart = await connection.query(
//       `SELECT
//         carts.id,
//         carts.qty,
//         carts.product_variant_id AS "productVariantId",
//         p.name,
//         p.id AS "productId",
//         p.thumbnail_image AS "thumbnailImage",
//         t.value AS "taxValue",
//         d.discount_strategy AS "discountStrategy",
//         d.value AS "discountValue",
//         pv.unit_price AS "unitPrice",
//         pv.purchase_price AS "purchasePrice",
//         pv.stock_qty AS "stockQty",
//         ROUND(((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100) * COALESCE(carts.qty, 1), 2) AS "taxAmount",
//         ROUND(((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100)) * COALESCE(carts.qty, 1)), 2) AS "subTotal",
//         ROUND(
//             CASE
//                 WHEN d.discount_strategy = 'Percentage' THEN
//                     (((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100))) * COALESCE(d.value, 0) / 100) * COALESCE(carts.qty, 1)
//                 ELSE
//                     COALESCE(d.value, 0) * COALESCE(carts.qty, 1)
//             END, 2
//         ) AS "discountAmount"
//       FROM carts
//       LEFT JOIN products AS p ON p.id = carts.product_id
//       LEFT JOIN taxs AS t ON t.id = p.tax_id
//       LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
//       LEFT JOIN discounts AS d ON d.id = p.discount_id
//       WHERE carts.user_id = $1`,
//       [userId]
//     );

//     if (!cart.length) {
//       return res.status(400).json({ success: false, message: "Cart is empty" });
//     }

//     // Step 3: Calculate totals
//     let totalQty = 0;
//     let subTotal = 0;
//     let totalDiscount = 0;
//     let totalTax = 0;
//     let grandTotal = 0;

//     cart.forEach((item: any) => {
//       const qty = +item.qty || 0;
//       const taxAmount = +item.taxAmount || 0;
//       const discountAmount = +item.discountAmount || 0;
//       const subtotalAmount = +item.subTotal;
//       const totalItemPrice = subtotalAmount - discountAmount;

//       totalQty += +qty;
//       subTotal += +subtotalAmount;
//       totalDiscount += +discountAmount;
//       totalTax += +taxAmount;
//       grandTotal += +totalItemPrice;
//     });

//     if (validCoupon) {
//       if (grandTotal < validCoupon.minOrderAmount) {
//         message = `Minmum order amount must be at least ${validCoupon.minOrderAmount} to apply this coupon`;
//         validCoupon = null;
//       }

//       if (totalQty < +validCoupon.mincartValue) {
//         message = `Cart value must be at least ${validCoupon.mincartValue} to apply this coupon`;
//         validCoupon = null;
//       }

//       if (+validCoupon.usageCount === +validCoupon.usageLimit) {
//         message = `Coupon usage limit reached`;
//         validCoupon = null;
//       }
//     }

//     // Step 4: Apply the coupon if provided
//     if (validCoupon) {
//       if (validCoupon.type === CouponType.Order) {
//         if (validCoupon.discountType === DiscountType.Percentage) {
//           couponDiscount = (+grandTotal * validCoupon.value) / 100;
//         } else if (validCoupon.discountType === DiscountType.Fixed) {
//           couponDiscount = validCoupon.value;
//         }
//       } else if (validCoupon.type === CouponType.Product) {
//         const validProductIds = validCoupon.products.map(
//           (p: any) => p.productId
//         );
//         cart.forEach((item: any) => {
//           if (validProductIds.includes(item.productId)) {
//             if (validCoupon.discountType === DiscountType.Percentage) {
//               couponDiscount += (+item.subTotal * +validCoupon.value) / 100;
//             } else if (validCoupon.discountType === DiscountType.Fixed) {
//               couponDiscount += validCoupon.value * item.qty;
//             }
//           }
//         });
//       }

//       couponDiscount = Math.min(
//         couponDiscount,
//         validCoupon.maxDiscountValue || couponDiscount
//       );

//       // Check for FreeShipping
//       if (validCoupon.type === DiscountType.FreeShipping) {
//         shippingCharge = 0;
//       }
//     }

//     if (shippingCost && validCoupon?.type !== DiscountType.FreeShipping) {
//       shippingCharge = +shippingCost;
//     }

//     grandTotal = grandTotal - couponDiscount + shippingCharge;

//     return res.status(200).json({
//       success: true,
//       message: !couponCode ? "Get Cart list" : message,
//       data: {
//         cartList: cart,
//         cartSummary: {
//           totalQty,
//           subTotal: subTotal.toFixed(2),
//           totalDiscount: (totalDiscount + couponDiscount).toFixed(2),
//           totalTax: totalTax.toFixed(2),
//           shippingCharge: shippingCharge.toFixed(2),
//           grandTotal: grandTotal.toFixed(2),
//           couponDiscount: couponDiscount.toFixed(2),
//           couponId: validCoupon ? validCoupon.id : null,
//         },
//       },
//     });
//   }
// );

// export const getCartListOld = asyncHandler(
//   async (req: Request, res: Response) => {
//     logger.info(`Service: getCartList ${req.method} ${req.url}`);
//     const connection = await getDBConnection();
//     // If your platform aims to prioritize customer satisfaction and compliance with typical tax laws, use
//     // (Unit Price - Discount) + Tax
//     // If maximizing revenue and tax collection is the primary goal
//     // (Unit Price + Tax) - Discount
//     const result = await connection.query(
//       `
//     SELECT
//       carts.id,
//       carts.qty,
//       carts.product_variant_id AS "productVariantId",
//       p.name,
//       p.thumbnail_image AS "thumbnailImage" ,
//       t.value AS "taxValue",
//       d.discount_strategy AS "discountStrategy",
//       d.value AS "discountValue",
//       pv.unit_price AS "unitPrice",
//       pv.purchase_price AS "purchasePrice",
//       pv.stock_qty AS "stockQty",
//       -- Calculate tax amount and round to 2 decimal places
//       ROUND(((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100) * COALESCE(carts.qty, 1), 2) AS "taxAmount",
//       -- Calculate subtotal (unit price + tax) * quantity and round to 2 decimal places
//       ROUND(((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100)) * COALESCE(carts.qty, 1)), 2) AS "subTotal",
//       -- Calculate discount amount and round to 2 decimal places
//       ROUND(
//           CASE
//               WHEN d.discount_strategy = 'Percentage' THEN
//                   (((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100))) * COALESCE(d.value, 0) / 100) * COALESCE(carts.qty, 1)
//               ELSE
//                   COALESCE(d.value, 0) * COALESCE(carts.qty, 1)
//           END, 2
//       ) AS "discountAmount"
//     FROM carts
//     LEFT JOIN products AS p ON p.id = carts.product_id
//     LEFT JOIN taxs AS t ON t.id = p.tax_id
//     LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
//     LEFT JOIN discounts AS d ON d.id = p.discount_id;
// `
//     );

//     // Calculate cart summary
//     let totalQty = 0;
//     let subTotal = 0;
//     let totalDiscount = 0;
//     let totalTax = 0;
//     let grandTotal = 0;

//     result.forEach(
//       (item: {
//         qty: number;
//         taxAmount: string;
//         discountAmount: number;
//         subTotal: string;
//       }) => {
//         const qty = +item.qty || 0;
//         const taxAmount = +item.taxAmount || 0;
//         const discountAmount = +item.discountAmount || 0;
//         const subtotalAmount = +item.subTotal;
//         const totalItemPrice = subtotalAmount - discountAmount;

//         totalQty += +qty;
//         subTotal += +subtotalAmount;
//         totalDiscount += +discountAmount;
//         totalTax += +taxAmount;
//         grandTotal += +totalItemPrice;
//       }
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Get Cart list",
//       totalCount: result.length,
//       data: {
//         cartList: result,
//         cartSummary: {
//           totalQty,
//           subTotal: subTotal.toFixed(2),
//           totalDiscount: totalDiscount.toFixed(2),
//           totalTax: totalTax.toFixed(2),
//           grandTotal: grandTotal.toFixed(2),
//         },
//       },
//     });
//   }
// );

// @desc Get all Cart
// @route GET /api/v1/cart/list
// @access Public
// export const getCartList = asyncHandler(async (req: Request, res: Response) => {
//   logger.info(`Service: getCartList ${req.method} ${req.url}`);
//   const connection = await getDBConnection();
//   // If your platform aims to prioritize customer satisfaction and compliance with typical tax laws, use
//   // (Unit Price - Discount) + Tax
//   // If maximizing revenue and tax collection is the primary goal
//   // (Unit Price + Tax) - Discount
//   const result = await connection.query(
//     `
//   WITH selectedDiscounts AS (
//     SELECT DISTINCT ON (p.id)
//         p.id AS product_id,
//         d.id AS discount_id,
//         d.discount_strategy,
//         d.value AS discount_value,
//         d.scope,
//         d.promotion_type
//     FROM products p
//     LEFT JOIN discounts d ON (
//         (d.scope = 'Products' AND EXISTS (
//             SELECT 1 FROM applicable_products ap WHERE ap.product_id = p.id AND ap.discount_id = d.id
//         )) OR
//         (d.scope = 'Category' AND EXISTS (
//             SELECT 1 FROM product_categories pc WHERE pc.product_id = p.id
//             AND pc.category_id IN (
//                 SELECT category_id FROM applicable_categories WHERE discount_id = d.id
//             )
//         )) OR
//         (d.scope = 'Brand' AND EXISTS (
//             SELECT 1 FROM applicable_brands ab WHERE ab.brand_id = p.brand_id AND ab.discount_id = d.id
//         )) OR
//         (d.scope = 'Global') OR
//         (d.scope = 'Product' AND p.discount_id = d.id)
//     )
//     WHERE
//         ((d.start_date <= NOW() AND d.end_date >= NOW()) OR d.id = p.discount_id)
//         AND d.status = 'Active'
//     ORDER BY p.id, d.priority DESC, d.value DESC
// )
// SELECT
//     carts.id,
//     carts.qty,
//     carts.product_variant_id AS "productVariantId",
//     p.name,
//     p.thumbnail_image AS "thumbnailImage",
//     sd.discount_id AS "discountId",
//     sd.discount_strategy AS "discountStrategy",
//     sd.discount_value AS "discountValue",
//     pv.unit_price AS "unitPrice",
//     pv.purchase_price AS "purchasePrice",

//     -- ✅ Calculate Discounted Price per unit
//     ROUND(
//         CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 pv.unit_price - sd.discount_value
//             ELSE
//                 pv.unit_price
//         END,
//     2) AS "discountedUnitPrice",

//     -- ✅ Calculate Total Discounted Price for all quantities
//     ROUND(
//         (CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 pv.unit_price - sd.discount_value
//             ELSE
//                 pv.unit_price
//         END) * carts.qty,
//     2) AS "totalDiscountedPrice",

//     -- ✅ Calculate Discount Amount per unit
//     ROUND(
//         CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 sd.discount_value
//             ELSE
//                 0
//         END,
//     2) AS "discountAmountPerUnit",

//     -- ✅ Calculate Total Discount Amount for all quantities
//     ROUND(
//         (CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 sd.discount_value
//             ELSE
//                 0
//         END) * carts.qty,
//     2) AS "totalDiscountAmount",

//     -- ✅ Calculate tax amount based on the discounted price
//     ROUND(
//         ((CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 pv.unit_price - sd.discount_value
//             ELSE
//                 pv.unit_price
//         END) * COALESCE(t.value, 0) / 100) * carts.qty,
//     2) AS "taxAmount",

//     -- ✅ Calculate subtotal (discounted price + tax) * quantity
//     ROUND(
//         ((CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 pv.unit_price - sd.discount_value
//             ELSE
//                 pv.unit_price
//         END) +
//         ((CASE
//             WHEN sd.discount_strategy = 'Percentage' THEN
//                 pv.unit_price - (pv.unit_price * sd.discount_value / 100)
//             WHEN sd.discount_strategy = 'Fixed' THEN
//                 pv.unit_price - sd.discount_value
//             ELSE
//                 pv.unit_price
//         END) * COALESCE(t.value, 0) / 100)) * carts.qty,
//     2) AS "subTotal"

// FROM carts
// LEFT JOIN products AS p ON p.id = carts.product_id
// LEFT JOIN taxs AS t ON t.id = p.tax_id
// LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
// LEFT JOIN selectedDiscounts sd ON sd.product_id = p.id;
// `
//   );

//   // Calculate cart summary
//   let totalQty = 0;
//   let subTotal = 0;
//   let totalDiscount = 0;
//   let totalTax = 0;
//   let grandTotal = 0;

//   result.forEach(
//     (item: {
//       qty: number;
//       taxAmount: string;
//       discountAmount: number;
//       totalDiscountAmount: number | string;
//       subTotal: string;
//     }) => {
//       const qty = +item.qty || 0;
//       const taxAmount = +item.taxAmount || 0;
//       const discountAmount = +item.totalDiscountAmount || 0;
//       const subtotalAmount = +item.subTotal;
//       const totalItemPrice = subtotalAmount - discountAmount;

//       totalQty += +qty;
//       subTotal += +subtotalAmount;
//       totalDiscount += +discountAmount;
//       totalTax += +taxAmount;
//       grandTotal += +totalItemPrice;
//     }
//   );

//   return res.status(200).json({
//     success: true,
//     message: "Get Cart list",
//     totalCount: result.length,
//     data: {
//       cartList: result,
//       cartSummary: {
//         totalQty,
//         subTotal: subTotal.toFixed(2),
//         totalDiscount: totalDiscount.toFixed(2),
//         totalTax: totalTax.toFixed(2),
//         grandTotal: grandTotal.toFixed(2),
//       },
//     },
//   });
// });
