// internshipStatusSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InternshipService } from "../../../services/dataService";


export const fetchInternshipRegisterStatus = createAsyncThunk(
  "internshipStatus/fetchInternshipRegisterStatus",
  async (_, { dispatch }) => {
    try {
      const response = await InternshipService.internship_register_status();
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
);

const internshipStatusRegisterSlice = createSlice({
  name: "internshipRegisterStatus",
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
      .addCase(fetchInternshipRegisterStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchInternshipRegisterStatus.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInternshipRegisterStatus.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearInternshipStatus } = internshipStatusRegisterSlice.actions;
export default internshipStatusRegisterSlice.reducer;
