import React, { useState, useEffect, useRef } from 'react';

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const lastActionRef = useRef('none'); // 跟踪最后一次操作

  useEffect(() => {
    if (window.electronAPI) {
      // 监听窗口最大化状态变化
      const cleanup = window.electronAPI.onMaximizeChange((maximized) => {
        console.log('收到窗口状态变化事件:', maximized);
        setIsMaximized(maximized);
        // 同时更新 app-wrapper 的状态
        document.querySelector('.app-wrapper').setAttribute('data-maximized', maximized);
      });
      
      // 初始化时检查窗口状态
      window.electronAPI.isWindowMaximized().then(maximized => {
        console.log('初始窗口最大化状态:', maximized);
        setIsMaximized(maximized);
        document.querySelector('.app-wrapper').setAttribute('data-maximized', maximized);
      }).catch(err => console.error('Failed to check window state:', err));
      
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
      // 根据当前状态决定执行什么操作
      if (isMaximized) {
        console.log('当前窗口已全屏，执行退出全屏操作');
        lastActionRef.current = 'exitFullscreen';
      } else {
        console.log('当前窗口未全屏，执行全屏操作');
        lastActionRef.current = 'enterFullscreen';
      }
      
      const newState = await window.electronAPI?.maximizeWindow();
      console.log('操作后返回的状态:', newState);
      
      // 强制更新状态，以防事件没有触发
      setIsMaximized(newState);
      document.querySelector('.app-wrapper').setAttribute('data-maximized', newState);
    } catch (error) {
      console.error('Failed to toggle fullscreen:', error);
    }
  };

  const handleClose = async () => {
    try {
      await window.electronAPI?.closeWindow();
    } catch (error) {
      console.error('Failed to close window:', error);
    }
  };

  console.log('渲染 TitleBar，当前全屏状态:', isMaximized);

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
          title={isMaximized ? "退出全屏" : "全屏"}
          data-state={isMaximized ? "maximized" : "normal"}
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