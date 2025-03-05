import React, { useState, useEffect } from 'react';

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      const cleanup = window.electronAPI.onMaximizeChange((maximized) => {
        setIsMaximized(maximized);
        // 同时更新 app-wrapper 的状态
        document.querySelector('.app-wrapper').setAttribute('data-maximized', maximized);
      });
      return cleanup;
    }
  }, []);

  const handleMinimize = async () => {
    try {
      await window.electronAPI?.minimizeWindow();
    } catch (error) {
      console.error('Failed to minimize window:', error);
    }
  };

  const handleMaximize = async () => {
    try {
      await window.electronAPI?.maximizeWindow();
    } catch (error) {
      console.error('Failed to maximize window:', error);
    }
  };

  const handleClose = async () => {
    try {
      await window.electronAPI?.closeWindow();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  return (
    <div className="title-bar" data-maximized={isMaximized}>
      <div className="title-text">SimXRD-DUT</div>
      <div className="test-shape">
        <div
          className="test-button minimize"
          onClick={handleMinimize}
          title="最小化"
        />
        <div
          className="test-button maximize"
          onClick={handleMaximize}
          title={isMaximized ? "还原" : "最大化"}
        />
        <div
          className="test-button close"
          onClick={handleClose}
          title="关闭"
        />
      </div>
    </div>
  );
};

export default TitleBar; 