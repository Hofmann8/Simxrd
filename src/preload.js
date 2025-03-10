// 检查是否在 Electron 环境中运行
const isElectron = typeof process !== 'undefined' && process.versions && process.versions.electron;
console.log("isElectron", isElectron)

// 创建一个简单的path模块实现
const pathModule = {
  join: (...args) => {
    // 过滤空字符串
    const parts = args.filter(part => part !== '');
    // 使用/连接路径，并处理多余的/
    return parts.join('/').replace(/\/+/g, '/');
  },
  resolve: (...args) => {
    // 简单实现，不处理..和.
    return args.join('/').replace(/\/+/g, '/');
  },
  dirname: (p) => {
    // 获取路径的目录部分
    const parts = p.split('/');
    parts.pop();
    return parts.join('/') || '.';
  },
  basename: (p, ext) => {
    // 获取路径的文件名部分
    const parts = p.split('/');
    let base = parts[parts.length - 1] || '';
    if (ext && base.endsWith(ext)) {
      base = base.slice(0, -ext.length);
    }
    return base;
  },
  extname: (p) => {
    // 获取路径的扩展名部分
    const parts = p.split('.');
    return parts.length > 1 ? '.' + parts[parts.length - 1] : '';
  },
  isAbsolute: (p) => {
    // 检查路径是否是绝对路径
    return p.startsWith('/') || /^[A-Za-z]:/.test(p);
  },
  parse: (p) => {
    // 解析路径
    const root = p.startsWith('/') ? '/' : '';
    const dir = pathModule.dirname(p);
    const base = pathModule.basename(p);
    const ext = pathModule.extname(p);
    const name = base.slice(0, base.length - ext.length);
    return { root, dir, base, ext, name };
  },
  format: (pathObject) => {
    // 格式化路径
    const { root = '', dir = '', base = '', ext = '', name = '' } = pathObject;
    const path = dir ? `${dir}/${base || (name + ext)}` : (root + (base || (name + ext)));
    return path;
  }
};

// 记录使用自定义path模块
console.log('预加载脚本: 使用自定义 path 模块');

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

        // 检查filePath是否为null或undefined
        if (!filePath) {
          console.error('渲染进程: 文件路径为空');
          return '';
        }

        // 处理相对路径
        if (filePath.startsWith('/')) {
          // 在生产环境中，需要特殊处理路径
          const isDev = process.argv.includes('dev');
          if (!isDev) {
            // 尝试使用资源路径
            try {
              // 首先尝试从应用程序资源目录加载
              const resourcePath = pathModule.join(process.resourcesPath, 'app', 'build', filePath.substring(1));
              console.log('渲染进程: 尝试资源路径:', resourcePath);
              return `file://${resourcePath}`;
            } catch (error) {
              console.error('渲染进程: 资源路径处理错误:', error);
            }
          }
        }

        // 将相对路径转换为绝对路径
        if (!filePath.startsWith('/') && !filePath.includes('://')) {
          const result = `file://${pathModule.resolve(filePath)}`;
          console.log('渲染进程: convertFilePath 结果:', result);
          return result;
        }
        return filePath;
      },

      // 获取 JSmol 路径
      getJsmolPath: () => {
        console.log('渲染进程: 调用 getJsmolPath');
        const result = pathModule.join(process.resourcesPath, 'app', 'build', 'jsmol', 'j2s');
        console.log('渲染进程: getJsmolPath 结果:', result);
        return result;
      },

      // 获取资源路径
      getResourcePath: (relativePath) => {
        console.log('渲染进程: 调用 getResourcePath:', relativePath);
        return ipcRenderer.invoke('get-resource-path', relativePath)
          .then(result => {
            console.log('渲染进程: getResourcePath 结果:', result);
            return result;
          })
          .catch(err => {
            console.error('渲染进程: getResourcePath 错误:', err);
            throw err;
          });
      },

      // 添加 readFile 方法
      readFile: (filePath) => {
        console.log('渲染进程: 调用 readFile:', filePath);
        return ipcRenderer.invoke('read-file', filePath)
          .then(result => {
            console.log('渲染进程: readFile 结果:', result.success ? '成功' : '失败');
            return result;
          })
          .catch(err => {
            console.error('渲染进程: readFile 错误:', err);
            throw err;
          });
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
