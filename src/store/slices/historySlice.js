import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { historyService } from '../../services/historyService';

export const getHistory = createAsyncThunk(
  'history/getHistory',
  async (token, { rejectWithValue }) => {
    try {
      const response = await historyService.getHistory(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    history: [],
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
      .addCase(getHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = historySlice.actions;
export default historySlice.reducer;