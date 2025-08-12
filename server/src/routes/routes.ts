import authRoutes from "../modules/auth/route/auth.route";
import brandRoutes from "../modules/brand/route/brand.route";
import discountRoutes from "../modules/discount/route/discount.route";
import orderTrackingRoutes from "../modules/order-tracking/route/order-tracking.route";
import orderRoutes from "../modules/order/route/order.route";
import paymentRoute from "../modules/payment/route/payment.route";
import productRoutes from "../modules/products/product/route/product.route";
import reviewRoute from "../modules/review/route/review.route";
import shippingAddressRoutes from "../modules/shipping-address/route/shipping-address.route";
import shippingChargeRoutes from "../modules/shipping-charge/route/shipping-charge.route";
import wishlistRoutes from "../modules/wishlist/route/wishlist.route";
// import commentRoute from "../modules/blog/comment/route/comment.route";
import colorRoute from "../modules/color/route/color.route";
import settingRoute from "../modules/other/setting/route/setting.route";
import sizeRoute from "../modules/size/route/size.route";
import taxRoute from "../modules/tax/route/tax.route";
import unitRoute from "../modules/unit/route/unit.route";
// import currencyRoute from "../modules/currency/route/currency.route";
import bannerRoute from "../modules/banner/route/banner.route";
import cartRoute from "../modules/cart/route/cart.route";
import categoriesRoute from "../modules/categories/route/category.route";
import menuRoute from "../modules/menu/route/menu.route";
import fileRoute from "../modules/other/file/route/file.route";
import districtRoute from "../modules/other/geo-location/districts/route/district.route";
import divisionRoute from "../modules/other/geo-location/divisions/route/division.route";
import unionsRoute from "../modules/other/geo-location/unions/route/union.route";
import upazilaRoute from "../modules/other/geo-location/upazilas/route/upazila.route";
import reportRoute from "../modules/other/reports/route/report.route";
import productVariantRoute from "../modules/products/product-variant/route/product-variant.route";
// import visitorRoute from "../modules/visitor/route/visitor.route";
import postRoute from "../modules/blog/post/route/post.route";
import contactsRoute from "../modules/contact/route/contact.route";
import couponRoute from "../modules/coupon/route/coupon.route";
import leadRoute from "../modules/lead/route/lead.route";
import notificationRoute from "../modules/other/notification/route/notification.route";
import homeRoute from "../modules/other/pages/home/route/home.route";
import stockAdjust from "../modules/stock-adjust/route/stock-adjust.route";
// import returnsRoute from "../modules/return/route/return.route";
import { AuthGuard, isAuthorize } from "../middlewares/auth.middleware";

// Define the type for the Express application

// Export the routes setup function
export const setupRoutes = (app: any) => {
  // auth route
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/files", fileRoute);
  app.use("/api/v1/products", productRoutes);
  app.use("/api/v1/product-variants", productVariantRoute);
  app.use("/api/v1/settings", settingRoute);
  // app.use("/api/v1/currencies", currencyRoute);
  app.use("/api/v1/banners", bannerRoute);
  app.use("/api/v1/carts", AuthGuard, cartRoute);
  app.use("/api/v1/menus", AuthGuard, menuRoute);
  app.use("/api/v1/categories", categoriesRoute);
  app.use("/api/v1/brands", brandRoutes);
  app.use("/api/v1/shipping-address", AuthGuard, shippingAddressRoutes);
  app.use(
    "/api/v1/shipping-charges",
    AuthGuard,
    isAuthorize("Admin"),
    shippingChargeRoutes
  );
  app.use("/api/v1/discounts", discountRoutes);
  app.use("/api/v1/orders", AuthGuard, orderRoutes);
  app.use("/api/v1/order-trackings", AuthGuard, orderTrackingRoutes);
  app.use("/api/v1/wishlists", AuthGuard, wishlistRoutes);
  app.use("/api/v1/payments", paymentRoute);
  app.use("/api/v1/reviews", AuthGuard, reviewRoute);
  // app.use("/api/v1/comments", AuthGuard, commentRoute);
  app.use("/api/v1/taxs", AuthGuard, taxRoute);
  app.use("/api/v1/sizes", AuthGuard, sizeRoute);
  app.use("/api/v1/units", AuthGuard, unitRoute);
  app.use("/api/v1/colors", colorRoute);
  app.use("/api/v1/reports", AuthGuard, reportRoute);
  app.use("/api/v1/notifications", AuthGuard, notificationRoute);
  app.use("/api/v1/coupons", couponRoute);
  app.use("/api/v1/stock-adjusts", AuthGuard, stockAdjust);
  // app.use("/api/v1/returns", AuthGuard, returnsRoute);
  // public route
  app.use("/api/v1/home", homeRoute);
  // app.use("/api/v1/visitors", visitorRoute);
  app.use("/api/v1/leads", leadRoute);
  app.use("/api/v1/posts", postRoute);
  app.use("/api/v1/divisions", divisionRoute);
  app.use("/api/v1/districts", districtRoute);
  app.use("/api/v1/upazilas", upazilaRoute);
  app.use("/api/v1/unions", unionsRoute);
  app.use("/api/v1/contacts", contactsRoute);
};
