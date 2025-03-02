import React, { useEffect, useRef } from 'react';

const CrystalStructureViewer = ({ filePath, displayOptions, saveViewerState, savedState }) => {
  const viewerRef = useRef(null);
  const isElectron = window.electron !== undefined;

  useEffect(() => {
    if (!window.Jmol) {
      console.error('JSmol 未加载。请确保 JSmol.min.js 和相关文件已正确包含。');
      return;
    }

    const viewerContainer = viewerRef.current;

    if (!viewerContainer) {
      console.error('查看器容器不可用。');
      return;
    }

    // 处理 Electron 环境下的文件路径
    let processedFilePath = filePath;
    if (isElectron && window.electronAPI) {
      // 使用预加载脚本中暴露的 API 处理路径
      processedFilePath = window.electronAPI.convertFilePath(filePath);
      console.log('Electron 环境下的文件路径:', processedFilePath);
    }

    const jsmolOptions = {
      width: '100%',
      height: '100%',
      j2sPath: isElectron && window.electronAPI ? window.electronAPI.getJsmolPath() : '/jsmol/j2s',
      script: `load "${processedFilePath}"; display all;`,
      disableInitialConsole: true, // 禁用初始控制台输出
      use: 'HTML5',  // 强制使用 HTML5 渲染器
      disableJ2SLoadMonitor: true,
      debug: isElectron // 在 Electron 中启用调试
    };

    let jsmolViewer;

    const initJSmolViewer = () => {
      try {
        viewerContainer.innerHTML = ''; // 清空容器
        jsmolViewer = window.Jmol.getApplet('jsmolViewer', jsmolOptions);

        if (jsmolViewer) {
          viewerContainer.innerHTML = window.Jmol.getAppletHtml(jsmolViewer);
          
          // 如果有保存的状态，恢复它
          if (savedState && Object.keys(savedState).length > 0) {
            setTimeout(() => {
              window.Jmol.script(window.jsmolViewer, savedState.script || '');
            }, 500);
          }
        } else {
          console.error('无法生成 JSmol applet HTML。');
        }
      } catch (error) {
        console.error('初始化 JSmol 查看器时出错:', error);
      }
    };

    initJSmolViewer();

    return () => {
      if (viewerContainer) {
        viewerContainer.innerHTML = ''; // 防止内存泄漏
      }
    };
  }, [filePath, isElectron, savedState]); // 初始化时依赖 filePath 和 isElectron

  // 动态更新显示选项
  useEffect(() => {
    if (!window.Jmol || !viewerRef.current || !window.jsmolViewer) return;

    const generateJmolScript = () => {
      let script = '';

      if (displayOptions.frameworkStyle === 'wireframe') {
        script += 'wireframe only;';
      } else if (displayOptions.frameworkStyle === 'stick') {
        script += 'wireframe off; spacefill off; select all; wireframe 0.15;';
      } else if (displayOptions.frameworkStyle === 'ballStick') {
        script += 'wireframe off; spacefill 0.4; wireframe 0.15;';
      }

      if (displayOptions.depthFading === 'light') {
        script += 'set zshade on; set zshadePower 1;';
      } else if (displayOptions.depthFading === 'medium') {
        script += 'set zshade on; set zshadePower 2;';
      } else if (displayOptions.depthFading === 'strong') {
        script += 'set zshade on; set zshadePower 3;';
      } else {
        script += 'set zshade off;';
      }

      if (displayOptions.unitCell) {
        script += 'unitcell on;';
      } else {
        script += 'unitcell off;';
      }

      if (displayOptions.axes) {
        script += 'axes on;';
      } else {
        script += 'axes off;';
      }

      // 保存当前状态
      if (saveViewerState) {
        saveViewerState({ script });
      }

      return script;
    };

    const script = generateJmolScript();
    try {
      window.Jmol.script(window.jsmolViewer, script); // 动态更新显示选项
    } catch (error) {
      console.error('执行 JSmol 脚本时出错:', error);
    }
  }, [displayOptions, saveViewerState]); // 每次 displayOptions 更新时调用

  return (
    <div 
      ref={viewerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
      }}
    />
  );
};

export default CrystalStructureViewer;
