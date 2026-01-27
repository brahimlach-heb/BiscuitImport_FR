import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { bankService } from '../../services/bankService';

export const getAllBanks = createAsyncThunk(
  'bank/getAllBanks',
  async (token, { rejectWithValue }) => {
    try {
      const response = await bankService.getAllBanks(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createBank = createAsyncThunk(
  'bank/createBank',
  async ({ bankData, token }, { rejectWithValue }) => {
    try {
      const response = await bankService.createBank(bankData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateBank = createAsyncThunk(
  'bank/updateBank',
  async ({ id, bankData, token }, { rejectWithValue }) => {
    try {
      const response = await bankService.updateBank(id, bankData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteBank = createAsyncThunk(
  'bank/deleteBank',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await bankService.deleteBank(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bankSlice = createSlice({
  name: 'bank',
  initialState: {
    banks: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllBanks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllBanks.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = action.payload;
      })
      .addCase(getAllBanks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBank.fulfilled, (state, action) => {
        state.loading = false;
        state.banks.push(action.payload);
      })
      .addCase(createBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBank.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.banks.findIndex(b => b.id === action.payload.id);
        if (index !== -1) {
          state.banks[index] = action.payload;
        }
      })
      .addCase(updateBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBank.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBank.fulfilled, (state, action) => {
        state.loading = false;
        state.banks = state.banks.filter(b => b.id !== action.payload.id);
      })
      .addCase(deleteBank.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = bankSlice.actions;
export default bankSlice.reducer;
