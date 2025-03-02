import React, { useState, useEffect } from 'react';
import { FaWindowMinimize, FaRegSquare, FaRegWindowMaximize, FaTimes } from 'react-icons/fa';

const CustomTitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const isElectron = window.electron !== undefined;
  
  // 检查窗口是否最大化
  useEffect(() => {
    if (isElectron) {
      const checkMaximized = async () => {
        try {
          const maximized = await window.electronAPI.isWindowMaximized();
          setIsMaximized(maximized);
        } catch (error) {
          console.error('Error checking window state:', error);
        }
      };
      
      checkMaximized();
      
      // 添加事件监听器以检测窗口大小变化
      window.addEventListener('resize', checkMaximized);
      
      return () => {
        window.removeEventListener('resize', checkMaximized);
      };
    }
  }, [isElectron]);
  
  // 如果不是Electron环境，不显示自定义标题栏
  if (!isElectron) {
    return null;
  }
  
  return (
    <div className="custom-title-bar">
      <div className="title-bar-drag-area">
        <div className="app-title">
          <span>SimXRD-DUT</span>
        </div>
      </div>
      <div className="window-controls">
        <button 
          className="window-control-button minimize"
          onClick={() => window.electronAPI.minimizeWindow()}
        >
          <FaWindowMinimize />
        </button>
        <button 
          className="window-control-button maximize"
          onClick={() => window.electronAPI.maximizeWindow()}
        >
          {isMaximized ? <FaRegSquare /> : <FaRegWindowMaximize />}
        </button>
        <button 
          className="window-control-button close"
          onClick={() => window.electronAPI.closeWindow()}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default CustomTitleBar; 