// adminInstListSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminService } from '../../../services/dataService';

// Create an async thunk for fetching data
export const fetchInstList = createAsyncThunk('adminInstList/fetchInstList', async () => {
    const response = await AdminService.admin_institute_list();
    const updateResponse = response.data.data?.map((items) => ({
        institue_id: items.institue_id,
      institute_name: items.institute_name,
      // Add other properties as needed
    }));
    return updateResponse;
  });

const adminInstListSlice = createSlice({
  name: 'adminInstList',
  initialState: {
    instituteList: [],
    isLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInstList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInstList.fulfilled, (state, action) => {
        state.instituteList = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchInstList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'An error occurred while fetching data';
      });
  },
});

export default adminInstListSlice.reducer;
