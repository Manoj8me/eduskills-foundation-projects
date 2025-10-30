// paymentSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeItemId: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setActiveItemId: (state, action) => {
      state.activeItemId = action.payload;
    },
    clearPayment: (state) => {
      // Reset the state to its initial values
      state.activeItemId = initialState.activeItemId;
    },
  },
});

export const { setActiveItemId, clearPayment } = paymentSlice.actions;

export default paymentSlice.reducer;
