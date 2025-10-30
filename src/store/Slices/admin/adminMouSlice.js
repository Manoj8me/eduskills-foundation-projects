import { createSlice } from "@reduxjs/toolkit";

const adminMouSlice = createSlice({
  name: "adminMou",
  initialState: {
    institute_id: null,
  },
  reducers: {
    clearMouInstituteId: (state) => {
      state.institute_id = null;
    },
    setMouInstituteId: (state, action) => {
      state.institute_id = action.payload;
    },
  },
});

export const { setMouInstituteId, clearMouInstituteId } = adminMouSlice.actions;

export default adminMouSlice.reducer;
