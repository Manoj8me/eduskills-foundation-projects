import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

// Async thunk for fetching student metrics data with filters
export const fetchStudentMetricsWithFilters = createAsyncThunk(
  "studentMetrics/fetchDataWithFilters",
  async (filters, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      const response = await axios.post(
        `${BASE_URL}/internship/students_metrics_staff3`,
        filters, // Pass state_id and institute_id as request body
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Store selected filters in localStorage for persistence
      if (filters?.state_id && filters?.institute_id) {
        localStorage.setItem("selectedStateId", filters.state_id);
        localStorage.setItem("selectedInstituteId", filters.institute_id);

        // If available, also store names
        if (filters?.state_name) {
          localStorage.setItem("selectedStateName", filters.state_name);
        }
        if (filters?.institute_name) {
          localStorage.setItem("selectedInstituteName", filters.institute_name);
        }
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load data"
      );
    }
  }
);

// Original thunk without filters (keeping for backward compatibility)
export const fetchStudentMetrics = createAsyncThunk(
  "studentMetrics/fetchData",
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Check if we have stored filters in localStorage
      const storedStateId = localStorage.getItem("selectedStateId");
      const storedInstituteId = localStorage.getItem("selectedInstituteId");

      // If we have stored filters, use them
      let requestBody = {};
      if (storedStateId && storedInstituteId) {
        requestBody = {
          state_id: storedStateId,
          institute_id: storedInstituteId,
        };
      }

      const response = await axios.post(
        `${BASE_URL}/internship/students_metrics_staff`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to load data"
      );
    }
  }
);

const studentNewMetricsSlice = createSlice({
  name: "studentMetrics",
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
    selectedState: null,
    selectedInstitute: null,
  },
  reducers: {
    // Enhanced clear metrics reducer
    clearMetricsData: (state) => {
      state.data = null;
      state.lastFetched = null;
      state.error = null;

      // Don't clear selections if you want them to persist
      // If you want a complete reset, uncomment these:
      // state.selectedState = null;
      // state.selectedInstitute = null;

      // The localStorage clearing should be optional depending on your needs
      // If you want to retain the selected institution between sessions,
      // don't clear localStorage
      /*
      localStorage.removeItem("selectedStateId");
      localStorage.removeItem("selectedInstituteId");
      localStorage.removeItem("selectedStateName");
      localStorage.removeItem("selectedInstituteName");
      */
    },

    // Set selected filters action
    setSelectedFilters: (state, action) => {
      state.selectedState = action.payload.state;
      state.selectedInstitute = action.payload.institute;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle original fetch action
      .addCase(fetchStudentMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = new Date().toISOString();

        // Check if we have stored filters in localStorage and set them in state
        const storedStateId = localStorage.getItem("selectedStateId");
        const storedStateName = localStorage.getItem("selectedStateName");
        const storedInstituteId = localStorage.getItem("selectedInstituteId");
        const storedInstituteName = localStorage.getItem(
          "selectedInstituteName"
        );

        if (storedStateId && storedStateName) {
          state.selectedState = {
            id: storedStateId,
            name: storedStateName,
          };
        }

        if (storedInstituteId && storedInstituteName) {
          state.selectedInstitute = {
            id: storedInstituteId,
            name: storedInstituteName,
          };
        }
      })
      .addCase(fetchStudentMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student metrics";
      })

      // Handle fetching with filters
      .addCase(fetchStudentMetricsWithFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentMetricsWithFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.lastFetched = new Date().toISOString();

        // Update state with filter info we saved in localStorage
        const storedStateId = localStorage.getItem("selectedStateId");
        const storedStateName = localStorage.getItem("selectedStateName");
        const storedInstituteId = localStorage.getItem("selectedInstituteId");
        const storedInstituteName = localStorage.getItem(
          "selectedInstituteName"
        );

        if (storedStateId) {
          state.selectedState = {
            id: storedStateId,
            name: storedStateName || "Selected State",
          };
        }

        if (storedInstituteId) {
          state.selectedInstitute = {
            id: storedInstituteId,
            name: storedInstituteName || "Selected Institute",
          };
        }
      })
      .addCase(fetchStudentMetricsWithFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student metrics";
      });
  },
});

export const { clearMetricsData, setSelectedFilters } =
  studentNewMetricsSlice.actions;

// Selectors
export const selectStudentMetricsData = (state) => {
  return state.studentNewMetrics.data;
};

export const selectStudentMetricsLoading = (state) =>
  state.studentNewMetrics.loading;
export const selectStudentMetricsError = (state) =>
  state.studentNewMetrics.error;
export const selectLastFetched = (state) => state.studentNewMetrics.lastFetched;
export const selectSelectedState = (state) =>
  state.studentNewMetrics.selectedState;
export const selectSelectedInstitute = (state) =>
  state.studentNewMetrics.selectedInstitute;

export default studentNewMetricsSlice.reducer;
