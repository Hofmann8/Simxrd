import React, { useEffect, useRef } from 'react';

const CrystalStructureViewer = ({ filePath, displayOptions }) => {
  const viewerRef = useRef(null);

  useEffect(() => {
    if (!window.Jmol) {
      console.error('JSmol is not loaded. Ensure JSmol.min.js and related files are properly included.');
      return;
    }

    const viewerContainer = viewerRef.current;

    if (!viewerContainer) {
      console.error('Viewer container is not available.');
      return;
    }

    const jsmolOptions = {
      width: '100%',
      height: '100%',
      j2sPath: '/jsmol/j2s', // 确保路径正确
      script: `load ${filePath}; display all;`,
      disableInitialConsole: true, // 禁用初始控制台输出
    };

    let jsmolViewer;

    const initJSmolViewer = () => {
      try {
        viewerContainer.innerHTML = ''; // 清空容器
        jsmolViewer = window.Jmol.getApplet('jsmolViewer', jsmolOptions);

        if (jsmolViewer) {
          viewerContainer.innerHTML = window.Jmol.getAppletHtml(jsmolViewer);
        } else {
          console.error('Failed to generate JSmol applet HTML.');
        }
      } catch (error) {
        console.error('Error initializing JSmol Viewer:', error);
      }
    };

    initJSmolViewer();

    return () => {
      if (viewerContainer) {
        viewerContainer.innerHTML = ''; // 防止内存泄漏
      }
    };
  }, [filePath]); // 初始化时只依赖 filePath

  // 动态更新显示选项
  useEffect(() => {
    if (!window.Jmol || !viewerRef.current) return;

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

      return script;
    };

    const script = generateJmolScript();
    window.Jmol.script(window.jsmolViewer, script); // 动态更新显示选项
  }, [displayOptions]); // 每次 displayOptions 更新时调用

  return (
    <div
      ref={viewerRef}
      style={{
        width: '100%',
        height: '600px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    />
  );
};

export default CrystalStructureViewer;
