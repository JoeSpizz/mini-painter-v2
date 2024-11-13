// src/App.js

import React, { useState, useRef } from 'react';
import ModelViewer from './components/ModelViewer/ModelViewer';
import Toolbar from './components/Toolbar';
import BrushControls from './components/BrushControls/BrushControls';
import ControlPanel from './components/ControlPanel/ControlPanel';
import ColorPicker from './components/ColorPicker/ColorPicker';
import { useDispatch } from 'react-redux';
import { resetMaterial } from './redux/materialSlice';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Color } from 'three';
import Draggable from 'react-draggable';
import './App.css'; 

function App() {
  const [modelPath, setModelPath] = useState(null);
  const [modelType, setModelType] = useState(null);
  const dispatch = useDispatch();
  const [brushColor, setBrushColor] = useState(new Color('#FF0000'));
  const [brushSize, setBrushSize] = useState(1.5);
  const [brushOpacity, setBrushOpacity] = useState(0.75);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const modelViewerRef = useRef();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleFileUpload = (url, type) => {
    setModelPath(url);
    setModelType(type);

    if (modelViewerRef.current) {
      if (modelViewerRef.current.history) {
        modelViewerRef.current.history.current = [];
      }
      if (modelViewerRef.current.redoHistory) {
        modelViewerRef.current.redoHistory.current = [];
      }
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
    console.log('Mode toggled:', isPaintMode ? 'Switched to Move Mode' : 'Switched to Paint Mode');
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

  const handleExport = (filename) => {
    if (modelViewerRef.current) {
      modelViewerRef.current.exportModel(filename);
    }
  };

  const handleHistoryChange = (undoAvailable, redoAvailable) => {
    setCanUndo(undoAvailable);
    setCanRedo(redoAvailable);
  };

  return (
    <div className="App relative w-screen h-screen bg-gray-100">
      {/* Toolbar with File Upload Handler */}
      <Toolbar
        onFileUpload={handleFileUpload}
        onModeToggle={toggleMode}
        onReset={handleResetMaterial}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={handleExport}
        canUndo={canUndo}
        canRedo={canRedo}
        isPaintMode={isPaintMode}
      />

      {/* Full-Screen Canvas with 100vh */}
      <Canvas className={`absolute bg-slate-900 inset-0 h-[100vh] ${isPaintMode ? 'paint-cursor' : 'move-cursor'}`}>
        <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={75} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={4} />
        <directionalLight position={[-10, -10, -10]} intensity={4} />
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
        />
      </Canvas>

      {/* Draggable Panels with Headers */}
      <Draggable handle=".drag-handle">
        <div className="absolute top-20 left-5 z-10 bg-white p-4 shadow-lg rounded-lg">
          <div className="drag-handle cursor-move bg-gray-300 p-2 rounded-t text-center font-semibold">
            Brush Controls
          </div>
          <BrushControls
            brushColor={brushColor}
            setBrushColor={setBrushColor}
            brushSize={brushSize}
            setBrushSize={setBrushSize}
            brushOpacity={brushOpacity}
            setBrushOpacity={setBrushOpacity}
          />
        </div>
      </Draggable>

      <Draggable handle=".drag-handle">
        <div className="absolute top-20 right-5 z-10 bg-white p-4 shadow-lg rounded-lg">
          <div className="drag-handle cursor-move bg-gray-300 p-2 rounded-t text-center font-semibold">
            Model Controls
          </div>
          <ControlPanel />
        </div>
      </Draggable>

      <Draggable handle=".drag-handle">
        <div className="absolute top-20 right-72 z-10 bg-white p-4 shadow-lg rounded-lg">
          <div className="drag-handle cursor-move bg-gray-300 p-2 rounded-t text-center font-semibold">
            Model Material
          </div>
          <ColorPicker />
        </div>
      </Draggable>
    </div>
  );
}

export default App;
