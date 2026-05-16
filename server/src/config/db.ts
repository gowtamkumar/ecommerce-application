/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrandEntity } from '@/modules/catalog/brand/model/brand.entity';
import { CategoriesEntity } from '@/modules/catalog/categories/model/categories.entity';
import { ColorEntity } from '@/modules/catalog/color/model/color.entity';
import { ProductCategoryEntity } from '@/modules/catalog/products/product-category/model/product-category.entity';
import { ProductVariantEntity } from '@/modules/catalog/products/product-variant/model/product-variant.entity';
import { ProductEntity } from '@/modules/catalog/products/product/model/product.entity';
import { SizeEntity } from '@/modules/catalog/size/model/size.entity';
import { UnitEntity } from '@/modules/catalog/unit/model/unit.entity';
import { ContactEntity } from '@/modules/communication/contact/model/contact.entity';
import { LeadEntity } from '@/modules/communication/lead/model/lead.entity';
import { ReviewEntity } from '@/modules/communication/review/model/review.entity';
import { BannerEntity } from '@/modules/content/banner/model/banner.entity';
import { CommentEntity } from '@/modules/content/blog/comment/model/comment.entity';
import { PostCategoryEntity } from '@/modules/content/blog/post/model/post-category.entity';
import { PostEntity } from '@/modules/content/blog/post/model/post.entity';
import { MenuEntity } from '@/modules/content/menu/model/menu.entity';
import { PageEntity } from '@/modules/content/page/model/page.entity';
import { CartEntity } from '@/modules/sales/cart/model/cart.entity';
import { AppliedCouponEntity } from '@/modules/sales/coupon/model/applied-coupon.entity';
import { CouponProductEntity } from '@/modules/sales/coupon/model/coupon-product.entity';
import { CouponEntity } from '@/modules/sales/coupon/model/coupon.entity';
import { ApplicableBrandEntity } from '@/modules/sales/discount/model/applicable-brand.entity';
import { ApplicableCategoryEntity } from '@/modules/sales/discount/model/applicable-category.entity';
import { ApplicableProductEntity } from '@/modules/sales/discount/model/applicable-products.entity';
import { DiscountEntity } from '@/modules/sales/discount/model/discount.entity';
import { OrderTrackingEntity } from '@/modules/sales/order-tracking/model/order-tracking.entity';
import { OrderItemEntity } from '@/modules/sales/order/model/order-item.entity';
import { OrderEntity } from '@/modules/sales/order/model/order.entity';
import { PaymentEntity } from '@/modules/sales/payment/model/payment.entity';
import { RefundEntity } from '@/modules/sales/refund/model/refund.entity';
import { ReturnEntity } from '@/modules/sales/return/model/return.entity';
import { ShippingAddressEntity } from '@/modules/sales/shipping-address/model/shipping-address.entity';
import { ShippingChargeEntity } from '@/modules/sales/shipping-charge/model/shipping-charge.entity';
import { WishListEntity } from '@/modules/sales/wishlist/model/wishlist.entity';
import { AuditLogEntity } from '@/modules/system/audit-log/model/audit-log.entity';
import { CurrencyEntity } from '@/modules/system/currency/model/currency.entity';
import { FileEntity } from '@/modules/system/other/file/model/file.entity';
import { DistrictEntity } from '@/modules/system/other/geo-location/districts/model/district.entity';
import { DivisionEntity } from '@/modules/system/other/geo-location/divisions/model/division.entity';
import { UnionEntity } from '@/modules/system/other/geo-location/unions/model/union.entity';
import { UpazilaEntity } from '@/modules/system/other/geo-location/upazilas/model/upazila.entity';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';
import { SettingEntity } from '@/modules/system/other/setting/model/setting.entity';
import { StockAdjustEntity } from '@/modules/system/stock-adjust/model/stock-adjust.entity';
import { TaxEntity } from '@/modules/system/tax/model/tax.entity';
import { UserActivityEntity } from '@/modules/user/auth/model/user-activity.entity';
import { UserEntity } from '@/modules/user/auth/model/user.entity';
import dotenv from 'dotenv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { evnFileValidationSchema } from '../validation';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({ path: envFile });

interface envFileValidation {
  DB_TYPE: string;
  DB_HOST: string;
  DB_PORT: number | string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
}

const inEnvFile = {
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
} as envFileValidation;

const validation: any = evnFileValidationSchema.safeParse(inEnvFile);

if (validation?.error) {
  console.log('file validation', validation?.error?.formErrors.fieldErrors);
}

const dbConnection = new DataSource({
  type: validation.data.DB_TYPE,
  host: validation.data.DB_HOST,
  port: Number(validation.data.DB_PORT),
  username: validation.data.DB_USERNAME,
  password: validation.data.DB_PASSWORD,
  database: validation.data.DB_DATABASE,
  // type: "postgres",
  // host: process.env.DB_HOST,
  // port: Number(process.env.DB_PORT),
  // username: process.env.DB_USERNAME,
  // password: process.env.DB_PASSWORD,
  // database: process.env.DB_DATABASE,
  synchronize: process.env.NODE_ENV === 'development' ? true : false,
  logging: false,
  entities: [
    UserEntity,
    UserActivityEntity,
    ProductEntity,
    ProductVariantEntity,
    ProductCategoryEntity,
    CouponEntity,
    CouponProductEntity,
    CartEntity,
    AppliedCouponEntity,
    ShippingAddressEntity,
    ShippingChargeEntity,
    BrandEntity,
    CategoriesEntity,
    DiscountEntity,
    ApplicableBrandEntity,
    ApplicableCategoryEntity,
    ApplicableProductEntity,
    OrderEntity,
    OrderItemEntity,
    WishListEntity,
    PaymentEntity,
    ReviewEntity,
    OrderTrackingEntity,
    TaxEntity,
    SizeEntity,
    ColorEntity,
    UnitEntity,
    FileEntity,
    DivisionEntity,
    DistrictEntity,
    UpazilaEntity,
    UnionEntity,
    StockAdjustEntity,
    BannerEntity,
    SettingEntity,
    LeadEntity,
    PostEntity,
    PostCategoryEntity,
    CommentEntity,
    ReturnEntity,
    ContactEntity,
    MenuEntity,
    NotificationEntity,
    CurrencyEntity,
    AuditLogEntity,
    PageEntity,
    RefundEntity,
  ],
  extra: {
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30000,
  },
  subscribers: [],
  migrations: [],
});

export const getDBConnection = async (): Promise<any> => {
  if (!dbConnection.isInitialized) {
    try {
      await dbConnection.initialize();
      console.log('database connection successfully');
    } catch (error) {
      console.error('🚀 ~ Database connection error:', error);
      // We don't throw here to avoid crashing the whole process unnecessarily,
      // but the caller will get an uninitialized connection.
    }
  }
  return dbConnection;
};
