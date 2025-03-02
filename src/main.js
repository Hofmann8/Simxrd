const { app, BrowserWindow, protocol } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.argv.includes('dev');

let mainWindow;

// 注册自定义协议处理器
function registerFileProtocol() {
  protocol.registerFileProtocol('file', (request, callback) => {
    const url = request.url.replace('file://', '');
    try {
      return callback(decodeURIComponent(url));
    } catch (error) {
      console.error('Protocol handler error:', error);
      return callback(404);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,  // 允许加载本地文件
      preload: path.join(__dirname, 'preload.js')
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../build/index.html'));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  registerFileProtocol();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
