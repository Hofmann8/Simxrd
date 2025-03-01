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

  // 注入 jQuery
  if (!window.jQuery) {
    const script = document.createElement('script');
    script.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
    script.type = 'text/javascript';
    document.head.appendChild(script);
  }
});

// 暴露安全的 API 到渲染进程
contextBridge.exposeInMainWorld('electron', {
  versions: process.versions,
  platform: process.platform,
  // 添加其他需要的 API
});

// 添加 JSmol 所需的全局变量
contextBridge.exposeInMainWorld('J2S', {});
