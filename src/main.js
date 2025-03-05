const { app, BrowserWindow, protocol, ipcMain } = require("electron");
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
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      preload: isDev
        ? path.join(__dirname, 'preload.js')
        : path.join(process.resourcesPath, 'app', 'src', 'preload.js'),
      enableRemoteModule: false
    }
  });

  // 简化平台特定配置
  if (process.platform === 'darwin') {
    app.dock.show();
    mainWindow.setWindowButtonVisibility(true);
  }

  if (process.argv.includes('dev')) {
    // 开发环境：使用 localhost
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // 生产环境：使用构建文件
    const startUrl = path.join(__dirname, '../build/index.html');
    mainWindow.loadFile(startUrl);
  }

  // 修改 IPC 处理方式
  ipcMain.handle('window-control', async (event, command) => {
    try {
      switch (command) {
        case 'minimize':
          mainWindow.minimize();
          return true;
        case 'maximize':
          if (mainWindow.isMaximized()) {
            mainWindow.unmaximize();
          } else {
            mainWindow.maximize();
          }
          return mainWindow.isMaximized();
        case 'close':
          mainWindow.close();
          return true;
        default:
          return false;
      }
    } catch (error) {
      console.error('Window control error:', error);
      return false;
    }
  });

  // 监听窗口状态变化
  mainWindow.on('maximize', () => {
    mainWindow.webContents.send('window-maximize-change', true);
  });

  mainWindow.on('unmaximize', () => {
    mainWindow.webContents.send('window-maximize-change', false);
  });

  mainWindow.on('closed', () => {
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
