import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../../services/productService';

export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async ({ category, token }, { rejectWithValue }) => {
    try {
      const response = await productService.getAllProducts(category, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'product/createProduct',
  async ({ productData, token }, { rejectWithValue }) => {
    try {
      const response = await productService.createProduct(productData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  'product/getProductById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addFlavorToProduct = createAsyncThunk(
  'product/addFlavorToProduct',
  async ({ productId, flavorId, token }, { rejectWithValue }) => {
    try {
      const response = await productService.addFlavorToProduct(productId, flavorId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFlavorFromProduct = createAsyncThunk(
  'product/removeFlavorFromProduct',
  async ({ productId, flavorId, token }, { rejectWithValue }) => {
    try {
      const response = await productService.removeFlavorFromProduct(productId, flavorId, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addFlavorToProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFlavorToProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct && state.currentProduct.id === action.meta.arg.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(addFlavorToProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFlavorFromProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFlavorFromProduct.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProduct && state.currentProduct.id === action.meta.arg.productId) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(removeFlavorFromProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentProduct } = productSlice.actions;
export default productSlice.reducer;