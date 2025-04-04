import { Request, Response } from "express";
import { asyncHandler } from "../../../../../middlewares/async.middleware";
import { logger } from "../../../../../middlewares/logger";
import { getDBConnection } from "../../../../../config/db";
import { BannerEntity } from "../../../../banner/model/banner.entity";
import { DiscountEntity } from "../../../../discount/model/discount.entity";
import { CategoriesEntity } from "../../../../categories/model/categories.entity";
import { productsQuery, topSellingProductQuery } from "../../../../../query";

// @desc Get getHome data
// @route GET /api/v1/home
// @access Public
export const getHome = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getHome ${req.method} ${req.url}`);
  const connection = await getDBConnection();

  const { page = 1, perPage = 12 } = req.query;

  const bannerRepository = connection.getRepository(BannerEntity);

  const banners = await bannerRepository.find({
    where: { active: true },
    select: {
      id: true,
      title: true,
      image: true,
      url: true,
      description: true,
    },
  });

  const discountRepository = connection.getRepository(DiscountEntity);
  const discounts = await discountRepository.find();

  const categoriesRepository = connection.getRepository(CategoriesEntity);
  const categories = await categoriesRepository.find({
    where: { active: true },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      description: true,
      active: true,
    },
  });

  const topSellingProducts = await connection.query(topSellingProductQuery);

  const query = await productsQuery(req.query);
  const products = await connection.query(query);

  // Calculate total and totalPages
  const total = products.length > 0 ? products[0].total : 0;
  const totalPages = Math.ceil(total / +perPage);

  return res.status(200).json({
    success: true,
    message: "Get Home page data",
    data: {
      products: {
        total,
        page,
        perPage,
        totalPages,
        currentPage: +page,
        data: products,
      },
      topSellingProducts,
      banners,
      discounts,
      categories,
    },
  });
});
