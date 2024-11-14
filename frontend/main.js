// main.js
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    icon: path.join(__dirname, './assets/images/mini_painter.png'),
    width: 1280,
    height: 720,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const startURL = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'build/index.html')}`;
  mainWindow.loadURL(startURL);

  mainWindow.on('closed', () => {
  });
}


app.on('ready', createMainWindow);

ipcMain.handle('get-save-filename', async () => {
    console.log("get-save-filename handler called");
    const saveDir = path.join(app.getPath('documents'), 'MiniPainter', 'saved_models');
    
    if (!fs.existsSync(saveDir)) {
      fs.mkdirSync(saveDir, { recursive: true });
    }
  
    const { filePath } = await dialog.showSaveDialog({
      title: 'Save Painted Model',
      defaultPath: path.join(saveDir, 'painted_model.gltf'),
      filters: [{ name: 'GLTF Models', extensions: ['gltf'] }],
    });
  
    return filePath || null;
  });
  
  ipcMain.handle('save-file', async (_, filePath, data) => {
    console.log("save-file handler called with path:", filePath);
    if (filePath) {
      fs.writeFileSync(filePath, data);
      return `File saved successfully at ${filePath}`;
    }
    return 'No file path provided';
  });
  
