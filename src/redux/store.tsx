import { configureStore } from '@reduxjs/toolkit';
import jobReducer from './jobSlice';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import logger from 'redux-logger';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { PersistConfig } from 'redux-persist';

// Persist config for jobs state
const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['jobs'],
};

// Create a persisted reducer for the jobs slice
const persistedJobReducer = persistReducer(persistConfig, jobReducer);

// Configure the Redux store
const store = configureStore({
  reducer: {
    jobs: persistedJobReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
  devTools: process.env.NODE_ENV !== 'production',
});

// Set up Redux persistence with redux-persist
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;