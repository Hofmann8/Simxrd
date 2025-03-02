const { contextBridge, ipcRenderer } = require('electron');
const path = require('path');

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

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  versions: process.versions,
  platform: process.platform
});

// 暴露文件路径处理 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 转换文件路径为 Electron 可用格式
  convertFilePath: (filePath) => {
    // 在 Electron 中使用绝对路径
    return `file://${path.join(process.cwd(), 'build', filePath)}`;
  },
  // 获取 JSmol 路径
  getJsmolPath: () => {
    return `file://${path.join(process.cwd(), 'build', 'jsmol', 'j2s')}`;
  },
  // 检查文件是否存在
  fileExists: (filePath) => {
    const fs = require('fs');
    const fullPath = path.join(process.cwd(), 'build', filePath);
    return fs.existsSync(fullPath);
  }
});

// 标记为 Electron 环境
window.electron = true;
