// src/redux/slices/transactionsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  transactions: [],
  loading: false,
  error: null,
};

// Thunk to fetch transactions
export const fetchTransactions = createAsyncThunk(
  'transactions/fetchTransactions',
  async ({ userId, email }, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/transactions`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userid: userId,
          email: email,
        },
      });

      if (response.data.error && response.data.error === 'jwt expired') {
        alert('Your session has expired. For your security, please log in again to access your account.');
        window.location.href = '/signin'; // Redirect to sign in
        return [];
      } else {
        return response.data;
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch transactions.');
    }
  }
);

// Thunk to add a transaction
export const addTransaction = createAsyncThunk(
  'transactions/addTransaction',
  async (transaction, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/transactions/add`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.error === 'jwt expired') {
        alert('Your session has expired. For your security, please log in again to access your account.');
        window.location.href = '/signin'; // Redirect to sign in
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to add transaction.');
    }
  }
);

// Thunk to update a transaction
export const updateTransaction = createAsyncThunk(
  'transactions/updateTransaction',
  async (transaction, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/transactions/${transaction.id}`, transaction, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.data.error === 'jwt expired') {
        alert('Your session has expired. For your security, please log in again to access your account.');
        window.location.href = '/signin'; // Redirect to sign in
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to update transaction.');
    }
  }
);

// Thunk to delete a transaction
export const deleteTransaction = createAsyncThunk(
  'transactions/deleteTransaction',
  async (transactionId, { rejectWithValue }) => {
    const token = localStorage.getItem('authToken');
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/transactions/${transactionId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return transactionId;
    } catch (error) {
      if (error.response && error.response.data.error === 'jwt expired') {
        alert('Your session has expired. For your security, please log in again to access your account.');
        window.location.href = '/signin'; // Redirect to sign in
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to delete transaction.');
    }
  }
);

// Slice
const transactionSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.push(action.payload);
      })
      .addCase(addTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.transactions.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.transactions[index] = action.payload;
        }
      })
      .addCase(updateTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = state.transactions.filter((t) => t._id !== action.payload);
      })
      .addCase(deleteTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default transactionSlice.reducer;
