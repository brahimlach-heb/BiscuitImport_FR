import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supplierService } from '../../services/supplierService';

export const getAllSuppliers = createAsyncThunk(
  'supplier/getAllSuppliers',
  async (token, { rejectWithValue }) => {
    try {
      const response = await supplierService.getAllSuppliers(token);
      return response;
    } catch (error) {
      console.error('Error in getAllSuppliers thunk:', error);
      return rejectWithValue(error.message);
    }
  }
);

export const getSupplierById = createAsyncThunk(
  'supplier/getSupplierById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierById(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSupplier = createAsyncThunk(
  'supplier/createSupplier',
  async ({ supplierData, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.createSupplier(supplierData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplier = createAsyncThunk(
  'supplier/updateSupplier',
  async ({ id, supplierData, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.updateSupplier(id, supplierData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  'supplier/deleteSupplier',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.deleteSupplier(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSupplierProducts = createAsyncThunk(
  'supplier/getSupplierProducts',
  async ({ supplierId, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierProducts(supplierId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addSupplierProduct = createAsyncThunk(
  'supplier/addSupplierProduct',
  async ({ supplierId, productData, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.addSupplierProduct(supplierId, productData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSupplierProduct = createAsyncThunk(
  'supplier/updateSupplierProduct',
  async ({ supplierId, productId, productData, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.updateSupplierProduct(supplierId, productId, productData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getSupplierPerformance = createAsyncThunk(
  'supplier/getSupplierPerformance',
  async ({ supplierId, token }, { rejectWithValue }) => {
    try {
      const response = await supplierService.getSupplierPerformance(supplierId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const supplierSlice = createSlice({
  name: 'supplier',
  initialState: {
    suppliers: [],
    currentSupplier: null,
    supplierProducts: [],
    supplierPerformance: null,
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
      .addCase(getAllSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        // Handle different payload formats
        let suppliersData = [];
        if (Array.isArray(action.payload)) {
          suppliersData = action.payload;
        } else if (action.payload?.data?.suppliers && Array.isArray(action.payload.data.suppliers)) {
          suppliersData = action.payload.data.suppliers;
        } else if (action.payload?.suppliers && Array.isArray(action.payload.suppliers)) {
          suppliersData = action.payload.suppliers;
        } else if (action.payload?.data && Array.isArray(action.payload.data)) {
          suppliersData = action.payload.data;
        }
        state.suppliers = suppliersData;
      })
      .addCase(getAllSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSupplierById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload.data?.supplier || action.payload.supplier || action.payload;
      })
      .addCase(getSupplierById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Fournisseur créé avec succès';
        const supplier = action.payload.data?.supplier || action.payload.supplier || action.payload;
        state.suppliers.push(supplier);
      })
      .addCase(createSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Fournisseur mis à jour avec succès';
        const supplier = action.payload.data?.supplier || action.payload.supplier || action.payload;
        const index = state.suppliers.findIndex(s => s.id === supplier.id);
        if (index !== -1) {
          state.suppliers[index] = supplier;
        }
        state.currentSupplier = supplier;
      })
      .addCase(updateSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Fournisseur supprimé avec succès';
        const supplierId = action.payload.data?.id || action.payload.id;
        state.suppliers = state.suppliers.filter(s => s.id !== supplierId);
      })
      .addCase(deleteSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSupplierProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierProducts = action.payload.data?.products || action.payload.products || [];
      })
      .addCase(getSupplierProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addSupplierProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSupplierProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Produit fournisseur ajouté';
      })
      .addCase(addSupplierProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateSupplierProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSupplierProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = 'Produit fournisseur mis à jour';
      })
      .addCase(updateSupplierProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getSupplierPerformance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSupplierPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.supplierPerformance = action.payload.data?.performance || action.payload.performance || null;
      })
      .addCase(getSupplierPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess } = supplierSlice.actions;
export default supplierSlice.reducer;
