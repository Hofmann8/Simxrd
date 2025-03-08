import React, { useEffect, useRef } from 'react';

const CrystalStructureViewer = ({ filePath, displayOptions, saveViewerState }) => {
  const viewerRef = useRef(null);
  const isElectron = window.isElectron || !!window.electronAPI;
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
    if (isElectron && window.electronAPI && window.electronAPI.convertFilePath) {
      processedFilePath = window.electronAPI.convertFilePath(filePath);
    }

    // 初始化脚本 - 使用更高级的设置
    const initScript = `
      set antialiasdisplay true;
      set antialiasimages true;
      background ${displayOptions.backgroundColor || 'white'};
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
      
      # 设置光照效果
      ${getLightingScript(displayOptions.lighting)}
      
      # 禁用右键菜单
      set rightMouseAction ROTATE;
      set allowContextMenu false;
    `;

    // 获取 j2sPath - 在 Web 环境中使用默认路径
    let j2sPath = '/jsmol/j2s';
    if (isElectron && window.electronAPI && window.electronAPI.getJsmolPath) {
      try {
        j2sPath = window.electronAPI.getJsmolPath();
      } catch (error) {
        console.error('获取 JSmol 路径失败，使用默认路径:', error);
      }
    }

    const jmolInfo = {
      width: '100%',
      height: '100%',
      use: 'HTML5',
      j2sPath: j2sPath,
      script: initScript,
      disableJ2SLoadMonitor: true,
      disableInitialConsole: true,
      allowJavaScript: true,
      menuFile: null, // 禁用菜单
      readyFunction: () => {
        jsmolInitializedRef.current = true;

        // 应用初始显示选项
        applyDisplayStyle(displayOptions.frameworkStyle);

        // 应用初始坐标轴设置
        if (displayOptions.showAxes) {
          window.Jmol.script(window.jmolApplet0, 'axes on;');
        } else {
          window.Jmol.script(window.jmolApplet0, 'axes off;');
        }

        // 应用初始自旋设置
        if (displayOptions.spinning) {
          window.Jmol.script(window.jmolApplet0, 'spin on;');
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

  // 获取光照效果脚本
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

  // 应用显示风格
  const applyDisplayStyle = (style) => {
    if (!window.jmolApplet0) return;

    switch (style) {
      case 'wireframe':
        window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
        break;
      case 'ballStick':
        window.Jmol.script(window.jmolApplet0, 'wireframe 0.15; spacefill 25%; color cpk;');
        break;
      case 'spacefill':
        window.Jmol.script(window.jmolApplet0, 'wireframe off; spacefill 100%; color cpk;');
        break;
      default:
        window.Jmol.script(window.jmolApplet0, 'wireframe 0.1; spacefill 0%; color cpk;');
    }
  };

  // 单独处理显示选项变化
  useEffect(() => {
    if (!jsmolInitializedRef.current || !window.jmolApplet0) return;

    try {
      // 只有当显示风格变化时才更新
      if (prevOptionsRef.current.frameworkStyle !== displayOptions.frameworkStyle) {
        applyDisplayStyle(displayOptions.frameworkStyle);
      }

      // 只有当坐标轴显示设置变化时才更新
      if (prevOptionsRef.current.showAxes !== displayOptions.showAxes) {
        if (displayOptions.showAxes) {
          window.Jmol.script(window.jmolApplet0, 'axes on;');
        } else {
          window.Jmol.script(window.jmolApplet0, 'axes off;');
        }
      }

      // 只有当背景颜色变化时才更新
      if (prevOptionsRef.current.backgroundColor !== displayOptions.backgroundColor) {
        window.Jmol.script(window.jmolApplet0, `background ${displayOptions.backgroundColor};`);
      }
      
      // 只有当光照效果变化时才更新
      if (prevOptionsRef.current.lighting !== displayOptions.lighting) {
        window.Jmol.script(window.jmolApplet0, getLightingScript(displayOptions.lighting));
      }
      
      // 只有当自旋状态变化时才更新
      if (prevOptionsRef.current.spinning !== displayOptions.spinning) {
        window.Jmol.script(window.jmolApplet0, displayOptions.spinning ? 'spin on;' : 'spin off;');
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
