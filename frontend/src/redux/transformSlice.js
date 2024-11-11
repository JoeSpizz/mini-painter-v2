// src/redux/transformSlice.js

import { createSlice } from '@reduxjs/toolkit';
import * as THREE from 'three';

const initialState = {
  position: { x: 0, y: 0, z: 0 },
  rotation: { x: 0, y: 0, z: 0 }, // In radians
  scale: { x: 1, y: 1, z: 1 },
  isLocked: false, // Lock state for camera controls
};

const transformSlice = createSlice({
  name: 'transform',
  initialState,
  reducers: {
    moveModel(state, action) {
      const { axis, value } = action.payload;
      state.position[axis] = value;
    },
    setModelRotation(state, action) {
      const { axis, value } = action.payload;
      state.rotation[axis] = THREE.MathUtils.degToRad(value); // Convert degrees to radians
    },
    setUniformScale(state, action) {
      const value = action.payload;
      state.scale = { x: value, y: value, z: value };
    },
    resetTransform(state) {
      state.position = { x: 0, y: 0, z: 0 };
      state.rotation = { x: 0, y: 0, z: 0 };
      state.scale = { x: 1, y: 1, z: 1 };
    },
    toggleLock(state) {
      state.isLocked = !state.isLocked;
    },
  },
});

export const { moveModel, setModelRotation, setUniformScale, resetTransform, toggleLock } = transformSlice.actions;
export default transformSlice.reducer;
