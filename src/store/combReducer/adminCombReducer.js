import { combineReducers } from "@reduxjs/toolkit";
import adminDashStateSlice from "../Slices/admin/adminDashStateSlice";

export const adminReducer = combineReducers({
  dashboardState: adminDashStateSlice,
});
