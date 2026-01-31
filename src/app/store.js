import { configureStore } from "@reduxjs/toolkit";
import authReducer, { logout } from "../features/auth/authSlice.js";
import { setUnauthorizedHandler } from "../services/api.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

setUnauthorizedHandler(() => {
  store.dispatch(logout());
});
