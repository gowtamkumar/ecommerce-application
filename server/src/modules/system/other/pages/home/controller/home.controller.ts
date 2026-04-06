import { getDBConnection } from '@/config/db';
import { asyncHandler } from '@/middlewares/async.middleware';
import { logger } from '@/middlewares/logger';
import { CategoriesEntity } from '@/modules/catalog/categories/model/categories.entity';
import { BannerEntity } from '@/modules/content/banner/model/banner.entity';
import { PostStatus } from '@/modules/content/blog/post/enums';
import { PostEntity } from '@/modules/content/blog/post/model/post.entity';
import { SettingEntity } from '@/modules/system/other/setting/model/setting.entity';
import { productsQuery, topSellingProductQuery } from '@/sqlQuery';
import { Request, Response } from 'express';

// @desc Get getHome data
// @route GET /api/v1/home
// @access Public
export const getHome = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getHome ${req.method} ${req.url}`);
  const connection = await getDBConnection();

  const { page = 1, perPage = 16 } = req.query;

  const result = await connection.getRepository(SettingEntity).find();

  const banners = await connection.getRepository(BannerEntity).find({
    where: { active: true },
  });

  const categories = await connection.getRepository(CategoriesEntity).find({
    where: {
      active: true,
      isFeatured: true, // BOTH must be true
    },
    select: {
      id: true,
      name: true,
      slug: true,
      image: true,
      isFeatured: true,
      active: true,
    },
  });

  const posts = await connection.getRepository(PostEntity).find({
    where: { status: PostStatus.Published },
    order: {
      createdAt: 'DESC', // latest first
    },
    take: 3,
    select: {
      id: true,
      slug: true,
      title: true,
      image: true,
      status: true,
    },
  });

  const topSellingProducts = await connection.query(topSellingProductQuery);

  const { query, values } = await productsQuery(req.query);
  const products = await connection.query(query, values);

  // Calculate total and totalPages
  const total = products.length > 0 ? products[0].total : 0;
  const totalPages = Math.ceil(total / +perPage);

  return res.status(200).json({
    success: true,
    message: 'Get successfully',
    data: {
      products: {
        total,
        page,
        perPage,
        totalPages,
        currentPage: +page,
        data: products,
      },
      homePage: result[0]?.homePage,
      topSellingProducts,
      banners,
      categories,
      posts,
    },
  });
});
