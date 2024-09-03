import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; 
import rootReducer from './reducers/rootReducer';

// Configuration for redux-persist
const persistConfig = {
  key: 'root',       // Key for the persisted storage
  storage,           // Define the storage type (localStorage here)
  whitelist: ['user'], // Only persist the 'user' slice, add other slices if needed
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store with the persisted reducer
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // Ignore non-serializable checks for Redux Persist actions
        ignoredPaths: ['register', 'rehydrate'], // Ignore paths that are non-serializable
      },
    }),
});

// Create the persistor instance
export const persistor = persistStore(store);

export default store;
