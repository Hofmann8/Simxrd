const { contextBridge, ipcRenderer } = require('electron');

// 暴露安全的API给渲染进程
contextBridge.exposeInMainWorld('electronAPI', {
  // 文件系统操作
  convertFilePath: (path) => {
    return `file://${path}`;
  },
  
  // 获取JSmol路径
  getJsmolPath: () => {
    return process.env.ELECTRON_START_URL 
      ? '/jsmol/j2s' 
      : `file://${process.resourcesPath}/app.asar/build/jsmol/j2s`;
  },
  
  // 窗口控制
  minimizeWindow: () => ipcRenderer.send('window-minimize'),
  maximizeWindow: () => ipcRenderer.send('window-maximize'),
  closeWindow: () => ipcRenderer.send('window-close'),
  isWindowMaximized: () => ipcRenderer.invoke('is-window-maximized'),
  
  // 其他API
  getAppPath: () => ipcRenderer.invoke('get-app-path')
});

// 设置electron全局变量，用于检测是否在Electron环境中
contextBridge.exposeInMainWorld('electron', {
  isElectron: true
}); 