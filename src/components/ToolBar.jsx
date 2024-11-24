import React from 'react';

const ToolBar = ({ onSpeedChange, currentSpeed, onGenerate }) => {
  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    onSpeedChange(newSpeed);
  };

  return (
    <div
      className="tool-bar bg-light p-2 rounded position-absolute"
      style={{
        top: '40px',
        right: '20px',
        width: '150px',
        opacity: 0.9, // 增加透明度
        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
        transformOrigin: 'top right', // 设置展开动画起点
        transition: 'all 0.3s ease', // 添加平滑的展开动画
      }}
    >
      <button className="btn btn-success w-100 mb-2" onClick={onGenerate}>
        一键生成
      </button>
      <div className="speed-control">
        <label htmlFor="speed-range">加速倍率: {currentSpeed}x</label>
        <input
          type="range"
          id="speed-range"
          className="form-range"
          min="1"
          max="16"
          value={currentSpeed}
          onChange={handleSpeedChange}
        />
      </div>
    </div>
  );
};

export default ToolBar;
