import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { ProductEntity } from "../model/product.entity";
import { getDBConnection } from "../../../config/db";
import { productValidationSchema } from "../../../validation";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { DataSource } from "typeorm";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const connection = await getDBConnection(); // Assuming getDBConnection returns a Promise
    const productRepository = connection.getRepository(ProductEntity);

    const qb = productRepository
      .createQueryBuilder("product")
      .select([
        "product",
        "user.id",
        "user.name",
        "brand.id",
        "brand.name",
        "reviews.id",
        "reviews.rating",
        "reviews.comment",
        "tax",
        "productVariants",
        "productCategories",
        "category.id",
        "category.name",
        "size.id",
        "size.name",
      ])
      .leftJoin("product.user", "user")
      .leftJoin("product.brand", "brand")
      .leftJoin("product.reviews", "reviews")
      .leftJoin("product.tax", "tax")
      .leftJoin("product.productVariants", "productVariants")
      .leftJoin("product.productCategories", "productCategories")
      .leftJoin("productCategories.category", "category")
      .leftJoin("productVariants.size", "size");

    const results = await qb.getMany();

    res.status(200).json({
      success: true,
      message: "Fetched all products successfully",
      data: results,
    });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching the products.",
      error: error.message,
    });
  }
};
// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
export const getProduct = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const connection = await getDBConnection();
      const repository = connection.getRepository(ProductEntity);

      const qb = repository
        .createQueryBuilder("product")
        .select([
          "product",
          "user.id",
          "user.name",
          "brand.id",
          "brand.name",
          "reviews.id",
          "reviews.rating",
          "reviews.comment",
          "tax",
          "productVariants",
          "productCategories.id",
          "category.id",
          "category.name",
          "size.id",
          "size.name",
        ])
        .leftJoin("product.user", "user")
        .leftJoin("product.brand", "brand")
        .leftJoin("product.reviews", "reviews")
        .leftJoin("product.tax", "tax")
        .leftJoin("product.productVariants", "productVariants")
        .leftJoin("product.productCategories", "productCategories")
        .leftJoin("productCategories.category", "category")
        .leftJoin("productVariants.size", "size")
        .where("product.id = :id", { id });

      const result = await qb.getOne();

      if (!result) {
        return res.status(404).json({
          success: false,
          message: `Resource not found with id #${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: `Fetched product with id #${id}`,
        data: result,
      });
    } catch (error: any) {
      console.error("Error fetching product:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while fetching the product.",
        error: error.message,
      });
    }
  }
);

// @desc Create a single Product
// @route POST /api/v1/products
// @access Public
export const createProduct = asyncHandler(async (req: any, res: Response) => {
  try {
    const connection = await getDBConnection();
    const productRepository = connection.getRepository(ProductEntity);

    // Validate request body
    const validation = productValidationSchema.safeParse(req.body);
    
    if (!validation.success) {
      console.log("validation.error.formErrors", validation.error.formErrors);
      return res.status(400).json({ message: validation.error.formErrors });
    }

    const { productVariants, productCategories, ...restData } = validation.data;

    // Generate URL slug
    const count = await productRepository.count();
    const urlSlug = `SKU-${count.toString().padStart(6, "0")}`;

    // Create product entity
    const product = productRepository.create({ ...restData, urlSlug });

    // Save product to database
    const savedProduct = await productRepository.save(product);

    // Prepare promises for saving product variants and categories
    const promises = [];

    if (productVariants?.length) {
      const productVariantRepository =
        connection.getRepository(ProductVariantEntity);
      const productVariantEntities = productVariants.map((variant) => ({
        ...variant,
        productId: savedProduct.id,
      }));
      promises.push(productVariantRepository.save(productVariantEntities));
    }

    if (productCategories?.length) {
      const productCategoryRepository = connection.getRepository(
        ProductCategoryEntity
      );
      const productCategoryEntities = productCategories.map((categoryId) => ({
        categoryId,
        productId: savedProduct.id,
      }));
      promises.push(productCategoryRepository.save(productCategoryEntities));
    }

    // Execute all promises concurrently
    await Promise.all(promises);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: savedProduct,
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the product.",
      error: error.message,
    });
  }
});

// @desc Update a single Product
// @route PUT /api/v1/products/:id
// @access Public
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { productVariants, productCategories, ...restData } = req.body;

      // Get DB connection
      const connection = await getDBConnection();
      const repository = connection.getRepository(ProductEntity);

      // Find the existing product
      const product = await repository.findOneBy({ id });
      if (!product) {
        return res
          .status(404)
          .json({ success: false, message: "Product not found" });
      }

      // Handle product variants
      let productVariantPromise = Promise.resolve();
      if (productVariants) {
        productVariantPromise = (async () => {
          const repoProductVariant =
            connection.getRepository(ProductVariantEntity);

          const existingVariants = await repoProductVariant.find({
            where: { productId: id },
          });
          await repoProductVariant.remove(existingVariants);

          const newProductVariantItems = productVariants.map((item: any) => ({
            ...item,
            productId: id,
          }));

          await repoProductVariant.save(newProductVariantItems);
        })();
      }

      // Handle product categories
      let productCategoryPromise = Promise.resolve();
      if (productCategories) {
        productCategoryPromise = (async () => {
          const repoPCategory = connection.getRepository(ProductCategoryEntity);

          const existingCategories = await repoPCategory.find({
            where: { productId: id },
          });
          await repoPCategory.remove(existingCategories);

          const productCategoryItems = productCategories.map(
            (item: number) => ({
              categoryId: item,
              productId: id,
            })
          );

          await repoPCategory.save(productCategoryItems);
        })();
      }

      // Wait for both operations to complete
      await Promise.all([productVariantPromise, productCategoryPromise]);

      // Merge and save the updated product data
      const updatedProduct = repository.merge(product, restData);
      await repository.save(updatedProduct);

      return res.status(200).json({
        success: true,
        message: `Updated product with id ${id}`,
        data: updatedProduct,
      });
    } catch (error: any) {
      console.error("Error updating product:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the product.",
        error: error.message,
      });
    }
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
