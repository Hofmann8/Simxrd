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
  minimizeWindow: async () => {
    try {
      return await ipcRenderer.invoke('window-control', 'minimize');
    } catch (error) {
      console.error('Minimize error:', error);
      return false;
    }
  },
  maximizeWindow: async () => {
    try {
      return await ipcRenderer.invoke('window-control', 'maximize');
    } catch (error) {
      console.error('Maximize error:', error);
      return false;
    }
  },
  closeWindow: async () => {
    try {
      return await ipcRenderer.invoke('window-control', 'close');
    } catch (error) {
      console.error('Close error:', error);
      return false;
    }
  },
  
  // 事件监听
  onMaximizeChange: (callback) => {
    const handler = (_, value) => callback(value);
    ipcRenderer.on('window-maximize-change', handler);
    return () => ipcRenderer.removeListener('window-maximize-change', handler);
  }
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
