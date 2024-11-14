// src/components/Toolbar.js

import React from 'react';

function Toolbar({ onFileUpload, onModeToggle, onUndo, onRedo, onExport, canUndo, canRedo, isPaintMode }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const fileType = file.name.endsWith('.stl') ? 'stl' : 'gltf';
        const url = URL.createObjectURL(new Blob([arrayBuffer]));
        onFileUpload(url, fileType);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const handleExport = async () => {
    console.log("handleExport called"); // Debug log
    const filePath = await window.electron.getSaveFilename();
    if (filePath) {
      onExport(filePath);
    }
  };

  return (
    <div className="toolbar fixed top-0 left-0 right-0 z-20 bg-gray-100 shadow-md p-4 flex justify-center items-center gap-4">
      <button
        onClick={() => document.getElementById('file-upload').click()}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Choose File
      </button>
      <input
        id="file-upload"
        type="file"
        accept=".stl,.gltf,.glb"
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        onClick={onModeToggle}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        {isPaintMode ? 'Paint Mode' : 'Move Mode'}
      </button>
      
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className={`px-4 py-2 rounded-md border transition-colors ${
          canUndo
            ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Undo
      </button>
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className={`px-4 py-2 rounded-md border transition-colors ${
          canRedo
            ? 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
            : 'bg-gray-200 border-gray-200 text-gray-400 cursor-not-allowed'
        }`}
      >
        Redo
      </button>
      <button
        onClick={handleExport}
        className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
      >
        Export Model
      </button>
    </div>
  );
}

export default Toolbar;
