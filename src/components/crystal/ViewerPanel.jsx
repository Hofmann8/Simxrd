import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FaSyncAlt, FaUndo, FaCamera, FaSearchMinus, FaSearchPlus } from 'react-icons/fa';
import { viewerPanelStyles } from './styles';

const ViewerPanel = ({ 
  filePath, 
  jsmolRef, 
  isSpinning, 
  handleSpin, 
  handleReset,
  updateCounts
}) => {
  const viewerRef = useRef(null);
  const [loadingError, setLoadingError] = useState(null);
  const initializationAttemptedRef = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  // 使用 useCallback 优化函数
  const handleZoomIn = useCallback(() => {
    if (jsmolRef.current) {
      window.Jmol.script(jsmolRef.current, 'zoom in');
    }
  }, [jsmolRef]);

  const handleZoomOut = useCallback(() => {
    if (jsmolRef.current) {
      window.Jmol.script(jsmolRef.current, 'zoom out');
    }
  }, [jsmolRef]);

  const handleScreenshot = useCallback(() => {
    if (jsmolRef.current) {
      window.Jmol.script(jsmolRef.current, 'write IMAGE 1200 900 PNG "screenshot.png"');
    }
  }, [jsmolRef]);

  // 初始化 JSmol - 使用直接加载文件内容的方式
  useEffect(() => {
    // 防止重复初始化
    if (initializationAttemptedRef.current) {
      return;
    }
    
    initializationAttemptedRef.current = true;
    setIsLoading(true);
    
    if (!window.Jmol) {
      console.log("JSmol 未加载");
      setLoadingError("JSmol 库未正确加载");
      setIsLoading(false);
      return;
    }

    try {
      // 清空容器
      const container = viewerRef.current;
      if (container) {
        container.innerHTML = '';
      }

      // 先加载默认模型文件
      fetch('/xyz_data/FAU.xyz')
        .then(response => {
          if (!response.ok) {
            throw new Error('无法加载FAU.xyz文件');
          }
          return response.text();
        })
        .then(fileData => {
          console.log("FAU.xyz加载成功，长度:", fileData.length);
          
          // 创建新的 JSmol 实例
          const Info = {
            width: '100%',
            height: '100%',
            use: "HTML5",
            j2sPath: "./jsmol/j2s", // 使用相对路径
            script: `data "model"\n${fileData}\nend "model"; set antialiasdisplay; set antialiasimages; background white;`,
            disableJ2SLoadMonitor: true,
            disableInitialConsole: true,
            allowJavaScript: true,
            color: "#FFFFFF",
            debug: true, // 添加调试
            readyFunction: (applet) => {
              console.log("JSmol 已准备就绪");
              jsmolRef.current = applet;
              
              // 设置初始显示样式
              window.Jmol.script(applet, 'wireframe 0.15; spacefill 23%; center; spin on;');
              
              setIsLoading(false);
              
              // 更新原子和键的计数
              setTimeout(updateCounts, 1000);
            }
          };

          // 创建JSmol实例
          jsmolRef.current = window.Jmol.getApplet("jsmolApplet0", Info);
          
          // 将JSmol HTML添加到容器
          if (container) {
            container.innerHTML = window.Jmol.getAppletHtml(jsmolRef.current);
          }
        })
        .catch(error => {
          console.error("加载模型文件失败:", error);
          setLoadingError(`加载模型文件失败: ${error.message}`);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("初始化 JSmol 时出错:", error);
      setLoadingError(`初始化 JSmol 时出错: ${error.message}`);
      setIsLoading(false);
    }

    // 组件卸载时清理
    return () => {
      if (jsmolRef.current) {
        try {
          window.Jmol.script(jsmolRef.current, 'exit');
          jsmolRef.current = null;
        } catch (e) {
          console.error("清理 JSmol 实例时出错:", e);
        }
      }
    };
  }, [jsmolRef, updateCounts]);

  return (
    <div className="main-viewer" style={viewerPanelStyles.panel}>
      <div className="viewer-toolbar" style={viewerPanelStyles.toolbar}>
        <div className="toolbar-group" style={viewerPanelStyles.toolbarGroup}>
          <button
            className={`toolbar-btn ${isSpinning ? 'active' : ''}`}
            style={isSpinning ? viewerPanelStyles.activeToolbarButton : viewerPanelStyles.toolbarButton}
            onClick={handleSpin}
            title={isSpinning ? "停止旋转" : "开始旋转"}
            disabled={isLoading || loadingError}
          >
            <FaSyncAlt style={viewerPanelStyles.icon} /> {isSpinning ? '停止旋转' : '开始旋转'}
          </button>
          
          <button 
            className="toolbar-btn" 
            style={viewerPanelStyles.toolbarButton}
            onClick={handleReset}
            title="重置视图"
            disabled={isLoading || loadingError}
          >
            <FaUndo style={viewerPanelStyles.icon} /> 重置视图
          </button>
          
          <button 
            className="toolbar-btn" 
            style={viewerPanelStyles.toolbarButton}
            onClick={handleZoomIn}
            title="放大"
            disabled={isLoading || loadingError}
          >
            <FaSearchPlus style={viewerPanelStyles.icon} />
          </button>
          
          <button 
            className="toolbar-btn" 
            style={viewerPanelStyles.toolbarButton}
            onClick={handleZoomOut}
            title="缩小"
            disabled={isLoading || loadingError}
          >
            <FaSearchMinus style={viewerPanelStyles.icon} />
          </button>
          
          <button 
            className="toolbar-btn" 
            style={viewerPanelStyles.toolbarButton}
            onClick={handleScreenshot}
            title="截图"
            disabled={isLoading || loadingError}
          >
            <FaCamera style={viewerPanelStyles.icon} />
          </button>
        </div>
      </div>

      <div className="viewer-container" style={viewerPanelStyles.container}>
        {loadingError ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            color: 'red',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p>加载错误: {loadingError}</p>
          </div>
        ) : isLoading ? (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            padding: '20px',
            textAlign: 'center'
          }}>
            <p>正在加载分子结构，请稍候...</p>
          </div>
        ) : (
          <div
            ref={viewerRef}
            id="jmolApplet0_appletdiv"
            className="jmol-viewer"
            style={viewerPanelStyles.viewer}
          />
        )}
      </div>
    </div>
  );
};

export default ViewerPanel; 