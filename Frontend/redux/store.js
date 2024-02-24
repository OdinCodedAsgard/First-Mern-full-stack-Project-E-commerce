import {combineReducers, configureStore} from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import {persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';
const RootReducer = combineReducers({user:userReducer});
const persistConfig ={
    key:"root",
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig,RootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware:  (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false, // Required by Redux Toolkit to support object serialization and deserialization.
    }),
})
export const Persistor = persistStore(store);