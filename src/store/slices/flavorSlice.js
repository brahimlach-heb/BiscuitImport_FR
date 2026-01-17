import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { flavorService } from '../../services/flavorService';

export const getAllFlavors = createAsyncThunk(
  'flavor/getAllFlavors',
  async (token, { rejectWithValue }) => {
    try {
      const response = await flavorService.getAllFlavors(token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createFlavor = createAsyncThunk(
  'flavor/createFlavor',
  async ({ flavorData, token }, { rejectWithValue }) => {
    try {
      const response = await flavorService.createFlavor(flavorData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFlavorById = createAsyncThunk(
  'flavor/getFlavorById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await flavorService.getFlavorById(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateFlavor = createAsyncThunk(
  'flavor/updateFlavor',
  async ({ id, flavorData, token }, { rejectWithValue }) => {
    try {
      const response = await flavorService.updateFlavor(id, flavorData, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteFlavor = createAsyncThunk(
  'flavor/deleteFlavor',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await flavorService.deleteFlavor(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const flavorSlice = createSlice({
  name: 'flavor',
  initialState: {
    flavors: [],
    currentFlavor: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentFlavor: (state, action) => {
      state.currentFlavor = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllFlavors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFlavors.fulfilled, (state, action) => {
        state.loading = false;
        state.flavors = action.payload;
      })
      .addCase(getAllFlavors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFlavor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFlavor.fulfilled, (state, action) => {
        state.loading = false;
        state.flavors.push(action.payload);
      })
      .addCase(createFlavor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFlavorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFlavorById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentFlavor = action.payload;
      })
      .addCase(getFlavorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFlavor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFlavor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.flavors.findIndex(flavor => flavor.id === action.payload.id);
        if (index !== -1) {
          state.flavors[index] = action.payload;
        }
        if (state.currentFlavor && state.currentFlavor.id === action.payload.id) {
          state.currentFlavor = action.payload;
        }
      })
      .addCase(updateFlavor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFlavor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFlavor.fulfilled, (state, action) => {
        state.loading = false;
        state.flavors = state.flavors.filter(flavor => flavor.id !== action.meta.arg.id);
        if (state.currentFlavor && state.currentFlavor.id === action.meta.arg.id) {
          state.currentFlavor = null;
        }
      })
      .addCase(deleteFlavor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentFlavor } = flavorSlice.actions;
export default flavorSlice.reducer;