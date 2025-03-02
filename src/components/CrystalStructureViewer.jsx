import React, { useEffect, useRef } from 'react';

const CrystalStructureViewer = ({ filePath, displayOptions, saveViewerState }) => {
  const viewerRef = useRef(null);
  const isElectron = window.electron !== undefined;
  const jsmolInitializedRef = useRef(false);

  // 初始化 JSmol
  useEffect(() => {
    if (!window.Jmol) {
      console.error('JSmol 库未加载');
      return;
    }

    const viewerContainer = viewerRef.current;
    if (!viewerContainer) {
      console.error('查看器容器不可用');
      return;
    }

    // 处理 Electron 环境下的文件路径
    let processedFilePath = filePath;
    if (isElectron && window.electronAPI) {
      processedFilePath = window.electronAPI.convertFilePath(filePath);
      console.log('Electron 环境下的文件路径:', processedFilePath);
    }

    const jmolInfo = {
      width: '100%',
      height: '100%',
      use: 'HTML5',
      j2sPath: isElectron && window.electronAPI ? window.electronAPI.getJsmolPath() : '/jsmol/j2s',
      script: `set antialiasdisplay; set antialiasimages; background white; load "${processedFilePath}";`,
      disableJ2SLoadMonitor: true,
      disableInitialConsole: true,
      allowJavaScript: true,
      readyFunction: () => {
        console.log('JSmol 已准备就绪');
        jsmolInitializedRef.current = true;

        // 初始化完成后应用当前显示选项
        applyDisplayOptions(displayOptions);
      }
    };

    // 清除容器内容
    viewerContainer.innerHTML = '';
    jsmolInitializedRef.current = false;

    // 创建 JSmol 对象
    try {
      const jmolHtml = window.Jmol.getAppletHtml("jmolApplet0", jmolInfo);

      // 将 HTML 字符串插入到容器中
      viewerContainer.innerHTML = jmolHtml;
    } catch (error) {
      console.error('JSmol 初始化错误:', error);
      viewerContainer.innerHTML = `<div class="alert alert-danger">JSmol 初始化错误: ${error.message}</div>`;
    }

    // 清理函数
    return () => {
      try {
        if (window.jmolApplet0) {
          const state = {
            rotation: window.Jmol.evaluateVar(window.jmolApplet0, 'quaternion()'),
            zoom: window.Jmol.evaluateVar(window.jmolApplet0, 'zoom'),
            translation: window.Jmol.evaluateVar(window.jmolApplet0, 'translate()'),
            slab: window.Jmol.evaluateVar(window.jmolApplet0, 'slab')
          };
          saveViewerState(state);
        }
      } catch (e) {
        console.error('Error saving JSmol state:', e);
      }
    };
  }, [filePath, isElectron, saveViewerState, displayOptions]);

  // 应用显示选项的函数
  const applyDisplayOptions = (options) => {
    if (!window.jmolApplet0) return;

    try {
      // 应用显示风格
      if (options.frameworkStyle === 'wireframe') {
        window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
      } else if (options.frameworkStyle === 'ballStick') {
        window.Jmol.script(window.jmolApplet0, 'wireframe 0.15; spacefill 25%; color cpk;');
      }

      // 应用坐标轴 - 直接设置，不需要重新加载模型
      if (options.axes) {
        window.Jmol.script(window.jmolApplet0, 'axes on; axes 0.15; axes scale 2.0; color axes black;');
      } else {
        window.Jmol.script(window.jmolApplet0, 'axes off;');
      }
    } catch (error) {
      console.error('应用显示选项错误:', error);
    }
  };

  // 监听显示选项变化
  useEffect(() => {
    if (jsmolInitializedRef.current) {
      applyDisplayOptions(displayOptions);
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
