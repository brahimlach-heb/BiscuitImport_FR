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

export const getPaymentsByOrder = createAsyncThunk(
  'order/getPaymentsByOrder',
  async ({ orderId, token }, { rejectWithValue }) => {
    try {
      const response = await orderService.getPaymentsByOrder(orderId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPaymentToOrder = createAsyncThunk(
  'order/addPaymentToOrder',
  async ({ orderId, paymentData, token }, { rejectWithValue }) => {
    try {
      const response = await orderService.addPaymentToOrder(orderId, paymentData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePayment = createAsyncThunk(
  'order/deletePayment',
  async ({ orderId, paymentId, token }, { rejectWithValue }) => {
    try {
      const response = await orderService.deletePayment(orderId, paymentId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateOrderDiscount = createAsyncThunk(
  'order/updateOrderDiscount',
  async ({ orderId, discountData, token }, { rejectWithValue }) => {
    try {
      const response = await orderService.updateOrderDiscount(orderId, discountData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const downloadQuote = createAsyncThunk(
  'order/downloadQuote',
  async ({ orderId, token }, { rejectWithValue }) => {
    try {
      const blob = await orderService.downloadQuote(orderId, token);
      return { orderId, blob };
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
    payments: [],
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
      })
      .addCase(getPaymentsByOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPaymentsByOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = action.payload;
      })
      .addCase(getPaymentsByOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addPaymentToOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPaymentToOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload);
      })
      .addCase(addPaymentToOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments = state.payments.filter(p => p.id !== action.payload.id);
      })
      .addCase(deletePayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrderDiscount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderDiscount.fulfilled, (state, action) => {
        state.loading = false;
        const updatedOrder = action.payload;
        const index = state.orders.findIndex(o => o.id === updatedOrder.id);
        if (index !== -1) {
          state.orders[index] = updatedOrder;
        }
        if (state.currentOrder?.id === updatedOrder.id) {
          state.currentOrder = updatedOrder;
        }
      })
      .addCase(updateOrderDiscount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;