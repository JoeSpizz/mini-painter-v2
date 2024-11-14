// src/components/ColorPicker/ColorPicker.js

import React from 'react';
// import { SketchPicker } from 'react-color';
import { useSelector, useDispatch } from 'react-redux';
import { setMetalness, setRoughness } from '../../redux/materialSlice';

function ColorPicker() {
  const dispatch = useDispatch();
  
  // Access material properties from Redux
  const { metalness, roughness } = useSelector((state) => state.material);

  // Handlers to dispatch actions to Redux
 // const handleColorChange = (selectedColor) => {
 //   dispatch(setColor(selectedColor.hex));
 // };

  const handleMetalnessChange = (e) => {
    dispatch(setMetalness(parseFloat(e.target.value)));
  };

  const handleRoughnessChange = (e) => {
    dispatch(setRoughness(parseFloat(e.target.value)));
  };

  return (
    <div className="flex flex-col items-center text-center color-picker p-4 bg-white rounded shadow-md">
     
      {/* Color Picker 
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Color</label>
        <SketchPicker 
          color={color} // Controlled component
          onChangeComplete={handleColorChange} 
        />
      </div>*/}
      
      {/* Metalness Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Metalness</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={metalness}
          onChange={handleMetalnessChange} 
          className="w-full"
        />
        <span className="mt-1 text-sm text-gray-600">{metalness.toFixed(2)}</span>
      </div>
      
      {/* Roughness Slider */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Roughness</label>
        <input 
          type="range" 
          min="0" 
          max="1" 
          step="0.01" 
          value={roughness}
          onChange={handleRoughnessChange} 
          className="w-full"
        />
        <span className="mt-1 text-sm text-gray-600">{roughness.toFixed(2)}</span>
      </div>
    </div>
  );
}

export default ColorPicker;
