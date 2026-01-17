import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import flavorReducer from './slices/flavorSlice';
import historyReducer from './slices/historySlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    flavor: flavorReducer,
    history: historyReducer,
    order: orderReducer,
    product: productReducer,
    user: userReducer,
  },
});