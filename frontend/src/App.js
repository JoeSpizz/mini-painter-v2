// src/App.js

import React, { useState, useRef } from 'react';
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
  const [modelType, setModelType] = useState(null);
  const dispatch = useDispatch();

  // Brush State
  const [brushColor, setBrushColor] = useState(new Color('#FF0000'));
  const [brushSize, setBrushSize] = useState(0.1);
  const [brushOpacity, setBrushOpacity] = useState(0.5);

  // Mode State
  const [isPaintMode, setIsPaintMode] = useState(false);

  const modelViewerRef = useRef();

  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleFileUpload = (url, type) => {
    setModelPath(url);
    setModelType(type);
    if (modelViewerRef.current) {
      modelViewerRef.current.history.current = [];
      modelViewerRef.current.redoHistory.current = [];
      setCanUndo(false);
      setCanRedo(false);
    }
    console.log('New model loaded:', url);
  };

  const handleResetMaterial = () => {
    dispatch(resetMaterial());
    if (modelViewerRef.current) {
      modelViewerRef.current.history.current = [];
      modelViewerRef.current.redoHistory.current = [];
      setCanUndo(false);
      setCanRedo(false);
    }
    console.log('Material reset and history cleared');
  };

  const toggleMode = () => {
    setIsPaintMode((prev) => !prev);
    console.log('Mode toggled:', isPaintMode ? 'Move' : 'Paint');
  };

  const handleUndo = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.undo();
    }
  };

  const handleRedo = () => {
    if (modelViewerRef.current) {
      modelViewerRef.current.redo();
    }
  };

  // Callback for history changes
  const handleHistoryChange = (undoAvailable, redoAvailable) => {
    setCanUndo(undoAvailable);
    setCanRedo(redoAvailable);
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-row relative">
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
        <button
          onClick={handleUndo}
          className="mt-4 bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded shadow w-full"
          disabled={!canUndo}
        >
          Undo
        </button>
        <button
          onClick={handleRedo}
          className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded shadow w-full"
          disabled={!canRedo}
        >
          Redo
        </button>
        <ColorPicker />
        <button
          onClick={handleResetMaterial}
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow w-full"
        >
          Reset Material
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-4xl mb-4">
          <h1 className="text-3xl font-bold mb-4 text-center">
            Mini Painting Simulator
          </h1>
          <FileUpload onFileUpload={handleFileUpload} />
        </div>
        {modelPath && (
          <div className="w-full h-full relative">
            <Canvas shadows style={{ background: 'white', height: '600px' }}>
              <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={75} />

              <ambientLight intensity={2} />
              <directionalLight position={[10, 10, 10]} intensity={4} />
              <directionalLight position={[-10, -10, -10]} intensity={4} />
              <pointLight position={[0, 50, 0]} intensity={2.0} />

              <ModelViewer
                ref={modelViewerRef}
                modelPath={modelPath}
                modelType={modelType}
                brushColor={brushColor}
                brushSize={brushSize}
                brushOpacity={brushOpacity}
                isPaintMode={isPaintMode}
                onHistoryChange={handleHistoryChange}
              />

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

            <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={() => modelViewerRef.current.exportModel()}
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
