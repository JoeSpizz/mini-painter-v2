// src/components/ControlPanel/ControlPanel.js

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { moveModel, setModelRotation, setUniformScale, resetTransform } from '../../redux/transformSlice';
import CollapsiblePanel from '../CollapsiblePanel'; // Import the collapsible component
import * as THREE from 'three';

function ControlPanel() {
  const dispatch = useDispatch();

  // Access transformation states from Redux
  const position = useSelector((state) => state.transform.position);
  const rotation = useSelector((state) => state.transform.rotation);
  const scale = useSelector((state) => state.transform.scale);

  return (
    <div className="control-panel p-4 bg-white shadow-md rounded-lg">
      {/* Reset Button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={() => dispatch(resetTransform())}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow"
        >
          Reset Model Positioning
        </button>
      </div>

      {/* Move Model Controls */}
      <CollapsiblePanel title="Move Model" defaultOpen>
        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="move-x" className="text-sm font-medium text-gray-700">
              Move X (Left ↔️ Right)
            </label>
            <input
              id="move-x"
              type="range"
              min="-50"
              max="50"
              value={position.x}
              onChange={(e) => dispatch(moveModel({ axis: 'x', value: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{position.x} units</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="move-y" className="text-sm font-medium text-gray-700">
              Move Y (Down ↕️ Up)
            </label>
            <input
              id="move-y"
              type="range"
              min="-50"
              max="50"
              value={position.y}
              onChange={(e) => dispatch(moveModel({ axis: 'y', value: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{position.y} units</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="move-z" className="text-sm font-medium text-gray-700">
              Move Z (Backward ↕️ Forward)
            </label>
            <input
              id="move-z"
              type="range"
              min="-100"
              max="100"
              value={position.z}
              onChange={(e) => dispatch(moveModel({ axis: 'z', value: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{position.z} units</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="rotate-x" className="text-sm font-medium text-gray-700">
              Rotate X (Vertical)
            </label>
            <input
              id="rotate-x"
              type="range"
              min="-180"
              max="180"
              value={THREE.MathUtils.radToDeg(rotation.x)}
              onChange={(e) => dispatch(setModelRotation({ axis: 'x', value: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{THREE.MathUtils.radToDeg(rotation.x).toFixed(0)}°</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="rotate-y" className="text-sm font-medium text-gray-700">
              Rotate Y (Horizontal)
            </label>
            <input
              id="rotate-y"
              type="range"
              min="-180"
              max="180"
              value={THREE.MathUtils.radToDeg(rotation.y)}
              onChange={(e) => dispatch(setModelRotation({ axis: 'y', value: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{THREE.MathUtils.radToDeg(rotation.y).toFixed(0)}°</span>
          </div>

          <div className="flex flex-col">
            <label htmlFor="rotate-z" className="text-sm font-medium text-gray-700">
              Rotate Z (Roll)
            </label>
            <input
              id="rotate-z"
              type="range"
              min="-180"
              max="180"
              value={THREE.MathUtils.radToDeg(rotation.z)}
              onChange={(e) => dispatch(setModelRotation({ axis: 'z', value: parseFloat(e.target.value) }))}
              className="w-full"
            />
            <span className="text-sm text-gray-600">{THREE.MathUtils.radToDeg(rotation.z).toFixed(0)}°</span>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="scale-uniform" className="text-sm font-medium text-gray-700">
            Uniform Scale
          </label>
          <input
            id="scale-uniform"
            type="range"
            min="0.1"
            max="3"
            step="0.1"
            value={scale.x} // Assuming uniform scaling, all axes have the same value
            onChange={(e) => dispatch(setUniformScale(parseFloat(e.target.value)))}
            className="w-full"
          />
          <span className="text-sm text-gray-600">{scale.x.toFixed(1)}x</span>
        </div>
      </CollapsiblePanel>
    </div>
  );
}

export default ControlPanel;
