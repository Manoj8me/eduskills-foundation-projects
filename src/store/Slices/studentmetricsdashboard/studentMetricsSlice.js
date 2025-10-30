// src/redux/slices/studentMetricsSlice.js - Simplified Single API Version
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../../services/configUrls";

// Async thunk for fetching student metrics data
export const fetchStudentMetrics = createAsyncThunk(
  "studentMetrics/fetchData",
  async (_, { rejectWithValue, getState }) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const currentAuthorise = getState().authorise.userRole;

      console.log("Fetching student metrics using spoc4");

      const response = await axios.get(
        `${BASE_URL}/internship/students_metrics_spoc4`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        localStorage.clear();
        return rejectWithValue("Unauthorized access. Please login again.");
      }

      console.log("Raw API response:", response.data);

      return {
        data: response.data,
        authorise: currentAuthorise,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Error fetching student metrics:", error);

      if (error.response?.status === 401) {
        localStorage.clear();
        return rejectWithValue("Unauthorized access. Please login again.");
      }

      return rejectWithValue(error.response?.data || "Failed to load data");
    }
  }
);

const studentMetricsSlice = createSlice({
  name: "studentMetrics",
  initialState: {
    data: null,
    loading: false,
    error: null,
    lastFetched: null,
    storedAuthorise: null,
    shouldRefresh: false,
  },
  reducers: {
    clearMetricsData: (state) => {
      state.data = null;
      state.lastFetched = null;
    },
    resetShouldRefresh: (state) => {
      state.shouldRefresh = false;
    },
    triggerRefresh: (state) => {
      state.shouldRefresh = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentMetrics.pending, (state) => {
        state.loading = true;
        state.error = null;
        console.log("Loading student metrics data");
      })
      .addCase(fetchStudentMetrics.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.data;
        state.lastFetched = action.payload.timestamp;
        state.storedAuthorise = action.payload.authorise;
        state.shouldRefresh = false;
        console.log("Student metrics data loaded successfully");
      })
      .addCase(fetchStudentMetrics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch student metrics";
        console.log("Failed to load student metrics data:", action.payload);
      })
      // Listen for authorise changes
      .addMatcher(
        (action) => action.type.startsWith("authorise/"),
        (state, action) => {
          if (action.type === "authorise/setUserRole") {
            const newAuthorise = action.payload;
            console.log("User role changed to:", newAuthorise);

            const validRoles = ["spoc", "dspoc", "leaders", "tpo", "leader"];

            if (validRoles.includes(newAuthorise)) {
              if (state.storedAuthorise !== newAuthorise) {
                state.shouldRefresh = true;
              }
              state.storedAuthorise = newAuthorise;
            }
          } else if (action.type === "authorise/clearAuthorise") {
            console.log("Authorise cleared");
            state.storedAuthorise = "";
            state.shouldRefresh = true;
          }
        }
      );
  },
});

export const { clearMetricsData, resetShouldRefresh, triggerRefresh } =
  studentMetricsSlice.actions;

// Selectors
export const selectStudentMetricsData = (state) => state.studentMetrics.data;
export const selectStudentMetricsLoading = (state) =>
  state.studentMetrics.loading;
export const selectStudentMetricsError = (state) => state.studentMetrics.error;
export const selectLastFetched = (state) => state.studentMetrics.lastFetched;
export const selectStoredAuthorise = (state) =>
  state.studentMetrics.storedAuthorise;
export const selectShouldRefresh = (state) =>
  state.studentMetrics.shouldRefresh;

export default studentMetricsSlice.reducer;
