import dotenv from "dotenv";
import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserActivityEntity } from "../modules/auth/model/user-activity.entity";
import { UserEntity } from "../modules/auth/model/user.entity";
import { BannerEntity } from "../modules/banner/model/banner.entity";
import { CommentEntity } from "../modules/blog/comment/model/comment.entity";
import { PostCategoryEntity } from "../modules/blog/post/model/post-category.entity";
import { PostEntity } from "../modules/blog/post/model/post.entity";
import { BrandEntity } from "../modules/brand/model/brand.entity";
import { CartEntity } from "../modules/cart/model/cart.entity";
import { CategoriesEntity } from "../modules/categories/model/categories.entity";
import { ColorEntity } from "../modules/color/model/color.entity";
import { ContactEntity } from "../modules/contact/model/contact.entity";
import { AppliedCouponEntity } from "../modules/coupon/model/applied-coupon.entity";
import { CouponProductEntity } from "../modules/coupon/model/coupon-product.entity";
import { CouponEntity } from "../modules/coupon/model/coupon.entity";
import { ApplicableBrandEntity } from "../modules/discount/model/applicable-brand.entity";
import { ApplicableCategoryEntity } from "../modules/discount/model/applicable-category.entity";
import { ApplicableProductEntity } from "../modules/discount/model/applicable-products.entity";
import { DiscountEntity } from "../modules/discount/model/discount.entity";
import { LeadEntity } from "../modules/lead/model/lead.entity";
import { MenuEntity } from "../modules/menu/model/menu.entity";
import { OrderTrackingEntity } from "../modules/order-tracking/model/order-tracking.entity";
import { OrderItemEntity } from "../modules/order/model/order-item.entity";
import { OrderEntity } from "../modules/order/model/order.entity";
import { FileEntity } from "../modules/other/file/model/file.entity";
import { DistrictEntity } from "../modules/other/geo-location/districts/model/district.entity";
import { DivisionEntity } from "../modules/other/geo-location/divisions/model/division.entity";
import { UnionEntity } from "../modules/other/geo-location/unions/model/union.entity";
import { UpazilaEntity } from "../modules/other/geo-location/upazilas/model/upazila.entity";
import { NotificationEntity } from "../modules/other/notification/model/notification.entity";
import { SettingEntity } from "../modules/other/setting/model/setting.entity";
import { PaymentEntity } from "../modules/payment/model/payment.entity";
import { ProductCategoryEntity } from "../modules/products/product-category/model/product-category.entity";
import { ProductVariantEntity } from "../modules/products/product-variant/model/product-variant.entity";
import { ProductEntity } from "../modules/products/product/model/product.entity";
import { ReviewEntity } from "../modules/review/model/review.entity";
import { ShippingAddressEntity } from "../modules/shipping-address/model/shipping-address.entity";
import { ShippingChargeEntity } from "../modules/shipping-charge/model/shipping-charge.entity";
import { SizeEntity } from "../modules/size/model/size.entity";
import { StockAdjustEntity } from "../modules/stock-adjust/model/stock-adjust.entity";
import { TaxEntity } from "../modules/tax/model/tax.entity";
import { UnitEntity } from "../modules/unit/model/unit.entity";
import { WishListEntity } from "../modules/wishlist/model/wishlist.entity";
import { evnFileValidationSchema } from "../validation";

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";

dotenv.config({ path: envFile });

const inEnvFile = {
  DB_TYPE: process.env.DB_TYPE,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
};

const validation: any = evnFileValidationSchema.safeParse(inEnvFile);

if (validation?.error) {
  console.log("file validation", validation?.error?.formErrors.fieldErrors);
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
  synchronize: true,
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
    // StatusEntity,
    FileEntity,
    DivisionEntity,
    DistrictEntity,
    UpazilaEntity,
    UnionEntity,
    StockAdjustEntity,
    // VisitorEntity,
    // CurrencyEntity,
    BannerEntity,
    SettingEntity,
    LeadEntity,
    PostEntity,
    PostCategoryEntity,
    CommentEntity,
    // ReturnEntity,
    ContactEntity,
    MenuEntity,
    NotificationEntity,
  ],
  subscribers: [],
  migrations: [],
});

export const getDBConnection = async (): Promise<any> => {
  if (!dbConnection.isInitialized) {
    await dbConnection
      .initialize()
      .then(() => {
        console.log("database connection successfully");
      })
      .catch((error) => {
        console.log("🚀 ~ error:", error);
        console.log("Database connection error");
      });
  }
  return dbConnection;
};
