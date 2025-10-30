// domainSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { AdminService } from "../../../services/dataService";

// Create an asynchronous thunk to fetch domain list
export const fetchAdminDashboard = createAsyncThunk(
  "adminDashboard/fetchAdminDashboard",
  async () => {
    try {
      const response = await AdminService.admin_dashboard();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create a Redux slice
const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState: {
    corporate_list: [],
    institute: [],
    total: [],
    isLoading: false,
  },
  reducers: {
    clearAdminDashboard: (state) => {
      state.corporate_list = [];
      state.institute = [];
      state.total = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminDashboard.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.corporate_list = action.payload?.corporate_list;
        state.institute = action.payload?.institute;
        state.total = action.payload?.total;
      })
      .addCase(fetchAdminDashboard.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Export the actions
export const { clearAdminDashboard } = adminDashboardSlice.actions;

// Export the reducer
export default adminDashboardSlice.reducer;
