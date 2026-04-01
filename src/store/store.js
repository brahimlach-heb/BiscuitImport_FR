import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import flavorReducer from './slices/flavorSlice';
import historyReducer from './slices/historySlice';
import orderReducer from './slices/orderSlice';
import productReducer from './slices/productSlice';
import userReducer from './slices/userSlice';
import roleReducer from './slices/roleSlice';
import bankReducer from './slices/bankSlice';
import stockReducer from './slices/stockSlice';
import warehouseReducer from './slices/warehouseSlice';
import supplierReducer from './slices/supplierSlice';
import purchaseOrderReducer from './slices/purchaseOrderSlice';
import returnReducer from './slices/returnSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    flavor: flavorReducer,
    history: historyReducer,
    order: orderReducer,
    product: productReducer,
    user: userReducer,
    role: roleReducer,
    bank: bankReducer,
    stock: stockReducer,
    warehouse: warehouseReducer,
    supplier: supplierReducer,
    purchaseOrder: purchaseOrderReducer,
    return: returnReducer,
  },
});