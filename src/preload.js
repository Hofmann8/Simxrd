const { contextBridge, ipcRenderer } = require('electron');

// 预加载脚本
// 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document) 和 Node.js 环境
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// 统一的 electronAPI
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('window-control', 'minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-control', 'maximize'),
  closeWindow: () => ipcRenderer.invoke('window-control', 'close'),
  
  // 事件监听
  onMaximizeChange: (callback) => {
    ipcRenderer.on('window-maximize-change', (_, isMaximized) => callback(isMaximized));
    return () => {
      ipcRenderer.removeAllListeners('window-maximize-change');
    };
  },

  // 新增方法
  isWindowMaximized: async () => {
    try {
      return await ipcRenderer.invoke('window-is-maximized');
    } catch (error) {
      console.error('Check maximize error:', error);
      return false;
    }
  },

  // 添加检查窗口是否全屏的方法
  isWindowFullScreen: () => ipcRenderer.invoke('window-is-maximized'),

  // 添加检查窗口是否最大化的处理程序
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),
});

// 事件监听器
contextBridge.exposeInMainWorld('electron', {
  on: (channel, callback) => {
    console.log(`Setting up listener for channel: ${channel}`);
    ipcRenderer.on(channel, callback);
  },
  off: (channel, callback) => {
    console.log(`Removing listener for channel: ${channel}`);
    ipcRenderer.removeListener(channel, callback);
  }
});

// 标记为 Electron 环境
contextBridge.exposeInMainWorld('isElectron', true);
