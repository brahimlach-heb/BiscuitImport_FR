import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { purchaseOrderService } from '../../services/purchaseOrderService';

export const getAllPurchaseOrders = createAsyncThunk(
  'purchaseOrders/getAllPurchaseOrders',
  async (token, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.getAllPurchaseOrders(token);
      return response.data?.purchaseOrders || response.purchaseOrders || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPurchaseOrderById = createAsyncThunk(
  'purchaseOrders/getPurchaseOrderById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.getPurchaseOrderById(id, token);
      const result = response.data?.purchaseOrder || response.purchaseOrder || response.data || response;
      
      return result;
    } catch (error) {
      console.error('Error in getPurchaseOrderById thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const createPurchaseOrder = createAsyncThunk(
  'purchaseOrders/createPurchaseOrder',
  async ({ orderData, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.createPurchaseOrder(orderData, token);
      return response.data?.purchaseOrder || response.purchaseOrder || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePurchaseOrder = createAsyncThunk(
  'purchaseOrders/updatePurchaseOrder',
  async ({ id, orderData, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.updatePurchaseOrder(id, orderData, token);
      return response.data?.purchaseOrder || response.purchaseOrder || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deletePurchaseOrder = createAsyncThunk(
  'purchaseOrders/deletePurchaseOrder',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await purchaseOrderService.deletePurchaseOrder(id, token);
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addPurchaseOrderLine = createAsyncThunk(
  'purchaseOrders/addPurchaseOrderLine',
  async ({ orderId, lineData, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.addPurchaseOrderLine(orderId, lineData, token);
      return response.data?.line || response.line || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removePurchaseOrderLine = createAsyncThunk(
  'purchaseOrders/removePurchaseOrderLine',
  async ({ orderId, lineId, token }, { rejectWithValue }) => {
    try {
      await purchaseOrderService.removePurchaseOrderLine(orderId, lineId, token);
      return { orderId, lineId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updatePurchaseOrderStatus = createAsyncThunk(
  'purchaseOrders/updatePurchaseOrderStatus',
  async ({ id, status, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.updatePurchaseOrderStatus(id, status, token);
      return response.data?.purchaseOrder || response.purchaseOrder || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const receivePurchaseOrder = createAsyncThunk(
  'purchaseOrders/receivePurchaseOrder',
  async ({ id, receivedItems, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.receivePurchaseOrder(id, receivedItems, token);
      return response.data?.purchaseOrder || response.purchaseOrder || response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPurchaseOrdersBySupplier = createAsyncThunk(
  'purchaseOrders/getPurchaseOrdersBySupplier',
  async ({ supplierId, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.getPurchaseOrdersBySupplier(supplierId, token);
      return response.data?.purchaseOrders || response.purchaseOrders || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPurchaseOrdersByStatus = createAsyncThunk(
  'purchaseOrders/getPurchaseOrdersByStatus',
  async ({ status, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.getPurchaseOrdersByStatus(status, token);
      return response.data?.purchaseOrders || response.purchaseOrders || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getPurchaseOrderHistory = createAsyncThunk(
  'purchaseOrders/getPurchaseOrderHistory',
  async ({ orderId, token }, { rejectWithValue }) => {
    try {
      const response = await purchaseOrderService.getPurchaseOrderHistory(orderId, token);
      return response.data?.history || response.history || response.data || [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  purchaseOrders: [],
  currentPurchaseOrder: null,
  purchaseOrderLines: [],
  purchaseOrderHistory: [],
  loading: false,
  error: null,
  successMessage: null,
};

const purchaseOrderSlice = createSlice({
  name: 'purchaseOrders',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentPurchaseOrder: (state, action) => {
      state.currentPurchaseOrder = action.payload;
    },
    resetCurrentPurchaseOrder: (state) => {
      state.currentPurchaseOrder = null;
    },
  },
  extraReducers: (builder) => {
    // Get All Purchase Orders
    builder
      .addCase(getAllPurchaseOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPurchaseOrders.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different payload formats
        let posData = [];
        if (Array.isArray(action.payload)) {
          posData = action.payload;
        } else if (action.payload?.data?.purchaseOrders && Array.isArray(action.payload.data.purchaseOrders)) {
          posData = action.payload.data.purchaseOrders;
        } else if (action.payload?.purchaseOrders && Array.isArray(action.payload.purchaseOrders)) {
          posData = action.payload.purchaseOrders;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          posData = action.payload.data;
        }
        state.purchaseOrders = posData;
        state.successMessage = 'Commandes d\'achat chargées avec succès';
      })
      .addCase(getAllPurchaseOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Purchase Order By ID
    builder
      .addCase(getPurchaseOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPurchaseOrder = action.payload;
      })
      .addCase(getPurchaseOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create Purchase Order
    builder
      .addCase(createPurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders.push(action.payload);
        state.successMessage = 'Commande d\'achat créée avec succès';
      })
      .addCase(createPurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Purchase Order
    builder
      .addCase(updatePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.id) {
          const index = state.purchaseOrders.findIndex((po) => po && po.id === action.payload.id);
          if (index !== -1) {
            state.purchaseOrders[index] = action.payload;
          }
          state.currentPurchaseOrder = action.payload;
        }
        state.successMessage = 'Commande d\'achat mise à jour avec succès';
      })
      .addCase(updatePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Purchase Order
    builder
      .addCase(deletePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = state.purchaseOrders.filter((po) => po.id !== action.payload);
        state.successMessage = 'Commande d\'achat supprimée avec succès';
      })
      .addCase(deletePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Purchase Order Line
    builder
      .addCase(addPurchaseOrderLine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addPurchaseOrderLine.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrderLines.push(action.payload);
        state.successMessage = 'Ligne de commande ajoutée avec succès';
      })
      .addCase(addPurchaseOrderLine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Remove Purchase Order Line
    builder
      .addCase(removePurchaseOrderLine.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removePurchaseOrderLine.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrderLines = state.purchaseOrderLines.filter(
          (line) => line.id !== action.payload.lineId
        );
        state.successMessage = 'Ligne de commande supprimée avec succès';
      })
      .addCase(removePurchaseOrderLine.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Purchase Order Status
    builder
      .addCase(updatePurchaseOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePurchaseOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.id) {
          const index = state.purchaseOrders.findIndex((po) => po && po.id === action.payload.id);
          if (index !== -1) {
            state.purchaseOrders[index] = action.payload;
          }
          state.currentPurchaseOrder = action.payload;
        }
        state.successMessage = 'Statut mis à jour avec succès';
      })
      .addCase(updatePurchaseOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Receive Purchase Order
    builder
      .addCase(receivePurchaseOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(receivePurchaseOrder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && action.payload.id) {
          const index = state.purchaseOrders.findIndex((po) => po && po.id === action.payload.id);
          if (index !== -1) {
            state.purchaseOrders[index] = action.payload;
          }
          state.currentPurchaseOrder = action.payload;
        }
        state.successMessage = 'Commande reçue avec succès';
      })
      .addCase(receivePurchaseOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Purchase Orders By Supplier
    builder
      .addCase(getPurchaseOrdersBySupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrdersBySupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPurchaseOrdersBySupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Purchase Orders By Status
    builder
      .addCase(getPurchaseOrdersByStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrdersByStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrders = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPurchaseOrdersByStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Purchase Order History
    builder
      .addCase(getPurchaseOrderHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPurchaseOrderHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.purchaseOrderHistory = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getPurchaseOrderHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, setCurrentPurchaseOrder, resetCurrentPurchaseOrder } = purchaseOrderSlice.actions;
export default purchaseOrderSlice.reducer;
