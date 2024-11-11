// src/App.js

import React, { useState } from 'react';
import ModelViewer from './components/ModelViewer/ModelViewer';
import ColorPicker from './components/ColorPicker/ColorPicker';
import ControlPanel from './components/ControlPanel/ControlPanel';
import FileUpload from './components/FileUpload/FileUpload';
import { useDispatch } from 'react-redux';
import { resetMaterial } from './redux/materialSlice';

function App() {
  const [modelPath, setModelPath] = useState(null);
  const dispatch = useDispatch();

  const handleFileUpload = (url) => {
    setModelPath(url);
  };

  const handleResetMaterial = () => {
    dispatch(resetMaterial());
  };

  return (
    <div className="App bg-gray-100 min-h-screen flex flex-row">
      {/* Left Sidebar: Color Picker */}
      <div className="w-72 bg-white bg-opacity-90 p-6 overflow-y-auto shadow-lg">
        <ColorPicker />
        <button 
          onClick={handleResetMaterial} 
          className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow"
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
          <div className="w-full h-full">
            <ModelViewer modelPath={modelPath} />
          </div>
        )}
      </div>

      {/* Right Sidebar: Control Panel */}
      <div className="w-72 bg-white bg-opacity-90 p-6 overflow-y-auto shadow-lg">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
