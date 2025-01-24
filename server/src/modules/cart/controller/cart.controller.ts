import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { getDBConnection } from "../../../config/db";
import { CartEntity } from "../model/cart.entity";
import { cartValidationSchema } from "../../../validation";
import { updateCartValidationSchema } from "../../../validation/cart/updateCartValidation";
import { CustomRequest } from "../../../enums/custom-request-type";
import { logger } from "../../../middlewares/logger";
import { cartIncrementDecrementValidationSchema } from "../../../validation/cart/cartIncrementDecrementValidationSchema";
import { incrementDecrementType } from "../enums/increment-decrement-type.enum";
import { CouponType } from "../../../enums/coupon-type.enum";
import { DiscountType } from "../../../enums/discount-type.enum";

// @desc Get all Cart
// @route GET /api/v1/Cart
// @access Public
export const getCartByUser = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const userId = req.id;
    const connection = await getDBConnection();

    const results = await connection.query(
      `select 
      carts.id,
      carts.qty,
      p.id as "productId",
      p.name,
      p.slug as "slug",
      p.images,
      p.limit_purchase_qty as "limitPurchaseQty",
      p.discount_id as "discountId",
      t.name as "taxName",
      t.value as "taxValue",
      d.discount_type as "discountType",
      d.type,
      d.value as "discountValue",
      brands.name as "brandName",
      pv.id as "productVariantId",
      pv.unit_price as "unitPrice",
      pv.purchase_price as "purchasePrice",
      pv.stock_qty as "stockQty",
      s.name as "sizeName",
      (COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100 AS "tax",
      (COALESCE(pv.unit_price, 0) + COALESCE((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100, 0)) AS sutotal,
        CASE 
          WHEN 
            d.discount_type = 'Percentage'
          THEN 
            ((COALESCE(pv.unit_price, 0) + COALESCE((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100,0)) * COALESCE(d.value, 0)) / 100 
          ELSE
            COALESCE(d.value, 0)
        END
      AS "discountAmount"

      from carts 
      LEFT JOIN products as p ON p.id = carts.product_id
      LEFT JOIN brands ON brands.id = p.brand_id
      LEFT JOIN taxs as t ON t.id = p.tax_id
      LEFT JOIN product_variants as pv ON pv.id = carts.product_variant_id
      LEFT JOIN discounts as d ON d.id = p.discount_id
      LEFT JOIN sizes as s ON s.id = pv.size_id
`
    );

    // const qb = repository.createQueryBuilder("cart");
    // qb.select([
    //   "cart.id",
    //   "cart.qty",
    //   "product.name",
    //   "product.slug",
    //   "product.images",
    //   "product.limitPurchaseQty",
    //   "product.discountId",
    //   "user.name",
    //   "tax.name",
    //   "tax.value",
    //   "discount.discountType",
    //   "discount.type",
    //   "discount.value",
    //   "brand.name",
    //   "productVariant.id",
    //   "productVariant.unitPrice",
    //   "productVariant.purchasePrice",
    //   "productVariant.stockQty",
    //   "productVariant.weight",
    //   "color.name",
    //   "color.id",
    //   "size.id",
    //   "size.name",
    // ]);

    // qb.leftJoin("cart.user", "user");
    // qb.leftJoin("cart.product", "product");
    // qb.leftJoin("product.tax", "tax");
    // qb.leftJoin("product.discount", "discount");
    // qb.leftJoin("product.brand", "brand");
    // qb.leftJoin("cart.productVariant", "productVariant");
    // qb.leftJoin("productVariant.color", "color");
    // qb.leftJoin("productVariant.size", "size");

    // if (userId) qb.where({ userId });
    // const results = await qb.getMany();

    // const result = await repository.find();

    return res.status(200).json({
      success: true,
      message: "Get cart by user",
      data: results,
    });
  }
);

// @desc Get all Cart
// @route GET /api/v1/Cart
// @access Public
export const getCarts = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(CartEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: "Get all Cart",
    data: result,
  });
});

// @desc Get all Cart
// @route GET /api/v1/cart/list
// @access Public
export const getCartList = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getCartList ${req.method} ${req.url}`);
  const connection = await getDBConnection();
  // If your platform aims to prioritize customer satisfaction and compliance with typical tax laws, use
  // (Unit Price - Discount) + Tax
  // If maximizing revenue and tax collection is the primary goal
  // (Unit Price + Tax) - Discount
  const result = await connection.query(
    `SELECT 
      carts.id,
      carts.qty,
      p.name,
      p.thumbnail_image AS "thumbnailImage" ,
      t.value AS "taxValue",
      d.discount_type AS "discountType",
      d.value AS "discountValue",
      pv.unit_price AS "unitPrice",
      pv.stock_qty AS "stockQty",
      -- Calculate tax amount and round to 2 decimal places
      ROUND(((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100) * COALESCE(carts.qty, 1), 2) AS "taxAmount",
      -- Calculate subtotal (unit price + tax) * quantity and round to 2 decimal places
      ROUND(((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100)) * COALESCE(carts.qty, 1)), 2) AS "subTotal",
      -- Calculate discount amount and round to 2 decimal places
      ROUND(
          CASE 
              WHEN d.discount_type = 'Percentage' THEN 
                  (((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100))) * COALESCE(d.value, 0) / 100) * COALESCE(carts.qty, 1)
              ELSE
                  COALESCE(d.value, 0) * COALESCE(carts.qty, 1)
          END, 2
      ) AS "discountAmount"
    FROM carts 
    LEFT JOIN products AS p ON p.id = carts.product_id
    LEFT JOIN taxs AS t ON t.id = p.tax_id
    LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
    LEFT JOIN discounts AS d ON d.id = p.discount_id;
`
  );

  // Calculate cart summary
  let totalQty = 0;
  let subTotal = 0;
  let totalDiscount = 0;
  let totalTax = 0;
  let grandTotal = 0;

  result.forEach(
    (item: {
      qty: number;
      taxAmount: string;
      discountAmount: number;
      subTotal: string;
    }) => {
      const qty = +item.qty || 0;
      const taxAmount = +item.taxAmount || 0;
      const discountAmount = +item.discountAmount || 0;
      const subtotalAmount = +item.subTotal;
      const totalItemPrice = subtotalAmount - discountAmount;

      totalQty += +qty;
      subTotal += +subtotalAmount;
      totalDiscount += +discountAmount;
      totalTax += +taxAmount;
      grandTotal += +totalItemPrice;
    }
  );

  return res.status(200).json({
    success: true,
    message: "Get Cart list",
    totalCount: result.length,
    data: {
      cartList: result,
      cartSummary: {
        totalQty,
        subTotal: subTotal.toFixed(2),
        totalDiscount: totalDiscount.toFixed(2),
        totalTax: totalTax.toFixed(2),
        grandTotal: grandTotal.toFixed(2),
      },
    },
  });
});

export const applyCouponCode = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    logger.info(`Service: applyCouponCode ${req.method} ${req.url}`);
    const { couponCode } = req.body;
    const userId = req?.id; // Assuming you have user authentication in place

    const connection = await getDBConnection();

    // Step 1: Validate the coupon
    const coupon = await connection.query(
      `SELECT 
      id,
      type,
      code,
      discount_type AS "discountType",
      value,
      start_date AS "startDate",
      expiry_date AS "expiryDate",
      min_order_amount AS "minOrderAmount",
      minimum_cart_value AS "minimumCartValue",
      max_discount_value AS "maxDiscountValue",
      usage_limit AS "usageLimit",
      usage_per_user AS "usagePerUser",
      max_user AS "maxUser",
      usage_count AS "usageCount",
      status
    FROM coupons
    WHERE code = $1 AND status = true AND NOW() BETWEEN start_date AND expiry_date`,
      [couponCode]
    );

    if (!coupon.length) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired coupon" });
    }

    const validCoupon = coupon[0];

    // Step 2: Fetch the cart details
    const cart = await connection.query(
      `SELECT 
      carts.id,
      carts.qty,
      p.name,
      p.thumbnail_image AS "thumbnailImage",
      t.value AS "taxValue",
      d.discount_type AS "discountType",
      d.value AS "discountValue",
      pv.unit_price AS "unitPrice",
      pv.stock_qty AS "stockQty",
      ROUND(((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100) * COALESCE(carts.qty, 1), 2) AS "taxAmount",
      ROUND(((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100)) * COALESCE(carts.qty, 1)), 2) AS "subTotal",
      ROUND(
          CASE 
              WHEN d.discount_type = 'Percentage' THEN 
                  (((COALESCE(pv.unit_price, 0) + ((COALESCE(pv.unit_price, 0) * COALESCE(t.value, 0)) / 100))) * COALESCE(d.value, 0) / 100) * COALESCE(carts.qty, 1)
              ELSE
                  COALESCE(d.value, 0) * COALESCE(carts.qty, 1)
          END, 2
      ) AS "discountAmount"
    FROM carts
    LEFT JOIN products AS p ON p.id = carts.product_id
    LEFT JOIN taxs AS t ON t.id = p.tax_id
    LEFT JOIN product_variants AS pv ON pv.id = carts.product_variant_id
    LEFT JOIN discounts AS d ON d.id = p.discount_id
    WHERE carts.user_id = $1`,
      [userId]
    );

    if (!cart.length) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Step 3: Calculate totals
    let totalQty = 0;
    let subTotal = 0;
    let totalDiscount = 0;
    let totalTax = 0;
    let grandTotal = 0;

    cart.forEach((item: any) => {
      const qty = +item.qty || 0;
      const taxAmount = +item.taxAmount || 0;
      const discountAmount = +item.discountAmount || 0;
      const subtotalAmount = +item.subTotal;
      const totalItemPrice = subtotalAmount - discountAmount;

      totalQty += +qty;
      subTotal += +subtotalAmount;
      totalDiscount += +discountAmount;
      totalTax += +taxAmount;
      grandTotal += +totalItemPrice;
    });

    // Step 4: Apply the coupon
    if (grandTotal < validCoupon.minimumCartValue) {
      return res.status(400).json({
        success: false,
        message: `Cart value must be at least ${validCoupon.minimumCartValue} to apply this coupon`,
      });
    }

    let couponDiscount = 0;
    let shippingCharge = 50; // Example flat shipping charge (modify as per your requirements)

    if (validCoupon.type === CouponType.Order) {
      if (validCoupon.discountType === DiscountType.Percentage) {
        couponDiscount = (grandTotal * validCoupon.value) / 100;
      } else if (validCoupon.discountType === DiscountType.Fixed) {
        couponDiscount = validCoupon.value;
      }
    } else if (validCoupon.type === CouponType.Product) {
      cart.forEach((item: any) => {
        if (validCoupon.products.includes(item.product_id)) {
          if (validCoupon.discountType === DiscountType.Percentage) {
            couponDiscount += (item.subTotal * validCoupon.value) / 100;
          } else if (validCoupon.discountType === DiscountType.Fixed) {
            couponDiscount += validCoupon.value * item.qty;
          }
        }
      });
    }

    couponDiscount = Math.min(
      couponDiscount,
      validCoupon.maxDiscountValue || couponDiscount
    );

    // Step 5: Check for FreeShipping
    if (validCoupon.type === "FreeShipping") {
      shippingCharge = 0; // Waive the shipping charge
    }

    grandTotal = grandTotal - couponDiscount + shippingCharge;

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully",
      data: {
        cartList: cart,
        cartSummary: {
          totalQty,
          subTotal: subTotal.toFixed(2),
          totalDiscount: (totalDiscount + couponDiscount).toFixed(2),
          totalTax: totalTax.toFixed(2),
          shippingCharge: shippingCharge.toFixed(2),
          grandTotal: grandTotal.toFixed(2),
          couponDiscount: couponDiscount.toFixed(2),
        },
      },
    });
  }
);

// @desc Update a single Cart
// @route PUT /api/v1/Cart/:id
// @access Public
export const cartIncrementDecrement = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const validation = cartIncrementDecrementValidationSchema.safeParse({
      ...req.body,
    });

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((issue) => ({
        path: issue.path.join("."),
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

    let qty = 0;

    if (validation.data.type === incrementDecrementType.Increment) {
      qty = result.qty + 1;
    } else if (validation.data.type === incrementDecrementType.Decrement) {
      if (result.qty === 1) {
        throw new Error(
          `Minimum 1 qty should be keep otherwise you can remove`
        );
      } else {
        qty = result.qty - 1;
      }
    }
    const cartUpdate = await repository.save({ id: result.id, qty });

    return res.status(200).json({
      success: true,
      message: `Update a single Cart of id ${req.params.id}`,
      data: cartUpdate,
    });
  }
);

// @desc Get a single Cart
// @route GET /api/v1/Cart/:id
// @access Public
export const getCart = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
  }
);

// @desc Create a single Cart
// @route POST /api/v1/Cart
// @access Public
export const createCart = asyncHandler(
  async (req: CustomRequest, res: Response) => {
    const connection = await getDBConnection();

    const validation = cartValidationSchema.safeParse({
      ...req.body,
      userId: req.id,
    });

    if (!validation.success) {
      const formattedErrors = validation.error.issues.map((issue) => ({
        path: issue.path.join("."),
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
      userId: req.id,
    });

    if (findCart) {
      throw new Error(`This product is already added please update Quantity`);
    }

    const newCart = repository.create(validation.data);

    const added = await repository.save(newCart);

    return res.status(200).json({
      success: true,
      message: "Add to Cart successfully",
      data: added,
    });
  }
);

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
      path: issue.path.join("."),
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
