import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { returnService } from '../../services/returnService';

// ===== CUSTOMER RETURNS THUNKS =====

export const getAllCustomerReturns = createAsyncThunk(
    'return/getAllCustomerReturns',
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await returnService.getAllCustomerReturns(token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getCustomerReturnById = createAsyncThunk(
    'return/getCustomerReturnById',
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.getCustomerReturnById(id, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createCustomerReturn = createAsyncThunk(
    'return/createCustomerReturn',
    async ({ returnData, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.createCustomerReturn(returnData, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateCustomerReturn = createAsyncThunk(
    'return/updateCustomerReturn',
    async ({ id, returnData, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.updateCustomerReturn(id, returnData, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteCustomerReturn = createAsyncThunk(
    'return/deleteCustomerReturn',
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await returnService.deleteCustomerReturn(id, token);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateReturnStatus = createAsyncThunk(
    'return/updateReturnStatus',
    async ({ id, status, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.updateReturnStatus(id, status, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const processReturnRefund = createAsyncThunk(
    'return/processReturnRefund',
    async ({ id, refundData, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.processReturnRefund(id, refundData, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getReturnReport = createAsyncThunk(
    'return/getReturnReport',
    async ({ filters, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.getReturnReport(filters, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ===== SUPPLIER RETURNS THUNKS =====

export const getAllSupplierReturns = createAsyncThunk(
    'return/getAllSupplierReturns',
    async ({ token }, { rejectWithValue }) => {
        try {
            const response = await returnService.getAllSupplierReturns(token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getSupplierReturnById = createAsyncThunk(
    'return/getSupplierReturnById',
    async ({ id, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.getSupplierReturnById(id, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const createSupplierReturn = createAsyncThunk(
    'return/createSupplierReturn',
    async ({ returnData, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.createSupplierReturn(returnData, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateSupplierReturn = createAsyncThunk(
    'return/updateSupplierReturn',
    async ({ id, returnData, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.updateSupplierReturn(id, returnData, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const deleteSupplierReturn = createAsyncThunk(
    'return/deleteSupplierReturn',
    async ({ id, token }, { rejectWithValue }) => {
        try {
            await returnService.deleteSupplierReturn(id, token);
            return id;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateSupplierReturnStatus = createAsyncThunk(
    'return/updateSupplierReturnStatus',
    async ({ id, status, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.updateSupplierReturnStatus(id, status, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const processSupplierCredit = createAsyncThunk(
    'return/processSupplierCredit',
    async ({ id, creditData, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.processSupplierCredit(id, creditData, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const getSupplierReturnReport = createAsyncThunk(
    'return/getSupplierReturnReport',
    async ({ filters, token }, { rejectWithValue }) => {
        try {
            const response = await returnService.getSupplierReturnReport(filters, token);
            return response.data || response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// ===== INITIAL STATE =====

const initialState = {
    // Customer Returns
    customerReturns: [],
    currentCustomerReturn: null,
    customerReturnsLoading: false,
    customerReturnsError: null,
    
    // Supplier Returns
    supplierReturns: [],
    currentSupplierReturn: null,
    supplierReturnsLoading: false,
    supplierReturnsError: null,
    
    // Reports
    returnReport: null,
    supplierReturnReport: null,
    
    // UI
    successMessage: null
};

// ===== SLICE =====

const returnSlice = createSlice({
    name: 'return',
    initialState,
    reducers: {
        clearError: (state) => {
            state.customerReturnsError = null;
            state.supplierReturnsError = null;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },
        setCurrentCustomerReturn: (state, action) => {
            state.currentCustomerReturn = action.payload;
        },
        setCurrentSupplierReturn: (state, action) => {
            state.currentSupplierReturn = action.payload;
        },
        resetCurrentCustomerReturn: (state) => {
            state.currentCustomerReturn = null;
        },
        resetCurrentSupplierReturn: (state) => {
            state.currentSupplierReturn = null;
        }
    },
    extraReducers: (builder) => {
        // ===== CUSTOMER RETURNS =====
        
        builder
            .addCase(getAllCustomerReturns.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(getAllCustomerReturns.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                // Handle different payload formats
                let crData = [];
                if (Array.isArray(action.payload)) {
                  crData = action.payload;
                } else if (action.payload?.data?.customerReturns && Array.isArray(action.payload.data.customerReturns)) {
                  crData = action.payload.data.customerReturns;
                } else if (action.payload?.customerReturns && Array.isArray(action.payload.customerReturns)) {
                  crData = action.payload.customerReturns;
                } else if (action.payload?.data && Array.isArray(action.payload.data)) {
                  crData = action.payload.data;
                }
                state.customerReturns = crData;
            })
            .addCase(getAllCustomerReturns.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        builder
            .addCase(createCustomerReturn.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(createCustomerReturn.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturns.push(action.payload);
                state.successMessage = 'Retour client créé avec succès';
            })
            .addCase(createCustomerReturn.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        builder
            .addCase(updateCustomerReturn.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(updateCustomerReturn.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                if (action.payload && action.payload.id) {
                    const index = state.customerReturns.findIndex(r => r && r.id === action.payload.id);
                    if (index !== -1) {
                        state.customerReturns[index] = action.payload;
                    }
                    state.currentCustomerReturn = action.payload;
                }
                state.successMessage = 'Retour client mis à jour';
            })
            .addCase(updateCustomerReturn.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        builder
            .addCase(deleteCustomerReturn.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(deleteCustomerReturn.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturns = state.customerReturns.filter(r => r.id !== action.payload);
                state.successMessage = 'Retour client supprimé';
            })
            .addCase(deleteCustomerReturn.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        builder
            .addCase(updateReturnStatus.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(updateReturnStatus.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                if (action.payload && action.payload.id) {
                    const index = state.customerReturns.findIndex(r => r && r.id === action.payload.id);
                    if (index !== -1 && state.customerReturns[index]) {
                        state.customerReturns[index].status = action.payload.status;
                    }
                }
                state.successMessage = 'Statut du retour mis à jour';
            })
            .addCase(updateReturnStatus.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        builder
            .addCase(processReturnRefund.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(processReturnRefund.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                state.successMessage = 'Remboursement traité avec succès';
            })
            .addCase(processReturnRefund.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        builder
            .addCase(getReturnReport.pending, (state) => {
                state.customerReturnsLoading = true;
            })
            .addCase(getReturnReport.fulfilled, (state, action) => {
                state.customerReturnsLoading = false;
                state.returnReport = action.payload;
            })
            .addCase(getReturnReport.rejected, (state, action) => {
                state.customerReturnsLoading = false;
                state.customerReturnsError = action.payload;
            });

        // ===== SUPPLIER RETURNS =====
        
        builder
            .addCase(getAllSupplierReturns.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(getAllSupplierReturns.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                // Handle different payload formats
                let srData = [];
                if (Array.isArray(action.payload)) {
                  srData = action.payload;
                } else if (action.payload?.data?.supplierReturns && Array.isArray(action.payload.data.supplierReturns)) {
                  srData = action.payload.data.supplierReturns;
                } else if (action.payload?.supplierReturns && Array.isArray(action.payload.supplierReturns)) {
                  srData = action.payload.supplierReturns;
                } else if (action.payload?.data && Array.isArray(action.payload.data)) {
                  srData = action.payload.data;
                }
                state.supplierReturns = srData;
            })
            .addCase(getAllSupplierReturns.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });

        builder
            .addCase(createSupplierReturn.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(createSupplierReturn.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturns.push(action.payload);
                state.successMessage = 'Retour fournisseur créé avec succès';
            })
            .addCase(createSupplierReturn.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });

        builder
            .addCase(updateSupplierReturn.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(updateSupplierReturn.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                if (action.payload && action.payload.id) {
                    const index = state.supplierReturns.findIndex(r => r && r.id === action.payload.id);
                    if (index !== -1) {
                        state.supplierReturns[index] = action.payload;
                    }
                    state.currentSupplierReturn = action.payload;
                }
                state.successMessage = 'Retour fournisseur mis à jour';
            })
            .addCase(updateSupplierReturn.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });

        builder
            .addCase(deleteSupplierReturn.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(deleteSupplierReturn.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturns = state.supplierReturns.filter(r => r.id !== action.payload);
                state.successMessage = 'Retour fournisseur supprimé';
            })
            .addCase(deleteSupplierReturn.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });

        builder
            .addCase(updateSupplierReturnStatus.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(updateSupplierReturnStatus.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                if (action.payload && action.payload.id) {
                    const index = state.supplierReturns.findIndex(r => r && r.id === action.payload.id);
                    if (index !== -1 && state.supplierReturns[index]) {
                        state.supplierReturns[index].status = action.payload.status;
                    }
                }
                state.successMessage = 'Statut du retour fournisseur mis à jour';
            })
            .addCase(updateSupplierReturnStatus.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });

        builder
            .addCase(processSupplierCredit.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(processSupplierCredit.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                state.successMessage = 'Crédit fournisseur traité avec succès';
            })
            .addCase(processSupplierCredit.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });

        builder
            .addCase(getSupplierReturnReport.pending, (state) => {
                state.supplierReturnsLoading = true;
            })
            .addCase(getSupplierReturnReport.fulfilled, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnReport = action.payload;
            })
            .addCase(getSupplierReturnReport.rejected, (state, action) => {
                state.supplierReturnsLoading = false;
                state.supplierReturnsError = action.payload;
            });
    }
});

export const {
    clearError,
    clearSuccessMessage,
    setCurrentCustomerReturn,
    setCurrentSupplierReturn,
    resetCurrentCustomerReturn,
    resetCurrentSupplierReturn
} = returnSlice.actions;

export default returnSlice.reducer;
