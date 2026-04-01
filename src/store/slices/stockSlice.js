import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { stockService } from '../../services/stockService';

export const getAllStocks = createAsyncThunk(
  'stock/getAllStocks',
  async (token, { rejectWithValue }) => {
    try {
      const response = await stockService.getAllStocks(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getStockByProduct = createAsyncThunk(
  'stock/getStockByProduct',
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const response = await stockService.getStockByProduct(productId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateStock = createAsyncThunk(
  'stock/updateStock',
  async ({ productId, quantity, reason, token }, { rejectWithValue }) => {
    try {
      const response = await stockService.updateStock(productId, quantity, reason, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const adjustStock = createAsyncThunk(
  'stock/adjustStock',
  async ({ productId, adjustmentQuantity, reason, token }, { rejectWithValue }) => {
    try {
      const response = await stockService.adjustStock(productId, adjustmentQuantity, reason, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getStockMovements = createAsyncThunk(
  'stock/getStockMovements',
  async ({ productId, token }, { rejectWithValue }) => {
    try {
      const response = await stockService.getStockMovements(productId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getStockReport = createAsyncThunk(
  'stock/getStockReport',
  async (token, { rejectWithValue }) => {
    try {
      const response = await stockService.getStockReport(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getLowStockAlerts = createAsyncThunk(
  'stock/getLowStockAlerts',
  async ({ threshold, token }, { rejectWithValue }) => {
    try {
      const response = await stockService.getLowStockAlerts(threshold, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const transferStock = createAsyncThunk(
  'stock/transferStock',
  async ({ fromProductId, toProductId, quantity, reason, token }, { rejectWithValue }) => {
    try {
      const response = await stockService.transferStock(fromProductId, toProductId, quantity, reason, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const stockSlice = createSlice({
  name: 'stock',
  initialState: {
    stocks: [],
    movements: [],
    report: null,
    alerts: [],
    currentStock: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // getAllStocks
      .addCase(getAllStocks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllStocks.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different payload formats
        let stocksData = [];
        if (Array.isArray(action.payload)) {
          stocksData = action.payload;
        } else if (action.payload?.data?.stocks && Array.isArray(action.payload.data.stocks)) {
          stocksData = action.payload.data.stocks;
        } else if (action.payload?.stocks && Array.isArray(action.payload.stocks)) {
          stocksData = action.payload.stocks;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          stocksData = action.payload.data;
        }
        state.stocks = stocksData;
      })
      .addCase(getAllStocks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getStockByProduct
      .addCase(getStockByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStock = action.payload.data?.stock || action.payload.stock || action.payload;
      })
      .addCase(getStockByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateStock
      .addCase(updateStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStock.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Stock mis à jour avec succès';
        state.currentStock = action.payload.data?.stock || action.payload.stock || action.payload;
        const index = state.stocks.findIndex(s => s.id === action.payload.data?.stock?.id || action.payload.stock?.id);
        if (index !== -1) {
          state.stocks[index] = action.payload.data?.stock || action.payload.stock || action.payload;
        }
      })
      .addCase(updateStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // adjustStock
      .addCase(adjustStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adjustStock.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Stock ajusté avec succès';
        state.currentStock = action.payload.data?.stock || action.payload.stock || action.payload;
        const index = state.stocks.findIndex(s => s.id === action.payload.data?.stock?.id || action.payload.stock?.id);
        if (index !== -1) {
          state.stocks[index] = action.payload.data?.stock || action.payload.stock || action.payload;
        }
      })
      .addCase(adjustStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getStockMovements
      .addCase(getStockMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.movements = action.payload.data?.movements || action.payload.movements || [];
      })
      .addCase(getStockMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getStockReport
      .addCase(getStockReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getStockReport.fulfilled, (state, action) => {
        state.loading = false;
        state.report = action.payload.data?.report || action.payload.report || action.payload;
      })
      .addCase(getStockReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getLowStockAlerts
      .addCase(getLowStockAlerts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLowStockAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.alerts = action.payload.data?.alerts || action.payload.alerts || [];
      })
      .addCase(getLowStockAlerts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // transferStock
      .addCase(transferStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferStock.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Stock transféré avec succès';
        // Recharger les stocks après transfert
      })
      .addCase(transferStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = stockSlice.actions;
export default stockSlice.reducer;
