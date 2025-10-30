// adminDashStateSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminService } from "../../../services/dataService";

// Create an asynchronous thunk to fetch domain list
export const fetchAdminDashState = createAsyncThunk(
  "adminDashState/fetchAdminDashState",
  async () => {
    try {
      const response = await AdminService.admin_dashboard_state();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create a Redux slice
const adminDashStateSlice = createSlice({
  name: "adminDashState",
  initialState: {
    memCount: [],
    stateCount: [],
    isLoading: false,
  },
  reducers: {
    clearAdminDashboard: (state) => {
      state.memCount = [];
      state.stateCount = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDashState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.memCount = action.payload?.mem_wize_count;
        state.stateCount = action.payload?.state_wise_count;
      })
      .addCase(fetchAdminDashState.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Export the actions
export const { clearAdminDashboard } = adminDashStateSlice.actions;

// Export the reducer
export default adminDashStateSlice.reducer;
