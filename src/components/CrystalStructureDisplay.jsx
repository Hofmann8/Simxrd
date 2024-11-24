import React, { useState, useRef, useEffect } from 'react';
import { FaCubes, FaRulerCombined, FaVectorSquare } from 'react-icons/fa';
import CrystalStructureViewer from './CrystalStructureViewer';

const CrystalStructureDisplay = ({ filePath, modelName }) => {
  const viewerStateRef = useRef({}); // 存储模型的角度和缩放状态
  const [displayOptions, setDisplayOptions] = useState({
    frameworkStyle: 'wireframe', // 默认显示风格
    depthFading: 'none',
    axes: false,
  });

  // 重置工具栏状态
  useEffect(() => {
    setDisplayOptions({
      frameworkStyle: 'wireframe',
      depthFading: 'none',
      axes: false,
    });
  }, [filePath]);

  const handleOptionChange = (option, value) => {
    setDisplayOptions((prev) => ({
      ...prev,
      [option]: value,
    }));
  };

  const saveViewerState = (state) => {
    viewerStateRef.current = state; // 保存当前的显示状态
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', margin: '20px 0' }}>
      {/* Viewer 区域 */}
      <div
        style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          width: '600px',
          height: '600px',
        }}
      >
        <CrystalStructureViewer
          filePath={filePath}
          displayOptions={displayOptions}
          saveViewerState={saveViewerState} // 将保存状态的函数传递给 Viewer
          savedState={viewerStateRef.current} // 传递已保存的状态
        />
      </div>

      {/* 工具栏区域 */}
      <div
        style={{
          width: '300px',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
      >
        <h4 style={{ textAlign: 'center', marginBottom: '1rem', color: '#333', fontWeight: 'bold' }}>显示选项</h4>

        <div>
          <h5 style={{ color: '#555', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            <FaCubes style={{ marginRight: '5px', color: '#007bff' }} /> 框架显示
          </h5>
          <select
            value={displayOptions.frameworkStyle}
            onChange={(e) => handleOptionChange('frameworkStyle', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginBottom: '1rem',
            }}
          >
            <option value="wireframe">线框模式</option>
            <option value="stick">棒状模式</option>
            <option value="ballStick">球棒模型</option>
          </select>
        </div>

        <div>
          <h5 style={{ color: '#555', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            <FaRulerCombined style={{ marginRight: '5px', color: '#007bff' }} /> 深度渐变
          </h5>
          <select
            value={displayOptions.depthFading}
            onChange={(e) => handleOptionChange('depthFading', e.target.value)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginBottom: '1rem',
            }}
          >
            <option value="none">无</option>
            <option value="light">浅</option>
            <option value="medium">中</option>
            <option value="strong">强</option>
          </select>
        </div>

        <div>
          <h5 style={{ color: '#555', fontWeight: 'bold', marginBottom: '0.5rem' }}>
            <FaVectorSquare style={{ marginRight: '5px', color: '#007bff' }} /> 坐标轴
          </h5>
          <button
            onClick={() => handleOptionChange('axes', !displayOptions.axes)}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: displayOptions.axes ? '#007bff' : '#f0f0f0',
              color: displayOptions.axes ? '#fff' : '#333',
              borderRadius: '5px',
              border: '1px solid #ccc',
              cursor: 'pointer',
            }}
          >
            {displayOptions.axes ? '隐藏坐标轴' : '显示坐标轴'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CrystalStructureDisplay;
