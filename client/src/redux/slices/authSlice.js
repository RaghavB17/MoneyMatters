// redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Thunk for logging in a user with email and password
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { email, password });
      localStorage.setItem('authToken', response.data.token); // Set token in local storage
      return response.data; // Return user data
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Login failed. Please try again.');
    }
  }
);

// Thunk for logging in a user with OTP
export const loginWithOtp = createAsyncThunk(
  'auth/loginWithOtp',
  async ({ phoneNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, { phoneNumber });
      localStorage.setItem('authToken', response.data.token); // Set token in local storage
      return response.data; // Return user data
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'OTP login failed. Please try again.');
    }
  }
);

// Thunk for registering a user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async ({ username, email, password, firstName, lastName, phoneNumber }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
      });
      return response.data; // Return user data
    } catch (error) {
      return rejectWithValue(error.response.data.message || 'Registration failed. Please try again.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginWithOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default authSlice.reducer;
