import { configureStore } from "@reduxjs/toolkit";
import counterSlice from "./features/counter/counterSlice";

export const store = () => {
  return configureStore({
    reducer: {
      counter: counterSlice,
    },
  });
};

// Infer the type of store
export type AppStore = ReturnType<typeof store>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
