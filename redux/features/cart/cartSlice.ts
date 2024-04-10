import type { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface cartState {
  carts: any;
  // collapsed: boolean;
  // screenWidth: number;
}

// Define the initial state using that type
const initialState: cartState = {
  carts: {},
  // collapsed: false,
  // screenWidth: 0,
};

export const cartSlice = createSlice({
  name: "cart",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<any>): any => {
      state.carts = action.payload;
    },

    // setCollapsed: (state, action: PayloadAction<any>): any => {
    //   state.collapsed = action.payload;
    // },

    // setScreenWidth: (state, action: PayloadAction<number>): any => {
    //   state.screenWidth = action.payload;
    // },
  },
});

export const { setCart } = cartSlice.actions;
// Other code such as selectors can use the imported `RootState` type
export const selectCart = (state: RootState) => state.cart

export default cartSlice.reducer;
