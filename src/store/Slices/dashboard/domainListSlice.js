// domainSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InternshipService } from "../../../services/dataService";

// Create an asynchronous thunk to fetch domain list
export const fetchDomainList = createAsyncThunk(
  "domainList/fetchDomainList",
  async () => {
    try {
      const response = await InternshipService.domain_list();
      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

// Create a Redux slice
const domainListSlice = createSlice({
  name: "domainList",
  initialState: {
    domainList: [],
    isLoading: false,
    isMounted:true
  },
  reducers: {
    clearDomainList: (state) => {
      state.domainList = [];
      state.isLoading = false;
    },
    setMounted: (state, action) => {
      state.isMounted = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDomainList.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDomainList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.domainList = [
          { domain_id: 0, domain_name: "-- All Domain --" },
          ...action.payload,
        ];
      })
      .addCase(fetchDomainList.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

// Export the actions
export const { clearDomainList, setMounted } = domainListSlice.actions;

// Export the reducer
export default domainListSlice.reducer;
