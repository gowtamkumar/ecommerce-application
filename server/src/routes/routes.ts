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
import categoriesRoutes from "../modules/categories/route/category.route";
import productVariantRoutes from "../modules/product-variant/route/product-variant.route";
import { AuthGuard } from "../middlewares/auth.middleware";

// Define the type for the Express application
type ExpressApp = Express;

// Export the routes setup function
export const setupRoutes = (app: ExpressApp): void => {
  app.use("/api/v1/product-variants", productVariantRoutes);
  app.use("/api/v1/categories", categoriesRoutes);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/address", addressRoutes);
  app.use("/api/v1/discounts", discountRoutes);
  app.use("/api/v1/orders", orderRoutes);
  app.use("/api/v1/order-tracking", orderTrackingRoutes);
  app.use("/api/v1/wishlists", wishlistRoutes);
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/payments", paymentRoute);
  app.use("/api/v1/reviews", reviewRoute);
};
