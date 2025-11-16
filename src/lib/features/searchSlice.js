import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  query: "",
};

export const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.query = action.payload;
    },

    clearSearchQuery: (state) => {
      state.query = "";
    },
  },
});

export const { setSearchQuery } = searchSlice.actions;

export default searchSlice.reducer;
