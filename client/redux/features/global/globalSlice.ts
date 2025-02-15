import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
export interface GlobalState {
  response: Record<string, any>;
  loading: Record<string, any>;
  action: Record<string, any>;
  searchText: string;
  searchedColumn: string;
  previewImage: string;
  previewTitle: string;
  previewOpen: boolean;
  formValues: Record<string, any>;
  productView: boolean;
  productRating: Record<string, any>;
  productFilter: Record<string, any>;
  setting: Record<string, any>;
  unAuthorize: boolean;
}

// Define the initial state using that type
const initialState: GlobalState = {
  response: {},
  loading: {},
  action: {},
  searchText: "",
  searchedColumn: "",
  previewImage: "",
  previewTitle: "",
  previewOpen: false,
  formValues: {},
  productView: false,
  productRating: {},
  productFilter: {},
  setting: {},
  unAuthorize: false,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setResponse: (state, action: PayloadAction<Record<string, any>>) => {
      state.response = action.payload;
    },
    setLoading: (state, action: PayloadAction<Record<string, any>>) => {
      state.loading = action.payload;
    },
    setAction: (state, action: PayloadAction<Record<string, any>>) => {
      state.action = action.payload;
    },
    setSearchText: (state, action: PayloadAction<string>) => {
      state.searchText = action.payload;
    },
    setSearchedColumn: (state, action: PayloadAction<string>) => {
      state.searchedColumn = action.payload;
    },
    setFormValues: (state, action: PayloadAction<Record<string, any>>) => {
      state.formValues = action.payload;
    },
    setProductView: (state, action: PayloadAction<boolean>) => {
      state.productView = action.payload;
    },
    setProductRating: (state, action: PayloadAction<Record<string, any>>) => {
      state.productRating = action.payload;
    },
    setProductFilter: (state, action: PayloadAction<Record<string, any>>) => {
      state.productFilter = action.payload;
    },
    setSetting: (state, action: PayloadAction<Record<string, any>>) => {
      state.setting = action.payload;
    },
    setPreviewImage: (state, action: PayloadAction<string>) => {
      state.previewImage = action.payload;
    },
    setPreviewOpen: (state, action: PayloadAction<boolean>) => {
      state.previewOpen = action.payload;
    },
    setPreviewTitle: (state, action: PayloadAction<string>) => {
      state.previewTitle = action.payload;
    },
    setUnAuthorize: (state, action: PayloadAction<boolean>) => {
      state.unAuthorize = action.payload;
    },
  },
});

// Export actions
export const {
  setResponse,
  setLoading,
  setAction,
  setSearchText,
  setSearchedColumn,
  setFormValues,
  setProductRating,
  setProductView,
  setProductFilter,
  setSetting,
  setPreviewImage,
  setPreviewOpen,
  setPreviewTitle,
  setUnAuthorize,
} = globalSlice.actions;

// Selector for accessing the global state
export const selectGlobal = (state: { global: any }) => state.global;

// Export reducer
export default globalSlice.reducer;
