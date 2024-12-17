import { configureStore } from "@reduxjs/toolkit";
import layoutSlice from "./features/layout/layoutSlice";
import globalSlice from "./features/global/globalSlice";
import cartSlice from "./features/cart/cartSlice";
import productSlice from "./features/products/productSlice";
import checkoutSlice from "./features/checkout/checkoutSlice";

// export const store = () => {
export const store = configureStore({
  reducer: {
    checkout: checkoutSlice,
    layout: layoutSlice,
    global: globalSlice,
    cart: cartSlice,
    product: productSlice,
  },
});
// };

// Infer the type of store
// export type AppStore = ReturnType<typeof store>;
// Types for better TypeScript support
export type AppStore = typeof store;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
