// src/components/Toolbar/Toolbar.js
import React from 'react';

function Toolbar({ onUndo, onRedo, onErase, onSave }) {
  return (
    <div className="toolbar flex space-x-4 mt-4 justify-center">
      <button 
        onClick={onUndo} 
        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Undo
      </button>
      <button 
        onClick={onRedo} 
        className="btn bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Redo
      </button>
      <button 
        onClick={onErase} 
        className="btn bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Erase
      </button>
      <button 
        onClick={onSave} 
        className="btn bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </button>
    </div>
  );
}

export default Toolbar;
