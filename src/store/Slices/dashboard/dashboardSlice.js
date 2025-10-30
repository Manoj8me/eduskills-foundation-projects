import { createSlice } from "@reduxjs/toolkit";


const dashboardSlice = createSlice({
  name: "dashboard",
  initialState: { 
    cohortChart: [], 
    cohortGender: [] 
  }, 
  reducers: {
    setCohortChart: (state, action) => {
      state.cohortChart = action.payload; // Set the cohort chart data from the action payload
    },
    setCohortGender: (state, action) => {
      state.cohortGender = action.payload; // Set the cohort gender data from the action payload
    },
    clearDashboard: (state) => {
      // Reset the state to its initial values
      state.cohortChart = [];
      state.cohortGender = [];
    }
  },
});

export const { setCohortChart, setCohortGender,clearDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
