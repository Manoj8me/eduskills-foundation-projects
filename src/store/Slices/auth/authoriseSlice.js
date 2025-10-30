// In your authoriseSlice.js, modify it like this:
import { createSlice } from "@reduxjs/toolkit";
// import { handleAuthoriseChange } from "../studentmetricsdashboard/studentMetricsSlice";

const authoriseSlice = createSlice({
  name: "authorise",
  initialState: {
    userRole: localStorage.getItem("Authorise"),
  },
  reducers: {
    clearAuthorise: (state) => {
      state.userRole = "";
    },
    setUserRole: (state, action) => {
      state.userRole = action.payload;
    },
  },
});

// Enhanced action creators that also trigger the refresh
export const setUserRoleWithRefresh = (userRole) => (dispatch) => {
  dispatch(setUserRole(userRole));
  // dispatch(handleAuthoriseChange(userRole));
};

export const clearAuthoriseWithRefresh = () => (dispatch) => {
  dispatch(clearAuthorise());
  // dispatch(handleAuthoriseChange(""));
};

export const { setUserRole, clearAuthorise } = authoriseSlice.actions;
export default authoriseSlice.reducer;
