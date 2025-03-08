import React, { useState, useEffect, useRef } from 'react';
import simxrdLogo from '../assets/simxrd.png'; // 假设您将图片移动到了 assets 目录

const TitleBar = () => {
  const [isMaximized, setIsMaximized] = useState(false);
  const lastActionRef = useRef('none'); // 跟踪最后一次操作
  const isElectronEnv = window.isElectron || !!window.electronAPI;

  useEffect(() => {
    console.log('TitleBar: 组件挂载，检查是否在 Electron 环境中:', isElectronEnv);
    console.log('TitleBar: 检查 electronAPI 是否存在:', !!window.electronAPI);
    console.log('TitleBar: 检查 preloadTest 是否存在:', !!window.preloadTest);

    if (window.preloadTest) {
      console.log('TitleBar: 调用预加载测试函数:', window.preloadTest.test());
    }

    // 列出所有可用的 electronAPI 方法
    if (window.electronAPI) {
      console.log('TitleBar: 可用的 electronAPI 方法:', Object.keys(window.electronAPI));
    }

    if (window.electronAPI) {
      // 监听窗口最大化状态变化
      console.log('TitleBar: 设置窗口最大化状态变化监听器');
      const cleanup = window.electronAPI.onMaximizeChange((maximized) => {
        console.log('TitleBar: 收到窗口状态变化事件:', maximized);
        setIsMaximized(maximized);
        // 同时更新 app-wrapper 的状态
        const appWrapper = document.querySelector('.app-wrapper');
        if (appWrapper) {
          console.log('TitleBar: 更新 app-wrapper 数据属性:', maximized);
          appWrapper.setAttribute('data-maximized', maximized);
        } else {
          console.warn('TitleBar: 找不到 app-wrapper 元素');
        }
      });

      // 初始化时检查窗口状态
      if (window.electronAPI.isWindowMaximized) {
        console.log('TitleBar: 初始化时检查窗口最大化状态');
        window.electronAPI.isWindowMaximized()
          .then(maximized => {
            console.log('TitleBar: 初始窗口最大化状态:', maximized);
            setIsMaximized(maximized);
            const appWrapper = document.querySelector('.app-wrapper');
            if (appWrapper) {
              console.log('TitleBar: 初始化时更新 app-wrapper 数据属性:', maximized);
              appWrapper.setAttribute('data-maximized', maximized);
            } else {
              console.warn('TitleBar: 初始化时找不到 app-wrapper 元素');
            }
          })
          .catch(err => console.error('TitleBar: 检查窗口状态失败:', err));
      } else {
        console.warn('TitleBar: window.electronAPI.isWindowMaximized 方法不存在');
      }

      return cleanup;
    } else {
      console.warn('TitleBar: window.electronAPI 不存在，可能不是在 Electron 环境中运行');
    }
  }, [isElectronEnv]);

  const handleMinimize = async () => {
    console.log('TitleBar: 点击最小化按钮');
    try {
      if (window.electronAPI?.minimizeWindow) {
        console.log('TitleBar: 调用 electronAPI.minimizeWindow');
        await window.electronAPI.minimizeWindow();
        console.log('TitleBar: minimizeWindow 调用成功');
      } else {
        console.warn('TitleBar: window.electronAPI.minimizeWindow 方法不存在');
      }
    } catch (error) {
      console.error('TitleBar: 最小化窗口失败:', error);
    }
  };

  const handleMaximize = async () => {
    console.log('TitleBar: 点击最大化/还原按钮, 当前状态:', isMaximized);
    try {
      // 根据当前状态决定执行什么操作
      if (isMaximized) {
        console.log('TitleBar: 当前窗口已全屏，执行退出全屏操作');
        lastActionRef.current = 'exitFullscreen';
      } else {
        console.log('TitleBar: 当前窗口未全屏，执行全屏操作');
        lastActionRef.current = 'enterFullscreen';
      }

      if (window.electronAPI?.maximizeWindow) {
        console.log('TitleBar: 调用 electronAPI.maximizeWindow');
        const newState = await window.electronAPI.maximizeWindow();
        console.log('TitleBar: maximizeWindow 调用成功，返回状态:', newState);

        // 强制更新状态，以防事件没有触发
        console.log('TitleBar: 更新组件状态:', newState);
        setIsMaximized(newState);
        const appWrapper = document.querySelector('.app-wrapper');
        if (appWrapper) {
          console.log('TitleBar: 更新 app-wrapper 数据属性:', newState);
          appWrapper.setAttribute('data-maximized', newState);
        } else {
          console.warn('TitleBar: 找不到 app-wrapper 元素');
        }
      } else {
        console.warn('TitleBar: window.electronAPI.maximizeWindow 方法不存在');
      }
    } catch (error) {
      console.error('TitleBar: 切换全屏失败:', error);
    }
  };

  const handleClose = async () => {
    console.log('TitleBar: 点击关闭按钮');
    try {
      if (window.electronAPI?.closeWindow) {
        console.log('TitleBar: 调用 electronAPI.closeWindow');
        await window.electronAPI.closeWindow();
        console.log('TitleBar: closeWindow 调用成功');
      } else {
        console.warn('TitleBar: window.electronAPI.closeWindow 方法不存在');
      }
    } catch (error) {
      console.error('TitleBar: 关闭窗口失败:', error);
    }
  };

  console.log('TitleBar: 渲染组件，当前全屏状态:', isMaximized);

  // 在 Web 环境中不显示 TitleBar
  if (!isElectronEnv) {
    console.log('TitleBar: 在 Web 环境中不显示 TitleBar');
    return null;
  }

  return (
    <div className="title-bar" data-maximized={isMaximized}>
      <div className="title-logo-container">
        <img
          src={simxrdLogo}
          alt="SimXRD Logo"
          className="title-logo"
        />
      </div>
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