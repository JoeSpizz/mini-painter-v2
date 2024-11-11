import React from 'react';

function FileUpload({ onFileUpload }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.stl')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target.result;
        const blob = new Blob([arrayBuffer], { type: 'application/sla' });
        const url = URL.createObjectURL(blob);
        onFileUpload(url);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert('Please upload a valid .STL file.');
    }
  };

  return (
    <div className="file-upload">
      <input type="file" accept=".stl" onChange={handleFileChange} />
    </div>
  );
}

export default FileUpload;
