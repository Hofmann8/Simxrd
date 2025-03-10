import React, { useEffect, useRef } from 'react';

// 简单的path模块实现
const pathModule = {
  basename: (path) => {
    if (!path) return '';
    const parts = path.split(/[\/\\]/);
    return parts[parts.length - 1] || '';
  }
};

// 将getLightingScript函数移到组件外部
const getLightingScript = (lighting) => {
  switch (lighting) {
    case 'soft':
      return `
        set ambientPercent 60;
        set diffusePercent 70;
        set specularPercent 30;
        set specularPower 40;
      `;
    case 'sharp':
      return `
        set ambientPercent 30;
        set diffusePercent 90;
        set specularPercent 70;
        set specularPower 100;
      `;
    case 'flat':
      return `
        set ambientPercent 80;
        set diffusePercent 50;
        set specularPercent 0;
      `;
    default: // 'default'
      return `
        set ambientPercent 45;
        set diffusePercent 85;
        set specularPercent 45;
        set specularPower 80;
      `;
  }
};

// 创建JSmol初始化脚本
const createInitScript = (loadCommand, displayOptions) => {
  return `
    set antialiasdisplay true;
    background ${displayOptions.backgroundColor || 'white'};
    set specular true;
    set ambientPercent 45;
    set diffusePercent 85;
    ${loadCommand}
    select all;
    ${displayOptions.frameworkStyle === 'wireframe' ?
      'wireframe 0.1; spacefill 0%;' :
      displayOptions.frameworkStyle === 'ballStick' ?
        'wireframe 0.15; spacefill 25%;' :
        'wireframe off; spacefill 100%;'}
    color cpk;
    center selected;
    zoom 100;
    ${displayOptions.showAxes ? 'axes on;' : 'axes off;'}
    ${displayOptions.spinning ? 'spin on;' : 'spin off;'}
    refresh;
  `;
};

const CrystalStructureViewer = ({ filePath, displayOptions, saveViewerState }) => {
  const viewerRef = useRef(null);
  const jsmolInitializedRef = useRef(false);
  const prevOptionsRef = useRef(displayOptions);
  const filePathRef = useRef(filePath);
  const isElectron = window.electron !== undefined;

  // 加载XYZ文件内容
  const loadXYZFile = async (fileName, resourcePath = null) => {
    try {
      // 如果在Electron环境中且有resourcePath，使用electronAPI读取文件
      if (isElectron && resourcePath && window.electronAPI) {
        try {
          console.log('尝试从路径读取文件:', resourcePath);
          const content = await window.electronAPI.readFile(resourcePath);
          if (content) {
            return content;
          }
        } catch (error) {
          console.error('使用electronAPI读取文件失败:', error);
        }
      }

      // 在Web环境中使用fetch，或者作为Electron环境的备选方案
      const response = await fetch(`./xyz_data/${fileName}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.text();
    } catch (error) {
      console.error('无法加载XYZ文件:', error);
      return null;
    }
  };

  // 卸载JSmol
  const unloadJSmol = () => {
    try {
      if (window.jmolApplet0) {
        window.Jmol.script(window.jmolApplet0, 'exit');
        delete window.jmolApplet0;
      }
      // 移除所有JSmol相关的script标签
      const scripts = document.querySelectorAll('script[src*="jsmol"]');
      scripts.forEach(script => script.remove());
      // 重置window上的JSmol相关对象
      delete window.Jmol;
      delete window.JSmol;
      delete window.j2sPath;
      if (viewerRef.current) {
        viewerRef.current.innerHTML = '';
      }
    } catch (e) {
      console.error('卸载JSmol失败:', e);
    }
  };

  // 加载JSmol脚本
  const loadJSmolScripts = () => {
    return new Promise((resolve, reject) => {
      // 检测是否在Electron环境中
      const isElectronEnv = window.electronAPI !== undefined;
      // 在Electron环境中使用相对路径，在Web环境中使用绝对路径
      const jsmolPath = isElectronEnv ? './jsmol' : '/jsmol';

      // 只加载主要的JSmol.min.js文件，其他文件会自动加载
      const script = document.createElement('script');
      script.src = `${jsmolPath}/JSmol.min.js`;
      script.async = false;

      // 设置全局变量，确保JSmol能找到正确的路径
      window.jmolPath = jsmolPath;
      window.j2sPath = `${jsmolPath}/j2s`;

      script.onload = () => {
        console.log('JSmol脚本加载成功');
        // 给JSmol一些时间初始化
        setTimeout(resolve, 100);
      };
      script.onerror = (e) => {
        console.error('JSmol脚本加载失败:', e);
        reject(e);
      };
      document.head.appendChild(script);
    });
  };

  // 初始化JSmol
  const initJSmol = async () => {
    if (!filePath || !viewerRef.current) {
      return;
    }

    try {
      // 先卸载现有的JSmol
      unloadJSmol();

      // 如果需要重新加载JSmol脚本
      if (!window.Jmol) {
        try {
          await loadJSmolScripts();
          // 等待JSmol完全初始化
          await new Promise(resolve => setTimeout(resolve, 500));
        } catch (error) {
          console.error('加载JSmol脚本失败:', error);
          if (viewerRef.current) {
            viewerRef.current.innerHTML = `<div class="alert alert-danger">加载JSmol失败，请使用Ctrl+R刷新页面或重启软件。此问题将在下个版本修复。</div>`;
          }
          return;
        }
      }

      const fileName = pathModule.basename(filePath);
      const viewerContainer = viewerRef.current;

      let resourcePath = null;
      let content = null;

      // 在Electron环境中处理文件路径
      if (isElectron && window.electronAPI) {
        try {
          if (window.electronAPI.getResourcePath) {
            resourcePath = await window.electronAPI.getResourcePath(fileName);
            if (resourcePath) {
              content = await loadXYZFile(fileName, resourcePath);
            }
          }
        } catch (error) {
          console.error('获取资源路径失败:', error);
        }
      }

      // 如果在Electron中没有成功加载，或者在Web环境中，尝试直接加载
      if (!content) {
        content = await loadXYZFile(fileName);
      }

      if (!content) {
        throw new Error('无法加载文件内容');
      }

      // 构建加载命令
      const loadCommand = `load data "xyz"\n${content}\nend "xyz";`;

      const jmolInfo = {
        width: '100%',
        height: '100%',
        use: 'HTML5',
        j2sPath: window.j2sPath || './jsmol/j2s',
        script: createInitScript(loadCommand, displayOptions),
        debug: false,
        disableJ2SLoadMonitor: true,
        disableInitialConsole: true,
        allowJavaScript: true,
        readyFunction: (applet) => {
          jsmolInitializedRef.current = true;
          setTimeout(() => {
            try {
              window.Jmol.script(applet, loadCommand);
              window.Jmol.script(applet, 'refresh;');
              applyDisplayStyle(displayOptions.frameworkStyle);
            } catch (error) {
              console.error('应用加载命令失败:', error);
            }
          }, 100);
        }
      };

      // 创建新实例
      const jmolHtml = window.Jmol.getAppletHtml("jmolApplet0", jmolInfo);
      viewerContainer.innerHTML = jmolHtml;
    } catch (error) {
      console.error('JSmol初始化失败:', error);
      if (viewerRef.current) {
        viewerRef.current.innerHTML = `<div class="alert alert-danger">结构加载失败，请使用Ctrl+R刷新页面或重启软件。此问题将在下个版本修复。</div>`;
      }
    }
  };

  // 应用显示风格
  const applyDisplayStyle = (style) => {
    if (!window.jmolApplet0 || !window.Jmol) return;

    const styleCommands = {
      wireframe: 'wireframe 0.1; spacefill 0%; color cpk;',
      ballStick: 'wireframe 0.15; spacefill 25%; color cpk;',
      spacefill: 'wireframe off; spacefill 100%; color cpk;'
    };

    try {
      window.Jmol.script(window.jmolApplet0, `
        select all;
        ${styleCommands[style] || styleCommands.wireframe}
        center selected;
        zoom 100;
        refresh;
      `);
    } catch (error) {
      console.error('应用显示风格失败:', error);
    }
  };

  // 初始化效果
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      if (isMounted) {
        await initJSmol();
      }
    };

    init();

    return () => {
      isMounted = false;
      unloadJSmol();
    };
  }, [filePath]);

  // 处理显示选项变化
  useEffect(() => {
    if (!jsmolInitializedRef.current || !window.jmolApplet0) return;

    try {
      if (prevOptionsRef.current.frameworkStyle !== displayOptions.frameworkStyle) {
        applyDisplayStyle(displayOptions.frameworkStyle);
      }

      if (prevOptionsRef.current.showAxes !== displayOptions.showAxes) {
        window.Jmol.script(window.jmolApplet0, displayOptions.showAxes ? 'axes on;' : 'axes off;');
      }

      if (prevOptionsRef.current.backgroundColor !== displayOptions.backgroundColor) {
        window.Jmol.script(window.jmolApplet0, `background ${displayOptions.backgroundColor};`);
      }

      if (prevOptionsRef.current.lighting !== displayOptions.lighting) {
        window.Jmol.script(window.jmolApplet0, getLightingScript(displayOptions.lighting));
      }

      if (prevOptionsRef.current.spinning !== displayOptions.spinning) {
        window.Jmol.script(window.jmolApplet0, displayOptions.spinning ? 'spin on;' : 'spin off;');
      }

      prevOptionsRef.current = { ...displayOptions };
    } catch (error) {
      console.error('更新显示选项失败:', error);
    }
  }, [displayOptions]);

  return (
    <div
      ref={viewerRef}
      style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
    />
  );
};

export default CrystalStructureViewer;
