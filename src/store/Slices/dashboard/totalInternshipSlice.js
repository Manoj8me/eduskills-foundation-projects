import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardService } from '../../../services/dataService';

export const fetchTotalInternshipData = createAsyncThunk(
  'totalInternship/fetchData',
  async () => {
    const response = await DashboardService.intern_total();
    return response.data;
  }
);

const totalInternshipSlice = createSlice({
  name: 'totalInternship',
  initialState: {
    internshipStatus: [],
    genderStatus: [],
    isLoading: true,
  },
  reducers: {
    clearTotalInternship: (state) => {
      // Reset the state to its initial values
      state.internshipStatus = [];
      state.genderStatus = [];
      state.isLoading = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTotalInternshipData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTotalInternshipData.fulfilled, (state, action) => {
        state.internshipStatus = action.payload.internship_total;
        state.genderStatus = action.payload.internship_gender;
        state.isLoading = false;
      })
      .addCase(fetchTotalInternshipData.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearTotalInternship } = totalInternshipSlice.actions;
export default totalInternshipSlice.reducer;
