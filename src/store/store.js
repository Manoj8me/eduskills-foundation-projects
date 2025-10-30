import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./combineReducer";
const isDevelopment = process.env.NODE_ENV === "development";

const store = configureStore({
  reducer: rootReducer,
  devTools: isDevelopment,
});

export default store;
