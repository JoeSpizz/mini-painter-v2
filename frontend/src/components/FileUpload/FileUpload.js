// src/components/FileUpload/FileUpload.js

import React from 'react';

function FileUpload({ onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
  
        if (file.name.endsWith('.stl')) {
          const blob = new Blob([arrayBuffer], { type: 'application/sla' });
          const url = URL.createObjectURL(blob);
          onFileUpload(url, 'stl');
        } else if (file.name.endsWith('.gltf') || file.name.endsWith('.glb')) {
          onFileUpload(arrayBuffer, 'gltf'); // Pass array buffer directly for GLTF
        } else {
          alert('Please upload a valid .STL or .GLTF file.');
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };
  

  return (
    <div className="file-upload">
      <input type="file" accept=".stl,.gltf,.glb" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
