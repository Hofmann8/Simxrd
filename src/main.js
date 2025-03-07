const { app, BrowserWindow, protocol, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const isDev = process.argv.includes('dev');

let mainWindow;
let isWindowMaximized = false;
let originalBounds = {
  width: 1440,
  height: 900,
  x: 100,
  y: 100
};

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
    icon: path.join(__dirname, '../public/simxrd.ico'),
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
          // 使用我们自己的状态变量
          console.log('当前最大化状态(自定义跟踪):', isWindowMaximized);
          if (isWindowMaximized) {
            console.log('窗口已最大化，执行还原操作');
            // 保存当前窗口大小和位置
            if (mainWindow.isFullScreen()) {
              // 如果是全屏模式，先退出全屏
              mainWindow.setFullScreen(false);
            }
            
            // 设置为原始大小
            setTimeout(() => {
              mainWindow.setBounds(originalBounds);
              isWindowMaximized = false;
              mainWindow.webContents.send('window-maximize-change', false);
            }, 100);
            
            return false;
          } else {
            console.log('窗口未最大化，执行最大化操作');
            // 保存当前窗口大小和位置
            originalBounds = mainWindow.getBounds();
            console.log('保存原始窗口边界:', originalBounds);
            
            // 使用全屏模式
            mainWindow.setFullScreen(true);
            isWindowMaximized = true;
            mainWindow.webContents.send('window-maximize-change', true);
            return true;
          }
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

  // 添加检查窗口是否最大化的处理程序
  ipcMain.handle('window-is-maximized', () => {
    console.log('检查窗口最大化状态(自定义跟踪):', isWindowMaximized);
    return isWindowMaximized;
  });

  // 保留原有的处理程序以兼容现有代码
  ipcMain.handle('window-is-fullscreen', () => {
    return mainWindow.isMaximized();
  });

  // 监听最大化状态变化
  mainWindow.on('maximize', () => {
    console.log('窗口已最大化 - 事件触发');
    isWindowMaximized = true;
    mainWindow.webContents.send('window-maximize-change', true);
  });

  mainWindow.on('unmaximize', () => {
    console.log('窗口已还原 - 事件触发');
    isWindowMaximized = false;
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
