// domainSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { StaffService } from "../../../services/dataService";

// Create an asynchronous thunk to fetch domain list
export const fetchStaffEduStatistics = createAsyncThunk(
  "staffEduStatistics/fetchStaffEduStatistics",
  async () => {
    try {
      const response = await StaffService.staff_Statistics();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchStaffInstitute = createAsyncThunk(
  "staffInstitute/fetchStaffInstitute",
  async () => {
    try {
      const response = await StaffService.staff_institute();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  }
);

export const fetchStaffEducator = createAsyncThunk(
  "staffEducator/fetchStaffEducator",
  async (selectedItems) => {
    try {
      const response = await StaffService.staff_internship(selectedItems);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create a Redux slice
const staffEduSlice = createSlice({
  name: "staffEducator",
  initialState: {
    statistics: [],
    instituteList: [],
    internship: [],
    selected: [],
    errorMsg: null,
    isStaticLoading: false,
    isInstLoading: false,
    isInternLoading: false,
    isMounted: true,
  },
  reducers: {
    clearStaffEducator: (state) => {
      state.statistics = [];
      state.instituteList = [];
      state.internship = [];
      state.selected = [];
      state.isStaticLoading = false;
      state.isInstLoading = false;
      state.isInternLoading = false;
    },
    setMounted: (state, action) => {
      state.isMounted = action.payload;
    },
    setSelected: (state, action) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaffEduStatistics.pending, (state) => {
        state.isStaticLoading = true;
      })
      .addCase(fetchStaffEduStatistics.fulfilled, (state, action) => {
        state.isStaticLoading = false;
        state.statistics = action.payload;
      })
      .addCase(fetchStaffEduStatistics.rejected, (state) => {
        state.isStaticLoading = false;
      })
      .addCase(fetchStaffInstitute.pending, (state) => {
        state.isInstLoading = true;
      })
      .addCase(fetchStaffInstitute.fulfilled, (state, action) => {
        state.isInstLoading = false;
        state.instituteList = action.payload;
      })
      .addCase(fetchStaffInstitute.rejected, (state) => {
        state.isInstLoading = false;
      })
      .addCase(fetchStaffEducator.pending, (state) => {
        state.isInternLoading = true;
      })
      .addCase(fetchStaffEducator.fulfilled, (state, action) => {
        state.errorMsg = null
        state.isInternLoading = false;
        state.internship = action.payload;
        if (action.payload.internships.length == []) {
          state.errorMsg =
            "Oops! It seems there is no data matching your search criteria.";
        }
      })
      .addCase(fetchStaffEducator.rejected, (state, action) => {
        state.isInternLoading = false;
        state.errorMsg =
          `${action.error.message}. Please try again later.` ||
          "There was an error while trying to fetch data. Please try again later.";
      });
  },
});

// Export the actions
export const { clearStaffEducator, setMounted, setSelected } =
  staffEduSlice.actions;

// Export the reducer
export default staffEduSlice.reducer;
