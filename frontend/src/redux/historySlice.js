// src/redux/historySlice.js

import { createSlice } from '@reduxjs/toolkit';

const historySlice = createSlice({
  name: 'history',
  initialState: {
    canUndo: false,
    canRedo: false,
  },
  reducers: {
    setCanUndo(state, action) {
      state.canUndo = action.payload;
    },
    setCanRedo(state, action) {
      state.canRedo = action.payload;
    },
    resetHistory(state) {
      state.canUndo = false;
      state.canRedo = false;
    },
  },
});

export const { setCanUndo, setCanRedo, resetHistory } = historySlice.actions;

export default historySlice.reducer;
