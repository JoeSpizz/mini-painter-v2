// src/redux/materialSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  color: '#FFFFFF',   // Default color
  metalness: 0.5,     // Default metalness
  roughness: 0.5,     // Default roughness
};

const materialSlice = createSlice({
  name: 'material',
  initialState,
  reducers: {
    setColor(state, action) {
      state.color = action.payload;
    },
    setMetalness(state, action) {
      state.metalness = action.payload;
    },
    setRoughness(state, action) {
      state.roughness = action.payload;
    },
    resetMaterial(state) {
      state.color = initialState.color;
      state.metalness = initialState.metalness;
      state.roughness = initialState.roughness;
    },
  },
});

export const { setColor, setMetalness, setRoughness, resetMaterial } = materialSlice.actions;
export default materialSlice.reducer;
