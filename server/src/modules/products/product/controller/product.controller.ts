import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { ProductEntity } from "../model/product.entity";
import { getDBConnection } from "../../../../config/db";
import { productValidationSchema } from "../../../../validation";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";
import { Brackets } from "typeorm";
import { updateProductValidationSchema } from "../../../../validation/products/product/updateProductValidation";
import { logger } from "../../../../middlewares/logger";
import { fileDeleteFunction } from "../../../../utils/fileDeleteFunction";
import { ProductColorEntity } from "../../product-color/model/product-color.entity";

// @desc Create a Product
// @route POST /api/v1/products
// @access Public
export const createProduct = asyncHandler(async (req: any, res: Response) => {
  logger.info(`Service: createProduct ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const productRepository = connection.getRepository(ProductEntity);

  // Validate request body
  const validation = productValidationSchema.safeParse({
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

  const { productVariants, productCategories, productColors, ...restData } =
    validation.data;
  // Generate URL slug
  const count = (await productRepository.count()) + 1;
  const sku = `SKU-${count.toString().padStart(6, "0")}`;

  // Create product entity
  const product = productRepository.create({ ...restData, sku });

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

  if (productColors?.length) {
    const productColorRepository = connection.getRepository(ProductColorEntity);
    const productColorEntities = productColors.map((color) => ({
      colorId: color,
      productId: savedProduct.id,
    }));
    promises.push(productColorRepository.save(productColorEntities));
  }

  if (productCategories?.length) {
    const productCategoryRepository = connection.getRepository(
      ProductCategoryEntity
    );
    const productCategoryEntities = productCategories.map((item) => ({
      categoryId: item,
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
});

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getProducts = async (req: Request, res: Response) => {
  logger.info(`Service: getProducts ${req.method} ${req.url}`);

  try {
    const connection = await getDBConnection(); // Assuming getDBConnection returns a Promise
    const productRepository = connection.getRepository(ProductEntity);
    const {
      search,
      lowPrice,
      highPrice,
      brandId,
      status,
      categoryId,
      minPrice,
      maxPrice,
      discount,
    } = req.query;
    const qb = productRepository.createQueryBuilder("product");
    qb.select([
      "product",
      "user.id",
      "user.name",
      "brand.id",
      "brand.name",
      "reviews.id",
      "reviews.rating",
      "reviews.comment",
      "tax.name",
      "tax.value",
      "productVariants",
      "productCategories",
      "category.id",
      "category.name",
      "size.id",
      "size.name",
      "discount.discountType",
      "discount.value",
      "discount.type",
    ]);
    qb.leftJoin("product.user", "user");
    qb.leftJoin("product.brand", "brand");
    qb.leftJoin("product.reviews", "reviews");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("product.productCategories", "productCategories");
    qb.leftJoin("productCategories.category", "category");
    qb.leftJoin("productVariants.size", "size");
    qb.orderBy("productVariants.id", "DESC");
    qb.addOrderBy("product.slug", "ASC");

    // if (brandId) qb.andWhere({ brandId });
    if (status) qb.andWhere({ status });

    if (categoryId)
      qb.andWhere("productCategories.categoryId IN (:...categoryIds)", {
        categoryIds: categoryId.toString().split(","),
      });

    if (brandId)
      qb.andWhere("product.brandId IN (:...brandIds)", {
        brandIds: brandId.toString().split(","),
      });

    if (minPrice && maxPrice)
      qb.andWhere(
        `productVariants.sale_price BETWEEN ${minPrice} AND ${maxPrice}`
      );

    if (discount) qb.andWhere(`discount.value BETWEEN 0 AND ${discount}`);

    // if (discount) qb.andWhere(`discount.value = :value`, { value: discount });

    if (lowPrice) qb.orderBy("productVariants.sale_price", "ASC");
    if (highPrice) qb.orderBy("productVariants.sale_price", "DESC");

    // if (colorId)
    //   qb.andWhere("productVariants.colorId IN (:...colorIds)", {
    //     colorIds: colorId.toString().split(","),
    //   });

    if (search) {
      qb.andWhere(
        new Brackets((db) => {
          db.orWhere("LOWER(product.name) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
          db.orWhere("LOWER(product.description) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
          db.orWhere("LOWER(product.shortDescription) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
          db.orWhere("LOWER(brand.name) ILIKE LOWER(:search)", {
            search: `%${search}%`,
          });
        })
      );
    }

    const results = await qb.getMany();

    res.status(200).json({
      success: true,
      message: "Fetched all products successfully",
      totalItem: results.length,
      data: results,
    });
  } catch (error: any) {
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
    logger.info(`Service: getProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);

    const qb = repository.createQueryBuilder("product");
    qb.select([
      "product",
      "user.id",
      "user.name",
      "reviewUser.name",
      "brand",
      "reviews.id",
      "reviews.rating",
      "reviews.comment",
      "reviews.like",
      "reviews.disLike",
      "tax",
      "productVariants",
      "category.id",
      "category.name",
      "size.id",
      "size.name",
      "discount.discountType",
      "discount.value",
      "discount.type",
      "productCategories",
    ]);
    qb.leftJoin("product.user", "user");
    qb.leftJoin("product.brand", "brand");
    qb.leftJoin("product.reviews", "reviews");
    qb.leftJoin("reviews.user", "reviewUser");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("product.productCategories", "productCategories");
    qb.leftJoin("productCategories.category", "category");
    qb.leftJoin("productVariants.size", "size");
    qb.orderBy("productVariants.id", "DESC");
    qb.where("product.id = :id", { id });

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
  }
);

// @desc Get a single Product
// @route GET /api/v1/products/:id
// @access Public
export const getProductByslug = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getProductByslug ${req.method} ${req.url}`);

    const { slug } = req.params;
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);

    const qb = repository.createQueryBuilder("product");
    qb.select([
      "product",
      "user.id",
      "user.name",
      "reviewUser.name",
      "brand",
      "reviews.id",
      "reviews.rating",
      "reviews.comment",
      "reviews.like",
      "reviews.disLike",
      "tax",
      "productVariants",
      "category.id",
      "category.name",
      "size.id",
      "size.name",
      "discount.discountType",
      "discount.value",
      "discount.type",
      "productCategories",
      "productColors.colorId",
      "color.name",
    ]);
    qb.leftJoin("product.user", "user");
    qb.leftJoin("product.brand", "brand");
    qb.leftJoin("product.reviews", "reviews");
    qb.leftJoin("reviews.user", "reviewUser");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("product.productCategories", "productCategories");
    qb.leftJoin("productCategories.category", "category");
    qb.leftJoin("product.productColors", "productColors");
    qb.leftJoin("productColors.color", "color");
    
    qb.leftJoin("productVariants.size", "size");
    qb.orderBy("productVariants.id", "DESC");
    qb.where({ slug });

    const result = await qb.getOne();

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Resource not found with id #${slug}`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `Fetched product with id #${slug}`,
      data: result,
    });
  }
);

// @desc Update a single Product
// @route PUT /api/v1/products/:id
// @access Public
export const updateProduct = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: updateProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    // Validate request body
    const validation = updateProductValidationSchema.safeParse(req.body);
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

    const { productVariants, productCategories, productColors, ...restData } =
      req.body;

    // Get DB connection
    const connection = await getDBConnection();
    const repository = connection.getRepository(ProductEntity);

    // Find the existing product
    const product = await repository.findOneBy({ id });

    if (!product) {
      throw new Error(`Product not found`);
    }
    // Handle product variants
    let productVariantPromise = Promise.resolve();
    if (productVariants) {
      productVariantPromise = (async () => {
        const repoProductVariant =
          connection.getRepository(ProductVariantEntity);

        const productVariantItems = productVariants.map(async (item: any) => {
          if (item.id) {
            await repoProductVariant.save(item);
          } else {
            const productVariantCreate = repoProductVariant.create({
              ...item,
              productId: id,
            });
            await repoProductVariant.save(productVariantCreate);
          }
        });
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

        const productCategoryItems = productCategories.map((item: number) => ({
          categoryId: item,
          productId: id,
        }));

        await repoPCategory.save(productCategoryItems);
      })();
    }

    // Handle product categories
    let productColorPromise = Promise.resolve();
    if (productColors) {
      productCategoryPromise = (async () => {
        const repoPCategory = connection.getRepository(ProductCategoryEntity);

        const existingColors = await repoPCategory.find({
          where: { productId: id },
        });
        await repoPCategory.remove(existingColors);

        const productCategoryItems = productColors.map((item: number) => ({
          colorId: item,
          productId: id,
        }));

        await repoPCategory.save(productCategoryItems);
      })();
    }

    // Wait for both operations to complete
    await Promise.all([
      productVariantPromise,
      productCategoryPromise,
      productColorPromise,
    ]);

    // Merge and save the updated product data
    const updatedProduct = repository.merge(product, restData);
    await repository.save(updatedProduct);

    return res.status(200).json({
      success: true,
      message: `Updated product with id ${id}`,
      data: updatedProduct,
    });

    // try {

    // } catch (error: any) {
    //   console.error("Error updating product:", error);
    //   return res.status(500).json({
    //     success: false,
    //     message: "An error occurred while updating the product.",
    //     error: error.message,
    //   });
    // }
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
//       message: `Get active products`,
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
//     message: `Find products by name`,
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
//     message: `Query by product name`,
//     data: results,
//   });
// });

// @desc Delete a single Product
// @route DELETE /api/v1/products/:id
// @access Public
export const deleteProduct = asyncHandler(
  async (req: Request, res: Response) => {
    logger.info(`Service: deleteProduct ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const productRepository = await connection.getRepository(ProductEntity);

    // Check if the product exists
    const product = await productRepository.findOneBy({ id });
    if (!product) {
      throw new Error(`Product not found with id #${id}`);
    }

    // If there are images associated with the product, delete them
    if (product.images && product.images.length > 0) {
      fileDeleteFunction(product.images);
    }

    // Delete the product
    await productRepository.delete({ id });

    return res.status(200).json({
      success: true,
      message: `Product with id ${id} deleted successfully.`,
      data: product,
    });
  }
);
