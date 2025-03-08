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
  console.log('主进程: 注册文件协议处理器');
  protocol.registerFileProtocol('file', (request, callback) => {
    const url = request.url.replace('file://', '');
    try {
      console.log('主进程: 处理文件请求:', url);
      return callback(decodeURIComponent(url));
    } catch (error) {
      console.error('主进程: 协议处理器错误:', error);
      return callback(404);
    }
  });
}

function createWindow() {
  console.log('主进程: 创建主窗口');

  // 修改预加载脚本路径的处理
  const preloadPath = isDev
    ? path.join(__dirname, 'preload.js')
    : path.join(__dirname, 'preload.js');  // 生产环境下直接使用相对路径

  console.log('主进程: 使用预加载脚本路径:', preloadPath);
  console.log('主进程: 预加载脚本是否存在:', fs.existsSync(preloadPath));

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
      preload: preloadPath,
      enableRemoteModule: false
    }
  });

  // 简化平台特定配置
  if (process.platform === 'darwin') {
    console.log('主进程: 配置 macOS 特定设置');
    app.dock.show();
    mainWindow.setWindowButtonVisibility(true);
  }

  if (process.argv.includes('dev')) {
    console.log('主进程: 加载开发环境 URL: http://localhost:3000');
    mainWindow.loadURL('http://localhost:3000');
  } else {
    // 修改生产环境文件路径的处理
    const startUrl = path.join(__dirname, '..', 'build', 'index.html');
    console.log('主进程: 加载生产环境文件:', startUrl);

    if (fs.existsSync(startUrl)) {
      console.log('主进程: 找到生产环境文件');
      mainWindow.loadFile(startUrl).catch(err => {
        console.error('主进程: 加载生产环境文件失败:', err);
        // 如果加载失败，尝试使用 file:// 协议
        const fileUrl = `file://${startUrl}`;
        console.log('主进程: 尝试使用 file:// 协议加载:', fileUrl);
        mainWindow.loadURL(fileUrl).catch(err => {
          console.error('主进程: 使用 file:// 协议加载也失败:', err);
        });
      });
    } else {
      console.error('主进程: 生产环境文件不存在:', startUrl);
      // 尝试列出目录内容以帮助调试
      try {
        const buildDir = path.join(__dirname, '..', 'build');
        if (fs.existsSync(buildDir)) {
          console.log('主进程: build 目录内容:', fs.readdirSync(buildDir));
        } else {
          console.log('主进程: build 目录不存在');
        }
      } catch (err) {
        console.error('主进程: 列出目录内容失败:', err);
      }
    }
  }

  // 修改 IPC 处理方式
  ipcMain.handle('window-control', async (event, command) => {
    console.log('主进程: 收到窗口控制命令:', command);
    try {
      switch (command) {
        case 'minimize':
          console.log('主进程: 执行最小化窗口');
          mainWindow.minimize();
          return true;
        case 'maximize':
          // 使用我们自己的状态变量
          console.log('主进程: 当前最大化状态(自定义跟踪):', isWindowMaximized);
          if (isWindowMaximized) {
            console.log('主进程: 窗口已最大化，执行还原操作');
            // 保存当前窗口大小和位置
            if (mainWindow.isFullScreen()) {
              // 如果是全屏模式，先退出全屏
              console.log('主进程: 退出全屏模式');
              mainWindow.setFullScreen(false);
            }

            // 设置为原始大小
            setTimeout(() => {
              console.log('主进程: 还原窗口到原始大小:', originalBounds);
              mainWindow.setBounds(originalBounds);
              isWindowMaximized = false;
              console.log('主进程: 发送窗口最大化状态变化事件: false');
              mainWindow.webContents.send('window-maximize-change', false);
            }, 100);

            return false;
          } else {
            console.log('主进程: 窗口未最大化，执行最大化操作');
            // 保存当前窗口大小和位置
            originalBounds = mainWindow.getBounds();
            console.log('主进程: 保存原始窗口边界:', originalBounds);

            // 使用maximize()方法代替setFullScreen(true)
            console.log('主进程: 设置窗口为最大化');
            mainWindow.maximize();
            isWindowMaximized = true;
            console.log('主进程: 发送窗口最大化状态变化事件: true');
            mainWindow.webContents.send('window-maximize-change', true);
            return true;
          }
        case 'close':
          console.log('主进程: 关闭窗口');
          mainWindow.close();
          return true;
        default:
          console.log('主进程: 未知命令:', command);
          return false;
      }
    } catch (error) {
      console.error('主进程: 窗口控制错误:', error);
      return false;
    }
  });

  // 添加检查窗口是否最大化的处理程序
  ipcMain.handle('window-is-maximized', () => {
    console.log('主进程: 检查窗口最大化状态(自定义跟踪):', isWindowMaximized);
    return isWindowMaximized;
  });

  // 保留原有的处理程序以兼容现有代码
  ipcMain.handle('window-is-fullscreen', () => {
    const isMaximized = mainWindow.isMaximized();
    console.log('主进程: 检查窗口是否最大化(原生):', isMaximized);
    return isMaximized;
  });

  // 监听最大化状态变化
  mainWindow.on('maximize', () => {
    console.log('主进程: 窗口已最大化 - 事件触发');
    isWindowMaximized = true;
    console.log('主进程: 发送窗口最大化状态变化事件: true');
    mainWindow.webContents.send('window-maximize-change', true);
  });

  mainWindow.on('unmaximize', () => {
    console.log('主进程: 窗口已还原 - 事件触发');
    isWindowMaximized = false;
    console.log('主进程: 发送窗口最大化状态变化事件: false');
    mainWindow.webContents.send('window-maximize-change', false);
  });

  mainWindow.on('enter-full-screen', () => {
    console.log('主进程: 窗口进入全屏模式');
    isWindowMaximized = true;
    console.log('主进程: 发送窗口最大化状态变化事件: true');
    mainWindow.webContents.send('window-maximize-change', true);
  });

  mainWindow.on('leave-full-screen', () => {
    console.log('主进程: 窗口离开全屏模式');
    isWindowMaximized = false;
    console.log('主进程: 发送窗口最大化状态变化事件: false');
    mainWindow.webContents.send('window-maximize-change', false);
  });

  mainWindow.on('closed', () => {
    console.log('主进程: 窗口已关闭');
    mainWindow = null;
  });

  // 添加文件存在检查处理程序
  ipcMain.handle('file-exists', async (_, filePath) => {
    console.log('主进程: 检查文件是否存在:', filePath);
    try {
      // 处理文件路径
      let processedPath = filePath;
      if (filePath.startsWith('file://')) {
        processedPath = filePath.replace('file://', '');
      }

      console.log('主进程: 处理后的文件路径:', processedPath);
      // 检查文件是否存在
      const exists = fs.existsSync(processedPath);
      console.log('主进程: 文件存在:', exists);
      return exists;
    } catch (error) {
      console.error('主进程: 检查文件是否存在错误:', error);
      return false;
    }
  });

  // 打开开发者工具
  if (isDev && process.argv.includes('--devtools')) {
    console.log('主进程: 打开开发者工具');
    mainWindow.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  console.log('主进程: 应用程序准备就绪');
  registerFileProtocol();
  createWindow();
});

app.on("window-all-closed", () => {
  console.log('主进程: 所有窗口已关闭');
  if (process.platform !== "darwin") {
    console.log('主进程: 退出应用程序');
    app.quit();
  }
});

app.on("activate", () => {
  console.log('主进程: 应用程序激活');
  if (mainWindow === null) {
    console.log('主进程: 重新创建窗口');
    createWindow();
  }
});

console.log('主进程: 主进程脚本已加载');
