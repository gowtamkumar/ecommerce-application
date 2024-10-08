import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../modules/auth/model/user.entity";
import { ProductEntity } from "../modules/product/model/product.entity";
import { evnFileValidationSchema } from "../validation";
import dotenv from "dotenv";
import { ShippingAddressEntity } from "../modules/shipping-address/model/shipping-address.entity";
import { BrandEntity } from "../modules/brand/model/brand.entity";
import { CategoriesEntity } from "../modules/categories/model/categories.entity";
import { DiscountEntity } from "../modules/discount/model/discount.entity";
import { OrderEntity } from "../modules/order/model/order.entity";
import { OrderItemEntity } from "../modules/order/model/order-item.entity";
import { ProductVariantEntity } from "../modules/product-variant/model/product-variant.entity";
import { WishListEntity } from "../modules/wishlist/model/wishlist.entity";
import { PaymentEntity } from "../modules/payment/model/payment.entity";
import { ReviewEntity } from "../modules/review/model/review.entity";
import { OrderTrackingEntity } from "../modules/order-tracking/model/order-tracking.entity";
import { TaxEntity } from "../modules/tax/model/tax.entity";
import { SizeEntity } from "../modules/size/model/size.entity";
import { ProductCategoryEntity } from "../modules/product-category/model/product-category.entity";
import { StatusEntity } from "../modules/status/model/status.entity";
import { ColorEntity } from "../modules/color/model/color.entity";
import { UnitEntity } from "../modules/unit/model/unit.entity";
import { ShippingChargeEntity } from "../modules/shipping-charge/model/shipping-charge.entity";
import { UserActivityEntity } from "../modules/auth/model/user-activity.entity";
import { VisitorEntity } from "../modules/visitor/model/visitor.entity";
import { FileEntity } from "../modules/other/file/model/file.entity";
import { DivisionEntity } from "../modules/other/geo-location/divisions/model/division.entity";
import { DistrictEntity } from "../modules/other/geo-location/districts/model/district.entity";
import { UpazilaEntity } from "../modules/other/geo-location/upazilas/model/upazila.entity";
import { UnionEntity } from "../modules/other/geo-location/unions/model/union.entity";
import { CurrencyEntity } from "../modules/currency/model/currency.entity";
import { BannerEntity } from "../modules/banner/model/banner.entity";
import { SettingEntity } from "../modules/other/setting/model/setting.entity";
import { LeadEntity } from "../modules/lead/model/lead.entity";
import { PostEntity } from "../modules/post/model/post.entity";
import { PostCategoryEntity } from "../modules/post/model/post-category.entity";
import { CartEntity } from "../modules/cart/model/cart.entity";
import { CommentEntity } from "../modules/comment/model/comment.entity";

// dotenv.config({ path: path.join(__dirname, "../../.env") });
dotenv.config();

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
    CartEntity,
    ShippingAddressEntity,
    ShippingChargeEntity,
    BrandEntity,
    CategoriesEntity,
    DiscountEntity,
    OrderEntity,
    OrderItemEntity,
    ProductVariantEntity,
    WishListEntity,
    PaymentEntity,
    ReviewEntity,
    OrderTrackingEntity,
    TaxEntity,
    SizeEntity,
    ColorEntity,
    UnitEntity,
    StatusEntity,
    ProductCategoryEntity,
    FileEntity,
    DivisionEntity,
    DistrictEntity,
    UpazilaEntity,
    UnionEntity,
    VisitorEntity,
    CurrencyEntity,
    BannerEntity,
    SettingEntity,
    LeadEntity,
    PostEntity,
    PostCategoryEntity,
    CommentEntity
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
