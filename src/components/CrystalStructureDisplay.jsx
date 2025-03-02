import React, { useState, useRef, useEffect } from 'react';
import {
  FaCubes,
  FaRuler,
  FaExpand,
  FaPalette,
  FaSync
} from 'react-icons/fa';
import CrystalStructureViewer from './CrystalStructureViewer';

const CrystalStructureDisplay = ({ filePath, modelName }) => {
  const viewerStateRef = useRef({});
  const [displayOptions, setDisplayOptions] = useState({
    frameworkStyle: 'wireframe',
    showAxes: false,
    backgroundColor: 'white',
    lighting: 'default',
    spinning: false
  });

  // 重置工具栏状态
  useEffect(() => {
    setDisplayOptions({
      frameworkStyle: 'wireframe',
      showAxes: false,
      backgroundColor: 'white',
      lighting: 'default',
      spinning: false
    });
  }, [filePath]);

  const handleOptionChange = (option, value) => {
    setDisplayOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const saveViewerState = (state) => {
    viewerStateRef.current = state;
  };

  const toggleSpinning = () => {
    const newSpinningState = !displayOptions.spinning;
    setDisplayOptions(prev => ({
      ...prev,
      spinning: newSpinningState
    }));

    if (window.jmolApplet0) {
      window.Jmol.script(window.jmolApplet0, newSpinningState ? 'spin on' : 'spin off');
    }
  };

  const toggleFullscreen = () => {
    const container = document.querySelector('.crystal-structure-container');
    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) { /* Safari */
        container.webkitRequestFullscreen();
      } else if (container.msRequestFullscreen) { /* IE11 */
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11 */
        document.msExitFullscreen();
      }
    }
  };

  return (
    <div className="crystal-structure-container h-100">
      <div className="d-flex flex-column h-100">
        {/* 顶部控制面板 */}
        <div className="bg-light border-bottom p-3">
          <div className="row g-2">
            <div className="col-md-3">
              <label className="form-label d-flex align-items-center mb-1">
                <FaCubes className="me-2 text-primary" /> 显示风格
              </label>
              <select
                value={displayOptions.frameworkStyle}
                onChange={(e) => handleOptionChange('frameworkStyle', e.target.value)}
                className="form-select form-select-sm"
              >
                <option value="wireframe">线框模式</option>
                <option value="ballStick">球棒模型</option>
                <option value="spacefill">空间填充</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label d-flex align-items-center mb-1">
                <FaRuler className="me-2 text-primary" /> 坐标轴
              </label>
              <button
                onClick={() => handleOptionChange('showAxes', !displayOptions.showAxes)}
                className={`btn btn-sm w-100 ${displayOptions.showAxes ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                {displayOptions.showAxes ? '隐藏坐标轴' : '显示坐标轴'}
              </button>
            </div>
            <div className="col-md-3">
              <label className="form-label d-flex align-items-center mb-1">
                <FaPalette className="me-2 text-primary" /> 背景颜色
              </label>
              <select
                value={displayOptions.backgroundColor}
                onChange={(e) => handleOptionChange('backgroundColor', e.target.value)}
                className="form-select form-select-sm"
              >
                <option value="white">白色</option>
                <option value="black">黑色</option>
                <option value="gray">灰色</option>
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label d-flex align-items-center mb-1">
                <FaSync className="me-2 text-primary" /> 自旋动画
              </label>
              <button
                onClick={toggleSpinning}
                className={`btn btn-sm w-100 ${displayOptions.spinning ? 'btn-primary' : 'btn-outline-secondary'}`}
              >
                {displayOptions.spinning ? '停止旋转' : '开始旋转'}
              </button>
            </div>
          </div>

          {/* 技术支持声明和全屏按钮 */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div className="text-muted small">
              <span>技术支持: <a href="http://jmol.sourceforge.net/" target="_blank" rel="noopener noreferrer" className="text-decoration-none">JSmol</a> 分子可视化引擎</span>
            </div>
            <button
              className="btn btn-sm btn-outline-secondary d-flex align-items-center"
              onClick={toggleFullscreen}
              title="全屏显示"
            >
              <FaExpand className="me-1" /> <span className="d-none d-md-inline">全屏</span>
            </button>
          </div>
        </div>

        {/* JSmol 查看器区域 */}
        <div className="flex-grow-1 position-relative">
          <CrystalStructureViewer
            filePath={filePath}
            displayOptions={displayOptions}
            saveViewerState={saveViewerState}
          />
        </div>
      </div>
    </div>
  );
};

export default CrystalStructureDisplay;
