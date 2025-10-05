// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slice/authSlice.js';

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//     },
// });

// export default store;
    import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";
import { combineReducers } from "redux";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;

