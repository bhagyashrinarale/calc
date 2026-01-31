import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUser, registerUser } from "../../services/authService.js";
import {
  clearStoredAuth,
  getStoredAuth,
  setStoredAuth,
} from "../../services/tokenStorage.js";

const storedAuth = getStoredAuth();

const initialState = {
  token: storedAuth?.token || null,
  userId: storedAuth?.userId || null,
  email: storedAuth?.email || null,
  role: storedAuth?.role || null,
  status: "idle",
  error: null,
};

const handleAuthError = (error, rejectWithValue) => {
  if (!error.response) {
    return rejectWithValue(
      "Unable to reach the server. Check VITE_API_BASE_URL and ensure the backend is running."
    );
  }
  if (error.response?.status === 403) {
    return rejectWithValue(
      "Login forbidden (403). Verify the credentials, role/permission, and backend login endpoint configuration."
    );
  }
  return rejectWithValue(error.response?.data?.message || "Unable to sign in.");
};

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await loginUser({ email, password });
    } catch (error) {
      return handleAuthError(error, rejectWithValue);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async (
    { email, password, role, firstName, lastName, phone, city },
    { rejectWithValue }
  ) => {
    try {
      return await registerUser({
        email,
        password,
        role,
        firstName,
        lastName,
        phone,
        city,
      });
    } catch (error) {
      return handleAuthError(error, rejectWithValue);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.userId = null;
      state.email = null;
      state.role = null;
      state.status = "idle";
      state.error = null;
      clearStoredAuth();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.role = action.payload.role;
        setStoredAuth({
          token: action.payload.token,
          userId: action.payload.userId,
          email: action.payload.email,
          role: action.payload.role,
        });
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.email = action.payload.email;
        state.role = action.payload.role;
        setStoredAuth({
          token: action.payload.token,
          userId: action.payload.userId,
          email: action.payload.email,
          role: action.payload.role,
        });
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearAuthError, logout } = authSlice.actions;
export default authSlice.reducer;
