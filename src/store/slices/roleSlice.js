import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { roleService } from '../../services/roleService';

export const getAllRoles = createAsyncThunk(
  'role/getAllRoles',
  async (token, { rejectWithValue }) => {
    try {
      const response = await roleService.getAllRoles(token);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createRole = createAsyncThunk(
  'role/createRole',
  async ({ roleData, token }, { rejectWithValue }) => {
    try {
      const response = await roleService.createRole(roleData, token);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRoleById = createAsyncThunk(
  'role/getRoleById',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleById(id, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getRoleByCode = createAsyncThunk(
  'role/getRoleByCode',
  async ({ code, token }, { rejectWithValue }) => {
    try {
      const response = await roleService.getRoleByCode(code, token);
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  'role/updateRole',
  async ({ id, roleData, token }, { rejectWithValue }) => {
    try {
      const response = await roleService.updateRole(id, roleData, token);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  'role/deleteRole',
  async ({ id, token }, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id, token);
      return { id };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const roleSlice = createSlice({
  name: 'role',
  initialState: {
    roles: [],
    currentRole: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Roles
      .addCase(getAllRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllRoles.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getAllRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.roles)) {
          state.roles = [];
        }
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Role By ID
      .addCase(getRoleById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(getRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Role By Code
      .addCase(getRoleByCode.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getRoleByCode.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRole = action.payload;
      })
      .addCase(getRoleByCode.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.roles)) {
          state.roles = [];
        }
        const index = state.roles.findIndex(role => role.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        if (!Array.isArray(state.roles)) {
          state.roles = [];
        }
        state.roles = state.roles.filter(role => role.id !== action.payload.id);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearCurrentRole } = roleSlice.actions;
export default roleSlice.reducer;
