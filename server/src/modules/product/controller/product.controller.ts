import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { ProductEntity } from "../model/product.entity";
import { getDBConnection } from "../../../config/db";
import { productValidationSchema } from "../../../validation";

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const productRepository = connection.getRepository(ProductEntity);

  const results = await productRepository.find({
    select: {
      user: {
        name: true,
      },
    },
    relations: {
      user: true,
      reviews: true,
    },
  });

  return res.status(200).json({
    success: true,
    msg: "Get all Products",
    data: results,
  });
});

// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const productRepository = await connection.getRepository(ProductEntity);
    const result = await productRepository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Product of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Product
// @route POST /api/v1/products
// @access Public
export const createProduct = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  const productRepository = connection.getRepository(ProductEntity);

  const validation = productValidationSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(401).json({
      message: validation.error.formErrors,
    });
  }

  const result = await productRepository.create(validation.data);
  await productRepository.save(result);

  return res.status(200).json({
    success: true,
    msg: "Create a new Product",
    data: result,
  });
});

// @desc Update a single Product
// @route PUT /api/v1/products/:id
// @access Public
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();

    const productRepository = await connection.getRepository(ProductEntity);

    const result = await productRepository.findOneBy({ id });

    const updateData = await productRepository.merge(result, req.body);

    await productRepository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a single Product of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Get active Products
// @route GET /api/v1/products/active
// @access Public
// export const getActiveProducts = asyncHandler(
//   async (req: Request, res: Response) => {

//     const activeProduct = new ProductModel() as any;

//     const results = await activeProduct.findActive();

//     if (!results) {
//       throw new Error(`Resource not found`);
//     }
//     return res.status(200).json({
//       success: true,
//       msg: `Get active products`,
//       data: results,
//     });
//   }
// );

// @desc Find Products by name
// @route GET /api/v1/products/findbyname
// @access Public
// export const getFindByName = asyncHandler(async (req: Request, res: Response) => {

//   const results = await ProductModel.findByName();
//   if (!results) {
//     throw new Error(`Resource not found`);
//   }
//   return res.status(200).json({
//     success: true,
//     msg: `Find products by name`,
//     data: results,
//   });
// });

// @desc Query helper for Products
// @route GET /api/v1/products/queryhelper
// @access Public
// export const getQueryHelper = asyncHandler(async (req: Request, res: Response) => {
//   const product = new ProductModel() as any;

//   const results = product.find().queryhelper("react") as any;
//   if (!results) {
//     throw new Error(`Resource not found`);
//   }
//   return res.status(200).json({
//     success: true,
//     msg: `Query by product name`,
//     data: results,
//   });
// });

// @desc Delete a single Product
// @route DELETE /api/v1/products/:id
// @access Public
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const productRepository = await connection.getRepository(ProductEntity);

    const result = await productRepository.findOneBy({ id });
    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    await productRepository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Product of id ${req.params.id}`,
      data: result,
    });
  }
);
