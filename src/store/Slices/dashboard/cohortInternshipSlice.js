import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  DashboardService,
  InternshipService,
} from "../../../services/dataService";

export const fetchCohortData = createAsyncThunk(
  "cohortInternship/fetchCohortData",
  async (cohortId) => {
    try {
      const response = await DashboardService.cohort(cohortId);

      if (response?.status === 200) {
        return response?.data;
      } else {
        throw new Error("Invalid response status");
      }
    } catch (error) {
      // console.error("Error fetching cohort data:", error);
      throw error;
    }
  }
);

export const fetchCohortList = createAsyncThunk(
  "cohortInternship/fetchCohortList",
  async () => {
    try {
      const response = await InternshipService.cohort_list();

      if (response?.status === 200) {
        return response?.data;
      } else {
        throw new Error("Invalid response status");
      }
    } catch (error) {
      // console.error("Error fetching cohort list:", error);
      throw error;
    }
  }
);

export const cohortInternshipSlice = createSlice({
  name: "cohortInternship",
  initialState: {
    cohortChart: [],
    cohortGender: [],
    cohortData: [],
    cohortList: [],
    activeCohort: 0,
    isLoading: false, // Add the isLoading state
  },
  reducers: {
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setActiveCohort: (state, action) => {
      state.activeCohort = action.payload;
    },
    clearCohortInternship: (state) => {
      // Reset the state to its initial values
      state.cohortChart = [];
      state.cohortGender = [];
      state.cohortData = [];
      state.cohortList = [];
      state.activeCohort = 0;
      state.isLoading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCohortData.pending, (state) => {
        state.isLoading = true; // Set isLoading to true when the request starts
      })
      .addCase(fetchCohortData.fulfilled, (state, action) => {
        state.cohortData = action.payload;
        state.isLoading = false; // Set isLoading to false when the request is successful
      })
      .addCase(fetchCohortData.rejected, (state) => {
        state.isLoading = false; // Set isLoading to false when the request is rejected
      })
      .addCase(fetchCohortList.pending, (state) => {
        state.isLoading = true; // Set isLoading to true when the request starts
      })
      .addCase(fetchCohortList.fulfilled, (state, action) => {
        state.cohortList = action.payload.cohort_list;
        state.activeCohort = action.payload.cohort_active;
        state.isLoading = false; // Set isLoading to false when the request is successful
      })
      .addCase(fetchCohortList.rejected, (state) => {
        state.isLoading = false; // Set isLoading to false when the request is rejected
      });
  },
});

export const { setIsLoading, setActiveCohort, clearCohortInternship } =
  cohortInternshipSlice.actions; // Export the setIsLoading action

export default cohortInternshipSlice.reducer;
