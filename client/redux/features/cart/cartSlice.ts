import type { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface cartState {
  carts: any;
}

// Define the initial state using that type
const initialState: cartState = {
  carts: [],
};

export const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    addCart: (state, action: PayloadAction<any>): any => {
      const { tax, id } = action.payload;

      const existingProductIndex = state.carts.findIndex(
        (item: any) => item.id === action.payload.id
      );
      if (existingProductIndex !== -1) {
        state.carts[existingProductIndex].qty++;
      } else {
        state.carts.push({
          ...action.payload,
          tax: tax.value,
          taxType: tax.type,
          price: 300,
          productId: +id,
          // qty: 1,
        });
      }
    },

    incrementCart: (state, action: PayloadAction<any>): any => {
      const existingProductIndex = state.carts.findIndex(
        (item: any) => item.id === action.payload.id
      );
      if (existingProductIndex !== -1) {
        state.carts[existingProductIndex].qty++;
      }
    },

    decrementCart: (state, action: PayloadAction<any>): any => {
      const existingProductIndex = state.carts.findIndex(
        (item: any) => item.id === action.payload.id
      );
      if (existingProductIndex !== -1) {
        state.carts[existingProductIndex].qty--;
      }
    },
    removeCart: (state, action: PayloadAction<any>): any => {
      const findProduct = state.carts.find(
        (item: any) => item.id === action.payload.id
      );
      if (findProduct) {
        state.carts = state.carts.filter(
          (item: any) => item.id !== findProduct.id
        );
      }
    },
  },
});

export const { addCart, decrementCart, removeCart, incrementCart } =
  cartSlice.actions;
export const selectCart = (state: RootState) => state.cart;

export default cartSlice.reducer;
