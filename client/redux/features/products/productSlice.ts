import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for an individual product
export interface Product {
  id: string; // Replace with actual fields in your product object
  name: string;
  price: number;
  description?: string;
  // Add more fields based on your data structure
}

// Define a type for the slice state
export interface ProductState {
  products: Product[]; // Array of products
  product: Product | null; // Single product or null
}

// Define the initial state using the defined type
const initialState: ProductState = {
  products: [],
  product: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
    setProduct: (state, action: PayloadAction<Product | null>) => {
      state.product = action.payload;
    },
  },
});

// Export actions
export const { setProducts, setProduct } = productSlice.actions;

// Selector to get the product state
export const selectProduct = (state: { product: ProductState; }): ProductState => state.product;

// Export the reducer
export default productSlice.reducer;
