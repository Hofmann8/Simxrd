import React, { useEffect, useRef } from 'react';

const CrystalStructureViewer = ({ filePath, displayOptions, saveViewerState }) => {
  const viewerRef = useRef(null);
  const isElectron = window.electron !== undefined;
  const jsmolInitializedRef = useRef(false);
  const prevOptionsRef = useRef(displayOptions);
  const filePathRef = useRef(filePath);

  // 初始化 JSmol - 使用 useRef 来避免重复初始化
  useEffect(() => {
    // 如果已经初始化了相同的文件，则不重新初始化
    if (jsmolInitializedRef.current && filePathRef.current === filePath) {
      return;
    }
    
    // 更新当前文件路径引用
    filePathRef.current = filePath;
    
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
    }

    // 初始化脚本 - 使用更高级的设置
    const initScript = `
      set antialiasdisplay true;
      set antialiasimages true;
      background white;
      load "${processedFilePath}";
      
      # 设置高质量渲染
      set highResolution true;
      
      # 优化显示
      set perspectiveDepth true;
      set ambientPercent 45;
      set diffusePercent 85;
      set specular true;
      set specularPower 80;
      set specularExponent 5;
      set specularPercent 45;
      
      # 设置旋转行为
      set navMode JMOL;
      
      # 优化性能
      set wireframeRotation true;
      set antialiasDisplay true;
      
      # 初始化坐标轴设置
      set axesMode 1;
      set axesScale 0.3;
      set axesUnitCell;
      color axes black;
      font axes 14;
      axes off;
    `;

    const jmolInfo = {
      width: '100%',
      height: '100%',
      use: 'HTML5',
      j2sPath: isElectron && window.electronAPI ? window.electronAPI.getJsmolPath() : '/jsmol/j2s',
      script: initScript,
      disableJ2SLoadMonitor: true,
      disableInitialConsole: true,
      allowJavaScript: true,
      readyFunction: () => {
        jsmolInitializedRef.current = true;

        // 应用初始显示选项
        if (displayOptions.frameworkStyle === 'wireframe') {
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
        } else if (displayOptions.frameworkStyle === 'ballStick') {
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.15; spacefill 25%; color cpk;');
        }
        
        // 应用初始坐标轴设置
        if (displayOptions.showAxes) {
          window.Jmol.script(window.jmolApplet0, 'axes on;');
        } else {
          window.Jmol.script(window.jmolApplet0, 'axes off;');
        }

        // 保存初始选项
        prevOptionsRef.current = { ...displayOptions };
      }
    };

    // 清除容器内容
    viewerContainer.innerHTML = '';
    jsmolInitializedRef.current = false;

    // 创建 JSmol 对象
    try {
      const jmolHtml = window.Jmol.getAppletHtml("jmolApplet0", jmolInfo);
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

  // 单独处理显示选项变化
  useEffect(() => {
    if (!jsmolInitializedRef.current || !window.jmolApplet0) return;

    try {
      // 只有当显示风格变化时才更新
      if (prevOptionsRef.current.frameworkStyle !== displayOptions.frameworkStyle) {
        if (displayOptions.frameworkStyle === 'wireframe') {
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
        } else if (displayOptions.frameworkStyle === 'ballStick') {
          window.Jmol.script(window.jmolApplet0, 'wireframe 0.15; spacefill 25%; color cpk;');
        }
      }
      
      // 只有当坐标轴显示设置变化时才更新
      if (prevOptionsRef.current.showAxes !== displayOptions.showAxes) {
        if (displayOptions.showAxes) {
          window.Jmol.script(window.jmolApplet0, 'axes on;');
        } else {
          window.Jmol.script(window.jmolApplet0, 'axes off;');
        }
      }

      // 更新之前的选项引用
      prevOptionsRef.current = { ...displayOptions };
    } catch (error) {
      console.error('应用显示选项错误:', error);
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
