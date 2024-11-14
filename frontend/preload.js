// preload.js
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  saveFile: (filePath, data) => ipcRenderer.invoke('save-file', filePath, data),
  getSaveFilename: () => ipcRenderer.invoke('get-save-filename')  // Expose getSaveFilename
});
