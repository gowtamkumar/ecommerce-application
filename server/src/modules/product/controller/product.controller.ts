import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { ProductEntity } from "../model/product.entity";
import { getDBConnection } from "../../../config/db";
import { productValidationSchema } from "../../../validation";
import { ProductVariantEntity } from "../../product-variant/model/product-variant.entity";
import { ProductCategoryEntity } from "../../product-category/model/product-category.entity";
import { Brackets } from "typeorm";
import { join } from "path";
import { FileEntity } from "../../other/file/model/file.entity";
import fs from "fs";

// @desc Get all Products
// @route GET /api/v1/products
// @access Public
export const getProducts = async (req: Request, res: Response) => {
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
      colorId,
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
      "color.name",
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
    qb.leftJoin("productVariants.color", "color");
    qb.orderBy("productVariants.id", "DESC");
    qb.addOrderBy("product.urlSlug", "ASC");

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
      qb.andWhere(`productVariants.price BETWEEN ${minPrice} AND ${maxPrice}`);

    if (discount) qb.andWhere(`discount.value BETWEEN 0 AND ${discount}`);

    // if (discount) qb.andWhere(`discount.value = :value`, { value: discount });

    if (lowPrice) qb.orderBy("productVariants.price", "ASC");
    if (highPrice) qb.orderBy("productVariants.price", "DESC");

    if (colorId)
      qb.andWhere("productVariants.colorId IN (:...colorIds)", {
        colorIds: colorId.toString().split(","),
      });

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
    try {
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
        "color",
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
      qb.leftJoin("productVariants.color", "color");
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
    const validation = productValidationSchema.safeParse({
      ...req.body,
      userId: req.id,
    });

    if (!validation.success) {
      return res.status(400).json({ message: validation.error.formErrors });
    }

    const { productVariants, productCategories, ...restData } = validation.data;

    // Generate URL slug
    const count = (await productRepository.count()) + 1;
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

      // console.log("productVariants", productVariants);

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

          // const existingVariants = await repoProductVariant.find({
          //   where: { productId: id },
          // });
          // await repoProductVariant.remove(existingVariants);

          // const newProductVariantItems = productVariants.map((item: any) => ({
          //   ...item,
          //   productId: id,
          // }));
          // console.log("🚀 ~ newProductVariantItems:", newProductVariantItems)
          // const productVariantCreate = repoProductVariant.create(
          //   newProductVariantItems
          // );

          // await repoProductVariant.save(productVariantCreate);
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

    if (result.images) {
      const repository = connection.getRepository(FileEntity);
      const directory = join(process.cwd(), "/public/uploads");
      result.images?.forEach(async (item: string) => {
        const filePath = `${directory}/${item}`;
        const [deleteFile] = await Promise.all([
          repository.findOne({ where: { filename: item } }),
          fs.promises.unlink(filePath),
        ]);
        await repository.remove(deleteFile);
      });
    }

    await productRepository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a single Product of id ${req.params.id}`,
      data: result,
    });
  }
);
