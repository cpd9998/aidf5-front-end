import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isOpen: true,
};

export const toggleSlice = createSlice({
  name: "toggle",
  initialState,
  reducers: {
    openNavbar: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openNavbar } = toggleSlice.actions;

export default toggleSlice.reducer;
