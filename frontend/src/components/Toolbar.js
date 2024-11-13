// src/components/Toolbar.js

import React from 'react';

function Toolbar({ onFileLoad, onModeToggle, onReset, onUndo, onRedo, onExport, canUndo, canRedo, isPaintMode }) {
  return (
    <div className="toolbar flex justify-center items-center gap-3 p-4 bg-gray-800 text-white shadow-md fixed top-0 left-0 right-0 z-20">
      <button onClick={onFileLoad} className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded shadow">
        Choose File
      </button>
      <button onClick={onModeToggle} className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded shadow">
        {isPaintMode ? 'Switch to Move Mode' : 'Switch to Paint Mode'}
      </button>
      <button onClick={onReset} className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded shadow">
        Reset Model
      </button>
      <button onClick={onUndo} disabled={!canUndo} className={`px-4 py-2 rounded shadow ${canUndo ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400'}`}>
        Undo
      </button>
      <button onClick={onRedo} disabled={!canRedo} className={`px-4 py-2 rounded shadow ${canRedo ? 'bg-purple-500 hover:bg-purple-600' : 'bg-gray-400'}`}>
        Redo
      </button>
      <button onClick={onExport} className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded shadow">
        Export Painted Model
      </button>
    </div>
  );
}

export default Toolbar;
