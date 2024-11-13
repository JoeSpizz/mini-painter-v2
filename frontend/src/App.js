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

function App() {
  const [modelPath, setModelPath] = useState(null);
  const [modelType, setModelType] = useState(null);
  const dispatch = useDispatch();
  const [brushColor, setBrushColor] = useState(new Color('#FF0000'));
  const [brushSize, setBrushSize] = useState(0.1);
  const [brushOpacity, setBrushOpacity] = useState(0.5);
  const [isPaintMode, setIsPaintMode] = useState(false);
  const modelViewerRef = useRef();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const arrayBuffer = ev.target.result;
        const fileType = file.name.endsWith('.stl') ? 'stl' : 'gltf';
        const url = URL.createObjectURL(new Blob([arrayBuffer]));
        setModelPath(url);
        setModelType(fileType);

        // Reset history for the new model
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
      reader.readAsArrayBuffer(file);
    }
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

  // Callback for history changes
  const handleHistoryChange = (undoAvailable, redoAvailable) => {
    setCanUndo(undoAvailable);
    setCanRedo(redoAvailable);
  };

  return (
    <div className="App relative w-screen h-screen bg-gray-100">
      {/* Toolbar */}
      <Toolbar
        onFileLoad={() => document.getElementById('file-upload').click()}
        onModeToggle={toggleMode}
        onReset={handleResetMaterial}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onExport={() => modelViewerRef.current?.exportModel()}
        canUndo={canUndo}
        canRedo={canRedo}
        isPaintMode={isPaintMode}
      />

      {/* Full-Screen Canvas with 100vh */}
      <Canvas className="absolute inset-0 h-[100vh]">
        <PerspectiveCamera makeDefault position={[0, 0, 100]} fov={75} />
        <ambientLight intensity={2} />
        <directionalLight position={[10, 10, 10]} intensity={4} />
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
            Color Picker
          </div>
          <ColorPicker />
        </div>
      </Draggable>

      {/* Hidden File Upload */}
      <input
        id="file-upload"
        type="file"
        accept=".stl,.gltf,.glb"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
}

export default App;
