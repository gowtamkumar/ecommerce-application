import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/counterSlice";
import layoutSlice from "./features/layout/layoutSlice";

export const store = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
      layout: layoutSlice
    },
  });
};

// Infer the type of store
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
