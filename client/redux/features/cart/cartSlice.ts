// import type { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface CartState {
  carts: any;
}

// typeof window !== "undefined"
// ? JSON.parse(localStorage.getItem("carts") || "[]")
// : {},

// Define the initial state using that type
const initialState: CartState = {
  carts:
    typeof window !== "undefined"
      ? (() => {
          const stored = localStorage.getItem("carts");
          try {
            const parsed = JSON.parse(stored ?? "{}");
            return parsed;
          } catch {
            return {};
          }
        })()
      : {},
};

const calculateCartSummary = (cartList: any[], existingSummary: any = {}) => {
  if (!Array.isArray(cartList) || cartList.length === 0) {
    return {
      totalQty: 0,
      subTotal: "0.00",
      totalItemsDiscount: "0.00",
      couponDiscount: "0.00",
      totalDiscount: "0.00",
      couponId: null,
      totalTax: "0.00",
      shippingCharge: "0.00",
      grandTotal: "0.00",
    };
  }

  let totalQty = 0;
  let subTotal = 0;
  let totalTax = 0;
  let totalItemsDiscount = 0;

  for (const item of cartList) {
    const qty = Number(item.qty) || 0;
    const itemSubTotal = Number(item.subTotal) || 0;
    const itemTax = Number(item.taxAmount) || 0;
    const itemDiscount = Number(item.totalDiscountAmount) || 0;

    totalQty += qty;
    subTotal += itemSubTotal;
    totalTax += itemTax;
    totalItemsDiscount += itemDiscount;
  }

  const couponDiscount = Number(existingSummary?.couponDiscount) || 0;
  const shippingCharge = Number(existingSummary?.shippingCharge) || 0;
  const grandTotal = Math.max(0, subTotal - couponDiscount + shippingCharge);

  return {
    ...existingSummary,
    totalQty,
    subTotal: subTotal.toFixed(2),
    totalTax: totalTax.toFixed(2),
    totalItemsDiscount: totalItemsDiscount.toFixed(2),
    couponDiscount: couponDiscount.toFixed(2),
    totalDiscount: (totalItemsDiscount + couponDiscount).toFixed(2),
    grandTotal: grandTotal.toFixed(2),
    shippingCharge: shippingCharge.toFixed(2),
  };
};

export const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    replaceCart: (state, action: PayloadAction<any>): any => {
      state.carts = action.payload;
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
    addCart: (state, action: PayloadAction<any>): any => {
      const { id } = action.payload;
      const existingProductIndex = state.carts?.cartList?.findIndex(
        (item: any) => item.id === id,
      );

      if (existingProductIndex !== undefined && existingProductIndex !== -1) {
        state.carts.cartList[existingProductIndex].qty++;
      } else if (Array.isArray(state.carts)) {
        state.carts.push(action.payload);
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
    clearCart: (state): any => {
      state.carts = {};
      localStorage.removeItem("carts");
    },

    incrementCart: (state, action: PayloadAction<any>): any => {
      if (!state.carts?.cartList || !Array.isArray(state.carts.cartList))
        return;
      const existingProductIndex = state.carts.cartList.findIndex(
        (item: any) => item.id === action.payload.id,
      );
      if (existingProductIndex !== -1) {
        const item = state.carts.cartList[existingProductIndex];
        const oldQty = item.qty || 1;
        item.qty++;
        if (item.subTotal) {
          const unitPrice = Number(item.subTotal) / oldQty;
          item.subTotal = (unitPrice * item.qty).toFixed(2);
        }
        if (item.taxAmount) {
          const unitTax = Number(item.taxAmount) / oldQty;
          item.taxAmount = (unitTax * item.qty).toFixed(2);
        }
        if (item.totalDiscountAmount) {
          const unitDiscount = Number(item.totalDiscountAmount) / oldQty;
          item.totalDiscountAmount = (unitDiscount * item.qty).toFixed(2);
        }
        state.carts.cartSummary = calculateCartSummary(
          state.carts.cartList,
          state.carts.cartSummary,
        );
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },

    decrementCart: (state, action: PayloadAction<any>): any => {
      if (!state.carts?.cartList || !Array.isArray(state.carts.cartList))
        return;
      const existingProductIndex = state.carts.cartList.findIndex(
        (item: any) => item.id === action.payload.id,
      );
      if (existingProductIndex !== -1) {
        const item = state.carts.cartList[existingProductIndex];
        const oldQty = item.qty || 1;
        if (item.qty > 1) {
          item.qty--;
          if (item.subTotal) {
            const unitPrice = Number(item.subTotal) / oldQty;
            item.subTotal = (unitPrice * item.qty).toFixed(2);
          }
          if (item.taxAmount) {
            const unitTax = Number(item.taxAmount) / oldQty;
            item.taxAmount = (unitTax * item.qty).toFixed(2);
          }
          if (item.totalDiscountAmount) {
            const unitDiscount = Number(item.totalDiscountAmount) / oldQty;
            item.totalDiscountAmount = (unitDiscount * item.qty).toFixed(2);
          }
          state.carts.cartSummary = calculateCartSummary(
            state.carts.cartList,
            state.carts.cartSummary,
          );
        }
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
    removeCart: (state, action: PayloadAction<any>): any => {
      if (state.carts?.cartList && Array.isArray(state.carts.cartList)) {
        state.carts.cartList = state.carts.cartList.filter(
          (item: any) => item.id !== action.payload.id,
        );
        state.carts.cartSummary = calculateCartSummary(
          state.carts.cartList,
          state.carts.cartSummary,
        );
      }
      localStorage.setItem("carts", JSON.stringify(state.carts));
    },
    // setCartResult: (state, action: PayloadAction<any>): any => {
    //   state.cartSummary = action.payload;
    // },
  },
});

export const {
  addCart,
  decrementCart,
  removeCart,
  incrementCart,
  clearCart,
  // setCartResult,
  replaceCart,
} = cartSlice.actions;
export const selectCart = (state: { cart: any }) => state.cart;

export default cartSlice.reducer;
