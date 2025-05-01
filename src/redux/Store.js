// src/store/store.js
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import loginReducer from './reducer/LoginSlice';
import MetaDataReducer from './reducer/MetaDataSlice'


// 👇 Import your slices here
// import authReducer from './slices/authSlice';  // Example slice

// Combine all reducers
const rootReducer = combineReducers({
    login: loginReducer,
    metaData: MetaDataReducer,
  // Add more reducers here
});

// Redux Persist config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['login'], // Only persist these reducers
};

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Avoid Redux Persist errors
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);
