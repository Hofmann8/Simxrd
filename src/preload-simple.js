const { contextBridge, ipcRenderer } = require('electron');

// 安全的 Electron API 给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 窗口控制
  minimizeWindow: () => ipcRenderer.invoke('window-control', 'minimize'),
  maximizeWindow: () => ipcRenderer.invoke('window-control', 'maximize'),
  closeWindow: () => ipcRenderer.invoke('window-control', 'close'),
  isWindowMaximized: () => ipcRenderer.invoke('window-is-maximized'),
  isFullscreen: () => ipcRenderer.invoke('window-is-fullscreen'),
  
  // 事件监听
  onMaximizeChange: (callback) => {
    const subscription = (_, maximized) => callback(maximized);
    ipcRenderer.on('window-maximize-change', subscription);
    return () => {
      ipcRenderer.removeListener('window-maximize-change', subscription);
    };
  }
});

// 标记为 Electron 环境
contextBridge.exposeInMainWorld('isElectron', true); 