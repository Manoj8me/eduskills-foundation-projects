// dataSlice.js
import { createSlice } from '@reduxjs/toolkit';

const totalSlice = createSlice({
  name: 'total',
  initialState: {
    totalStatus: [],
    membership: [],
    isLoading: true,
  },
  reducers: {
    setData: (state, action) => {
      const { counter, membership } = action.payload;
      state.totalStatus = counter;
      state.membership = membership;
      state.isLoading = false;
    },
    clearTotal: (state) => {
      // Reset the state to its initial values
      state.totalStatus = [];
      state.membership = [];
      state.isLoading = true;
    },
  },
});

export const { setData, clearTotal } = totalSlice.actions;

export default totalSlice.reducer;
