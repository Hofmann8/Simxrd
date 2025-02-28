import React from 'react';
import { FaPlay, FaPause, FaRedo, FaCog } from 'react-icons/fa';

const ToolBar = ({ onSpeedChange, currentSpeed, onGenerate, onPause, isPaused, onReset }) => {
  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    onSpeedChange(newSpeed);
  };

  const buttonStyle = {
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    fontSize: '14px'
  };

  const smallButtonStyle = {
    ...buttonStyle,
    width: '80px',
  };

  const largeButtonStyle = {
    ...buttonStyle,
    width: '168px',  // 两个小按钮的宽度加间距
  };

  return (
    <div className="tool-bar bg-light p-3 rounded shadow-sm">
      <div className="d-flex flex-column gap-2">
        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-outline-primary"
            onClick={onPause}
            title={isPaused ? "继续" : "暂停"}
            style={smallButtonStyle}
          >
            {isPaused ? <FaPlay size={12} /> : <FaPause size={12} />}
            {isPaused ? "继续" : "暂停"}
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={onReset}
            title="重置"
            style={smallButtonStyle}
          >
            <FaRedo size={12} /> 重置
          </button>
        </div>
        <button 
          className="btn btn-success w-100"
          onClick={onGenerate}
          title="一键生成"
          style={largeButtonStyle}
        >
          <FaCog size={12} /> 一键生成
        </button>
      </div>
      
      <div className="speed-control mt-3">
        <label className="form-label d-flex justify-content-between align-items-center">
          <span>模拟速度</span>
          <span className="badge bg-primary rounded-pill">{currentSpeed}x</span>
        </label>
        <input
          type="range"
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
