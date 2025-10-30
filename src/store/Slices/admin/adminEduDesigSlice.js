import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { AdminService } from '../../../services/dataService';

// Define the initial state
const initialState = {
  data: [],
  status: 'idle',
  error: null,
};

// Create an async thunk for fetching data
export const fetchEducatorDesignation = createAsyncThunk(
  'educatorDesignation/fetchData',
  async () => {
    try {
      const response = await AdminService.admin_educator_designation();
      return response.data; // Assuming the data is in the 'data' field of the response
    } catch (error) {
      throw error;
    }
  }
);

// Create the slice
const educatorDesignationSlice = createSlice({
  name: 'educatorDesignation',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEducatorDesignation.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEducatorDesignation.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchEducatorDesignation.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});


// Export the reducer
export default educatorDesignationSlice.reducer;
