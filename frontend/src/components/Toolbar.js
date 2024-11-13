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

// Toolbar.js
const handleExport = async () => {
    console.log("handleExport called"); // Debug log
    const filePath = await window.electron.getSaveFilename();
    if (filePath) {
      onExport(filePath);
    }
  };
  
  

  return (
    <div className="toolbar flex justify-center items-center gap-3 p-4 bg-[#FFF8E7] text-white shadow-md fixed top-0 left-0 right-0 z-20">
      <button onClick={() => document.getElementById('file-upload').click()} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded shadow">
        Choose File
      </button>
      <input
        id="file-upload"
        type="file"
        accept=".stl,.gltf,.glb"
        onChange={handleFileChange}
        className="hidden"
      />
      <button onClick={onModeToggle} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow">
        {isPaintMode ? 'Paint Mode' : 'Move Mode'}
      </button>
      
      <button onClick={onUndo} disabled={!canUndo} className={`px-4 py-2 rounded shadow ${canUndo ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400'}`}>
        Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo} className={`px-4 py-2 rounded shadow ${canRedo ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400'}`}>
        Redo
      </button>
      <button onClick={handleExport} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow">
        Export Painted Model
      </button>
    </div>
  );
}

export default Toolbar;
