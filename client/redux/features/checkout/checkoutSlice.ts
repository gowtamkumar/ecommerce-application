// import type { RootState } from "@/redux/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface CheckoutState {
  checkoutFormData: any;
  shippingAddress: any;
  shippingCharge: any;
}

// Define the initial state using that type
const initialState: CheckoutState = {
  checkoutFormData: {},
  shippingAddress:[],
  shippingCharge:{}
};

export const checkoutSlice = createSlice({
  name: "checkout",
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setCheckoutFormData: (state, action: PayloadAction<any>): any => {
      state.checkoutFormData = action.payload;
    },
    setShippingAddress: (state, action: PayloadAction<any>): any => {
      state.shippingAddress = action.payload;
    },
    setShippingCharge: (state, action: PayloadAction<any>): any => {
      state.shippingCharge = action.payload;
    },
  },
});

export const { setCheckoutFormData, setShippingAddress, setShippingCharge } = checkoutSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectCheckout = (state: { checkout: any; }) => state.checkout;

export default checkoutSlice.reducer;
