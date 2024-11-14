// src/components/BrushControls/BrushControls.js

import React from 'react';
import { SketchPicker } from 'react-color';
import { Color } from 'three';

function BrushControls({
  brushColor,
  setBrushColor,
  brushSize,
  setBrushSize,
  brushOpacity,
  setBrushOpacity,
  colorHistory, // **Receive Color History**
  selectColorFromHistory, // **Receive Selection Function**
}) {
  return (
    <div className="mt-4">
      {/* Brush Color Picker */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Brush Color</label>
        <SketchPicker
          color={brushColor.getStyle()}
          onChangeComplete={(color) => setBrushColor(new Color(color.hex))}
        />
      </div>

      {/* **New: Color History Section** */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Color History</label>
        <div className="flex flex-wrap gap-2">
          {colorHistory.map((color, index) => (
            <button
              key={index}
              onClick={() => selectColorFromHistory(color)}
              className="w-6 h-6 border border-gray-300 rounded"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Brush Size Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Brush Size</label>
        <input
          type="range"
          min="0.1"
          max="5"
          step="0.1"
          value={brushSize}
          onChange={(e) => setBrushSize(parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{brushSize.toFixed(1)}</span>
      </div>

      {/* Brush Opacity Slider */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Brush Opacity</label>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.1"
          value={brushOpacity}
          onChange={(e) => setBrushOpacity(parseFloat(e.target.value))}
          className="w-full"
        />
        <span className="text-sm text-gray-600">{brushOpacity.toFixed(1)}</span>
      </div>
    </div>
  );
}

export default BrushControls;
