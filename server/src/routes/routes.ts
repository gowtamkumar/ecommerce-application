import { Express, Request, Response, NextFunction } from "express";
import authRoutes from "../modules/auth/route/auth.route";
import productRoutes from "../modules/product/route/product.route";
import wishlistRoutes from "../modules/wishlist/route/wishlist.route";
import orderRoutes from "../modules/order/route/order.route";
import orderTrackingRoutes from "../modules/order-tracking/route/order-tracking.route";
import discountRoutes from "../modules/discount/route/discount.route";
import addressRoutes from "../modules/address/route/address.route";
import brandRoutes from "../modules/brand/route/brand.route";
import paymentRoute from "../modules/payment/route/payment.route";
import reviewRoute from "../modules/review/route/review.route";
import taxRoute from "../modules/tax/route/tax.route";
import sizeRoute from "../modules/size/route/size.route";
import statusRoute from "../modules/status/route/status.route";
import settingRoute from "../modules/setting/route/setting.route";
import fileRoute from "../modules/file/route/file.route";
import categoriesRoutes from "../modules/categories/route/category.route";
import productVariantRoutes from "../modules/product-variant/route/product-variant.route";
import { AuthGuard } from "../middlewares/auth.middleware";

// Define the type for the Express application
type ExpressApp = Express;

// Export the routes setup function
export const setupRoutes = (app: ExpressApp): void => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/files", fileRoute);
  app.use("/api/v1/settings", settingRoute);
  app.use("/api/v1/product-variants", AuthGuard, productVariantRoutes);
  app.use("/api/v1/categories", categoriesRoutes);
  app.use("/api/v1/brands", AuthGuard, brandRoutes);
  app.use("/api/v1/address", AuthGuard, addressRoutes);
  app.use("/api/v1/discounts", AuthGuard, discountRoutes);
  app.use("/api/v1/orders", AuthGuard, orderRoutes);
  app.use("/api/v1/order-tracking", AuthGuard, orderTrackingRoutes);
  app.use("/api/v1/wishlists", AuthGuard, wishlistRoutes);
  app.use("/api/v1/payments", AuthGuard, paymentRoute);
  app.use("/api/v1/reviews", AuthGuard, reviewRoute);
  app.use("/api/v1/taxs", AuthGuard, taxRoute);
  app.use("/api/v1/sizes", AuthGuard, sizeRoute);
  app.use("/api/v1/status", AuthGuard, statusRoute);
};
