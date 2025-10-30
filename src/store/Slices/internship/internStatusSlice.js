// internshipStatusSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InternshipService } from "../../../services/dataService";

// Create an async thunk
export const fetchInternshipStatus = createAsyncThunk(
  "internshipStatus/fetchInternshipStatus",
  async (cohort_id) => {
    try {
      const response = await InternshipService.internship_status(cohort_id);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
);


const internshipStatusSlice = createSlice({
  name: "internshipStatus",
  initialState: { data: [], isLoading: false },
  reducers: {
    // Add any additional reducers if needed
    clearInternshipStatus: (state) => {
      // Reset the state to its initial values
      state.data = [];
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInternshipStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInternshipStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInternshipStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearInternshipStatus } = internshipStatusSlice.actions;
export default internshipStatusSlice.reducer;
