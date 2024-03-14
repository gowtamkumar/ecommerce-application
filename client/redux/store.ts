import { configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from "react-redux";
import { apiSlice } from "./api/apiSlice";

// ----------------------------------------------------------------------

// Define the root state type using the ReturnType utility of TypeScript
// export type RootState = ReturnType<typeof rootReducer>;

// Define the type for dispatching actions from the store
export type AppDispatch = typeof store.dispatch;

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    // add more reucer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

// Extract the dispatch function from the store for convenience
const { dispatch } = store;

const useSelector: TypedUseSelectorHook<any> = useAppSelector;

// Create a custom useDispatch hook with typed dispatch
const useDispatch = () => useAppDispatch<AppDispatch>();

// Export the Redux store, dispatch, useSelector, and useDispatch for use in components
export { store, dispatch, useSelector, useDispatch };
