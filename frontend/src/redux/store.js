// src/redux/store.js

import { configureStore } from '@reduxjs/toolkit';
import materialReducer from './materialSlice';
import transformReducer from './transformSlice';

const store = configureStore({
  reducer: {
    material: materialReducer,
    transform: transformReducer,
  },
});

export default store;
