import React, { useState, useRef, useEffect } from 'react';
import { FaCubes, FaRuler } from 'react-icons/fa';
import CrystalStructureViewer from './CrystalStructureViewer';

const CrystalStructureDisplay = ({ filePath, modelName }) => {
  const viewerStateRef = useRef({});
  const [displayOptions, setDisplayOptions] = useState({
    frameworkStyle: 'wireframe',
    showAxes: false,
  });

  // 重置工具栏状态
  useEffect(() => {
    setDisplayOptions({
      frameworkStyle: 'wireframe',
      showAxes: false,
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

  return (
    <div className="crystal-structure-container h-100">
      <div className="d-flex flex-column h-100">
        {/* 顶部控制面板 */}
        <div className="bg-light border-bottom p-3">
          <div className="row g-2">
            <div className="col-md-6">
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
              </select>
            </div>
            <div className="col-md-6">
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
