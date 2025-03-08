// 检查是否在 Electron 环境中运行
const isElectron = typeof process !== 'undefined' && process.versions && process.versions.electron;
console.log("isElectron", isElectron)
// 只在 Electron 环境中导入 Node.js 模块
let path;
if (isElectron) {
  try {
    path = require('path');
    console.log('预加载脚本: 成功导入 path 模块');
  } catch (error) {
    console.error('预加载脚本: 导入 path 模块失败:', error);
  }
}

// 预加载脚本开始
console.log('预加载脚本开始加载...', isElectron ? '在 Electron 环境中' : '在 Web 环境中');

// 只在 Electron 环境中设置 contextBridge
if (isElectron) {
  try {
    const { contextBridge, ipcRenderer } = require('electron');

    // 安全的 Electron API 给渲染进程
    contextBridge.exposeInMainWorld('electronAPI', {
      // 窗口控制
      minimizeWindow: () => {
        console.log('渲染进程: 调用 minimizeWindow');
        return ipcRenderer.invoke('window-control', 'minimize')
          .then(result => {
            console.log('渲染进程: minimizeWindow 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: minimizeWindow 错误:', err);
            throw err;
          });
      },

      maximizeWindow: () => {
        console.log('渲染进程: 调用 maximizeWindow');
        return ipcRenderer.invoke('window-control', 'maximize')
          .then(result => {
            console.log('渲染进程: maximizeWindow 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: maximizeWindow 错误:', err);
            throw err;
          });
      },

      closeWindow: () => {
        console.log('渲染进程: 调用 closeWindow');
        return ipcRenderer.invoke('window-control', 'close')
          .then(result => {
            console.log('渲染进程: closeWindow 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: closeWindow 错误:', err);
            throw err;
          });
      },

      isWindowMaximized: () => {
        console.log('渲染进程: 调用 isWindowMaximized');
        return ipcRenderer.invoke('window-is-maximized')
          .then(result => {
            console.log('渲染进程: isWindowMaximized 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: isWindowMaximized 错误:', err);
            throw err;
          });
      },

      isFullscreen: () => {
        console.log('渲染进程: 调用 isFullscreen');
        return ipcRenderer.invoke('window-is-fullscreen')
          .then(result => {
            console.log('渲染进程: isFullscreen 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: isFullscreen 错误:', err);
            throw err;
          });
      },

      // 文件操作
      convertFilePath: (filePath) => {
        console.log('渲染进程: 调用 convertFilePath:', filePath);
        // 将相对路径转换为绝对路径
        if (!filePath.startsWith('/') && !filePath.includes('://')) {
          const result = `file://${path.resolve(filePath)}`;
          console.log('渲染进程: convertFilePath 结果:', result);
          return result;
        }
        return filePath;
      },

      // 获取 JSmol 路径
      getJsmolPath: () => {
        console.log('渲染进程: 调用 getJsmolPath');
        const result = path.join(process.resourcesPath, 'app', 'build', 'jsmol', 'j2s');
        console.log('渲染进程: getJsmolPath 结果:', result);
        return result;
      },

      // 添加 fileExists 方法
      fileExists: (filePath) => {
        console.log('渲染进程: 调用 fileExists:', filePath);
        return ipcRenderer.invoke('file-exists', filePath)
          .then(result => {
            console.log('渲染进程: fileExists 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: fileExists 错误:', err);
            throw err;
          });
      },

      // 事件监听
      onMaximizeChange: (callback) => {
        console.log('渲染进程: 设置 onMaximizeChange 监听器');
        const subscription = (_, maximized) => {
          console.log('渲染进程: 收到 window-maximize-change 事件:', maximized);
          callback(maximized);
        };
        ipcRenderer.on('window-maximize-change', subscription);
        return () => {
          console.log('渲染进程: 移除 onMaximizeChange 监听器');
          ipcRenderer.removeListener('window-maximize-change', subscription);
        };
      }
    });

    // 事件监听器
    contextBridge.exposeInMainWorld('electron', {
      on: (channel, callback) => {
        console.log(`渲染进程: 设置监听器 for channel: ${channel}`);
        ipcRenderer.on(channel, callback);
      },
      off: (channel, callback) => {
        console.log(`渲染进程: 移除监听器 for channel: ${channel}`);
        ipcRenderer.removeListener(channel, callback);
      }
    });

    // 标记为 Electron 环境
    contextBridge.exposeInMainWorld('isElectron', true);

    contextBridge.exposeInMainWorld('preloadTest', {
      test: () => {
        console.log('预加载测试函数被调用');
        return '预加载脚本正常工作';
      }
    });

    console.log('预加载脚本: contextBridge 设置完成');
  } catch (error) {
    console.error('预加载脚本: 设置 contextBridge 失败:', error);
  }
} else {
  // 在 Web 环境中，提供一个空的 electronAPI 对象
  console.log('预加载脚本: 在 Web 环境中运行，不设置 Electron API');

  // 在 window 对象上设置一个标志，表示不是 Electron 环境
  window.isElectron = false;
}

console.log('预加载脚本已完成初始化');
