import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../../services/orderService';

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrdersByUser = createAsyncThunk(
  'order/getOrdersByUser',
  async (token, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrdersByUser(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getOrderById = createAsyncThunk(
  'order/getOrderById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await orderService.getOrderById(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentOrder: (state, action) => {
      state.currentOrder = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrdersByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrdersByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;