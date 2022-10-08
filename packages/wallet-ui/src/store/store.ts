import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import walletReducer from '../slices/walletSlice';
import UIReducer from '../slices/UISlice';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['wallet', 'modals', 'networks'],
};

const walletPersistConfig = {
  key: 'wallet',
  storage,
  whitelist: ['forceReconnect'],
};

const reducers = combineReducers({
  wallet: persistReducer(walletPersistConfig, walletReducer),
  UI: UIReducer,
});

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk],
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
