import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { warehouseService } from '../../services/warehouseService';

export const getAllWarehouses = createAsyncThunk(
  'warehouse/getAllWarehouses',
  async (token, { rejectWithValue }) => {
    try {
      const response = await warehouseService.getAllWarehouses(token);
      return response;
    } catch (error) {
      console.error('Error in getAllWarehouses thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getWarehouseById = createAsyncThunk(
  'warehouse/getWarehouseById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.getWarehouseById(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createWarehouse = createAsyncThunk(
  'warehouse/createWarehouse',
  async ({ warehouseData, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.createWarehouse(warehouseData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateWarehouse = createAsyncThunk(
  'warehouse/updateWarehouse',
  async ({ id, warehouseData, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.updateWarehouse(id, warehouseData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteWarehouse = createAsyncThunk(
  'warehouse/deleteWarehouse',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.deleteWarehouse(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getWarehouseStock = createAsyncThunk(
  'warehouse/getWarehouseStock',
  async ({ warehouseId, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.getWarehouseStock(warehouseId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const transferBetweenWarehouses = createAsyncThunk(
  'warehouse/transferBetweenWarehouses',
  async ({ transferData, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.transferBetweenWarehouses(transferData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getWarehouseTransfers = createAsyncThunk(
  'warehouse/getWarehouseTransfers',
  async ({ warehouseId, token }, { rejectWithValue }) => {
    try {
      const response = await warehouseService.getWarehouseTransfers(warehouseId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const warehouseSlice = createSlice({
  name: 'warehouse',
  initialState: {
    warehouses: [],
    currentWarehouse: null,
    warehouseStock: [],
    transfers: [],
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
      // getAllWarehouses
      .addCase(getAllWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different payload formats
        let warehousesData = [];
        if (Array.isArray(action.payload)) {
          warehousesData = action.payload;
        } else if (action.payload?.data?.warehouses && Array.isArray(action.payload.data.warehouses)) {
          warehousesData = action.payload.data.warehouses;
        } else if (action.payload?.warehouses && Array.isArray(action.payload.warehouses)) {
          warehousesData = action.payload.warehouses;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          warehousesData = action.payload.data;
        }
        state.warehouses = warehousesData;
      })
      .addCase(getAllWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getWarehouseById
      .addCase(getWarehouseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarehouseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWarehouse = action.payload.data?.warehouse || action.payload.warehouse || action.payload;
      })
      .addCase(getWarehouseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createWarehouse
      .addCase(createWarehouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Entrepôt créé avec succès';
        const warehouse = action.payload.data?.warehouse || action.payload.warehouse || action.payload;
        state.warehouses.push(warehouse);
      })
      .addCase(createWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // updateWarehouse
      .addCase(updateWarehouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Entrepôt mis à jour avec succès';
        const warehouse = action.payload.data?.warehouse || action.payload.warehouse || action.payload;
        const index = state.warehouses.findIndex(w => w.id === warehouse.id);
        if (index !== -1) {
          state.warehouses[index] = warehouse;
        }
        state.currentWarehouse = warehouse;
      })
      .addCase(updateWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // deleteWarehouse
      .addCase(deleteWarehouse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteWarehouse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Entrepôt supprimé avec succès';
        const warehouseId = action.payload.data?.id || action.payload.id;
        state.warehouses = state.warehouses.filter(w => w.id !== warehouseId);
        if (state.currentWarehouse?.id === warehouseId) {
          state.currentWarehouse = null;
        }
      })
      .addCase(deleteWarehouse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getWarehouseStock
      .addCase(getWarehouseStock.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarehouseStock.fulfilled, (state, action) => {
        state.loading = false;
        state.warehouseStock = action.payload.data?.stock || action.payload.stock || [];
      })
      .addCase(getWarehouseStock.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // transferBetweenWarehouses
      .addCase(transferBetweenWarehouses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(transferBetweenWarehouses.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Transfert effectué avec succès';
      })
      .addCase(transferBetweenWarehouses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // getWarehouseTransfers
      .addCase(getWarehouseTransfers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWarehouseTransfers.fulfilled, (state, action) => {
        state.loading = false;
        state.transfers = action.payload.data?.transfers || action.payload.transfers || [];
      })
      .addCase(getWarehouseTransfers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = warehouseSlice.actions;
export default warehouseSlice.reducer;
