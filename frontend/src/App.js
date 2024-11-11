// src/App.js

import React, { useState } from 'react';
import ModelViewer from './components/ModelViewer/ModelViewer';
import ColorPicker from './components/ColorPicker/ColorPicker';
import ControlPanel from './components/ControlPanel/ControlPanel';
import FileUpload from './components/FileUpload/FileUpload';
import BrushControls from './components/BrushControls/BrushControls';
import { useDispatch } from 'react-redux';
import { resetMaterial } from './redux/materialSlice';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Color } from 'three';

function App() {
  const [modelPath, setModelPath] = useState(null);
  const dispatch = useDispatch();

  // Brush State
  const [brushColor, setBrushColor] = useState(new Color('#FF0000'));
  const [brushSize, setBrushSize] = useState(0.1); // Start with smallest size
  const [brushOpacity, setBrushOpacity] = useState(0.5); 

  // Mode State
  const [isPaintMode, setIsPaintMode] = useState(false);

  const handleFileUpload = (url) => {
    setModelPath(url);
  };

  const handleResetMaterial = () => {
    dispatch(resetMaterial());
  };

  const toggleMode = () => {
    setIsPaintMode((prev) => !prev);
  };

  const handleExportModel = () => {
    // Implement export logic here or pass it down as a prop to ModelViewer
    // For example, you can use a ref to ModelViewer and call handleExportModel
    // Alternatively, manage export within ModelViewer based on state
    alert('Export functionality not implemented yet.');
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-row relative">
      {/* Left Sidebar: Brush Controls and Color Picker */}
      <div className="w-72 bg-white bg-opacity-90 p-6 overflow-y-auto shadow-lg">
      <button
          onClick={toggleMode}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow w-full"
        >
          {isPaintMode ? 'Switch to Move Mode' : 'Switch to Paint Mode'}
        </button>
        <BrushControls
          brushColor={brushColor}
          setBrushColor={setBrushColor}
          brushSize={brushSize}
          setBrushSize={setBrushSize}
          brushOpacity={brushOpacity}
          setBrushOpacity={setBrushOpacity}
        />
        <ColorPicker />
        <button
          onClick={handleResetMaterial}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow w-full"
        >
          Reset Material
        </button>

      </div>

      {/* Center: Model Viewer and File Upload */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mb-4">
          <h1 className="text-3xl font-bold mb-4 text-center">Mini Painting Simulator</h1>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
        {modelPath && (
          <div className="w-full h-full relative">
            {/* R3F Canvas */}
            <Canvas shadows style={{ background: 'white', height: '600px' }}>
              {/* Perspective Camera */}
              <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={75} />

              {/* Lighting */}
              <ambientLight intensity={2} />
              <directionalLight position={[10, 10, 10]} intensity={4} />
              <directionalLight position={[-10, -10, -10]} intensity={4} />
              <pointLight position={[0, 50, 0]} intensity={2.0} />

              {/* Model Viewer */}
              <ModelViewer
                modelPath={modelPath}
                brushColor={brushColor}
                brushSize={brushSize}
                brushOpacity={brushOpacity}
                isPaintMode={isPaintMode}
              />

              {/* OrbitControls */}
              <OrbitControls
                enablePan={!isPaintMode}
                enableZoom={!isPaintMode}
                enableRotate={!isPaintMode}
                maxDistance={200}
                minDistance={50}
                autoRotate={false}
                zoomSpeed={0.5}
                panSpeed={0.5}
                dampingFactor={0.1}
                enableDamping={true}
              />
            </Canvas>

            {/* Export Button */}
            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={handleExportModel}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow"
              >
                Export Painted Model
              </button>
            </div>
          </div>
        )}
      </div>
        <div className="w-72 bg-white bg-opacity-90 p-6 overflow-y-auto shadow-lg">
        <ControlPanel />
      </div> 
    </div>
  );
}

export default App;
