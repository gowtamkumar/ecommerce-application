import "reflect-metadata";
import { DataSource } from "typeorm";
import { UserEntity } from "../modules/auth/model/user.entity";
import { ProductEntity } from "../modules/product/model/product.entity";
import { evnFileValidationSchema } from "../validation";
import path from "path";
import dotenv from "dotenv";
import { AddressEntity } from "../modules/address/model/address.entity";
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
import { FileEntity } from "../modules/file/model/file.entity";

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
    ProductEntity,
    AddressEntity,
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
    ProductCategoryEntity,
    FileEntity,
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
