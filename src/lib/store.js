import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../lib/features/counterSlice.js";
import searchReducer from "../lib/features/searchSlice.js";
import { api } from "../lib/api.js";
import { setupListeners } from "@reduxjs/toolkit/query";
import toggleReducer from "./features/toggle.js";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
    search: searchReducer,
    toggle: toggleReducer,
    [api.reducerPath]: api.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
