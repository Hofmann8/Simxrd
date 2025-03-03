const { app, BrowserWindow, protocol, ipcMain, screen } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// 保持对window对象的全局引用
let mainWindow;

function createWindow() {
  // 获取屏幕尺寸
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  
  // 计算窗口尺寸 (16:9比例，但不超过屏幕尺寸的85%)
  const windowWidth = Math.min(1280, Math.round(screenWidth * 0.85));
  const windowHeight = Math.round(windowWidth / (16/9));
  
  // 创建浏览器窗口，使用现代化设计
  mainWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    minWidth: 1024,
    minHeight: 576,
    // 现代化窗口设计
    frame: false, // 无框架窗口
    transparent: false, // 不透明
    titleBarStyle: 'hidden',
    backgroundColor: '#f5f5f5', // 浅灰色背景
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '../build/icon.png'),
    // 添加窗口阴影和圆角 (仅在Windows和Linux上)
    ...(process.platform !== 'darwin' && {
      transparent: true,
      backgroundColor: '#00000000',
    })
  });

  // 加载应用
  const startUrl = process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '../build/index.html'),
    protocol: 'file:',
    slashes: true
  });
  
  mainWindow.loadURL(startUrl);
  
  // 窗口最大化时保持16:9比例
  mainWindow.on('maximize', () => {
    const [width, height] = mainWindow.getSize();
    const aspectRatio = 16 / 9;
    const currentRatio = width / height;
    
    if (Math.abs(currentRatio - aspectRatio) > 0.1) {
      const newHeight = Math.round(width / aspectRatio);
      mainWindow.setSize(width, newHeight);
    }
  });

  // 当窗口关闭时触发
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// 注册自定义协议处理器
function registerProtocolHandler() {
  protocol.registerFileProtocol('app', (request, callback) => {
    const url = request.url.substr(6);
    try {
      return callback(path.normalize(`${__dirname}/${url}`));
    } catch (error) {
      console.error('Protocol handler error:', error);
    }
  });
}

// 注册IPC处理程序
function registerIpcHandlers() {
  // 窗口控制
  ipcMain.on('window-minimize', () => {
    if (mainWindow) mainWindow.minimize();
  });
  
  ipcMain.on('window-maximize', () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
      } else {
        mainWindow.maximize();
      }
    }
  });
  
  ipcMain.on('window-close', () => {
    if (mainWindow) mainWindow.close();
  });
  
  // 获取应用路径
  ipcMain.handle('get-app-path', () => {
    return app.getAppPath();
  });
  
  // 获取窗口状态
  ipcMain.handle('is-window-maximized', () => {
    return mainWindow ? mainWindow.isMaximized() : false;
  });
}

// Electron 初始化完成后创建窗口
app.whenReady().then(() => {
  registerProtocolHandler();
  registerIpcHandlers();
  createWindow();
  
  app.on('activate', function () {
    if (mainWindow === null) createWindow();
  });
});

// 当所有窗口都被关闭时退出应用
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

// 其他IPC处理程序... 