import { createSlice } from "@reduxjs/toolkit";

const commonSlice = createSlice({
  name: "commonSlice",
  initialState: {
    selectedDataSearchValues: {},
  },
  reducers: {
    setSelectedDataSearchValues: (state, action) => {
      state.selectedDataSearchValues = action.payload;
    },
  },
});

export const { setSelectedDataSearchValues } = commonSlice.actions;

export default commonSlice.reducer;
