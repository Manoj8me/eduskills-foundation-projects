import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { DashboardService } from "../../../services/dataService";

// Define the initial state
const initialState = {
  instituteState: [],
  membershipPackage: [],
  status: "idle",
  error: null,
};

// Define async thunk for fetching institute state
export const fetchInstituteState = createAsyncThunk(
  "dashboard/fetchInstituteState",
  async () => {
    const response = await DashboardService.institute_state();
    return response.data.data;
  }
);

export const fetchMembershipPackage = createAsyncThunk(
  "dashboard/fetchMembershipPackage",
  async () => {
    const response = await DashboardService.membership_package();
    return response.data.data;
  }
);

const statepackageSlice = createSlice({
  name: "statepackage",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstituteState.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchInstituteState.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.instituteState = action.payload;
      })
      .addCase(fetchInstituteState.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchMembershipPackage.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMembershipPackage.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.membershipPackage = action.payload;
      })
      .addCase(fetchMembershipPackage.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default statepackageSlice.reducer;
