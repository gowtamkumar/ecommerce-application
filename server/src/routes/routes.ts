import { Express } from "express";
import authRoutes from "../modules/auth/route/auth.route";
import productRoutes from "../modules/product/route/product.route";
import wishlistRoutes from "../modules/wishlist/route/wishlist.route";
import orderRoutes from "../modules/order/route/order.route";
import orderTrackingRoutes from "../modules/order-tracking/route/order-tracking.route";
import discountRoutes from "../modules/discount/route/discount.route";
import shippingAddressRoutes from "../modules/shipping-address/route/shipping-address.route";
import shippingChargeRoutes from "../modules/shipping-charge/route/shipping-charge.route";
import brandRoutes from "../modules/brand/route/brand.route";
import paymentRoute from "../modules/payment/route/payment.route";
import reviewRoute from "../modules/review/route/review.route";
import taxRoute from "../modules/tax/route/tax.route";
import sizeRoute from "../modules/size/route/size.route";
import unitRoute from "../modules/unit/route/unit.route";
import colorRoute from "../modules/color/route/color.route";
import statusRoute from "../modules/status/route/status.route";
import settingRoute from "../modules/setting/route/setting.route";
import fileRoute from "../modules/file/route/file.route";
import categoriesRoute from "../modules/categories/route/category.route";
import productVariantRoute from "../modules/product-variant/route/product-variant.route";
import divisionRoute from "../modules/geo-location/divisions/route/division.route";
import districtRoute from "../modules/geo-location/districts/route/district.route";
import upazilaRoute from "../modules/geo-location/upazilas/route/upazila.route";
import unionsRoute from "../modules/geo-location/unions/route/union.route";
import reportRoute from "../modules/reports/route/report.route";
import { AuthGuard } from "../middlewares/auth.middleware";

// Define the type for the Express application
type ExpressApp = Express;

// Export the routes setup function
export const setupRoutes = (app: ExpressApp): void => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/files", fileRoute);
  app.use("/api/v1/settings", settingRoute);
  app.use("/api/v1/product-variants", AuthGuard, productVariantRoute);
  app.use("/api/v1/categories", categoriesRoute);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/shipping-address", AuthGuard, shippingAddressRoutes);
  app.use("/api/v1/shipping-charges", AuthGuard, shippingChargeRoutes);
  app.use("/api/v1/discounts", AuthGuard, discountRoutes);
  app.use("/api/v1/orders", AuthGuard, orderRoutes);
  app.use("/api/v1/order-trackings", AuthGuard, orderTrackingRoutes);
  app.use("/api/v1/wishlists", AuthGuard, wishlistRoutes);
  app.use("/api/v1/payments", AuthGuard, paymentRoute);
  app.use("/api/v1/reviews", AuthGuard, reviewRoute);
  app.use("/api/v1/taxs", AuthGuard, taxRoute);
  app.use("/api/v1/sizes", AuthGuard, sizeRoute);
  app.use("/api/v1/units", AuthGuard, unitRoute);
  app.use("/api/v1/colors", colorRoute);
  app.use("/api/v1/status", AuthGuard, statusRoute);
  app.use("/api/v1/divisions", divisionRoute);
  app.use("/api/v1/districts", districtRoute);
  app.use("/api/v1/upazilas", upazilaRoute);
  app.use("/api/v1/unions", unionsRoute);
  app.use("/api/v1/reports", reportRoute);
};
