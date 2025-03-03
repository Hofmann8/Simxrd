import React from 'react';
import { BsPlayFill, BsPauseFill, BsArrowCounterclockwise, BsLightningFill } from 'react-icons/bs';
import './ToolBar.css';

const ToolBar = ({ onSpeedChange, currentSpeed, onGenerate, onPause, isPaused, onReset }) => {
  return (
    <div className="toolbar-container">
      {/* 左侧速度控制 */}
      <div className="speed-control">
        <div className="speed-display">
          <span>{currentSpeed}x</span>
        </div>
        <div className="slider-container">
          <input
            type="range"
            className="custom-range"
            min="0.5"
            max="5"
            step="0.5"
            value={currentSpeed}
            onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          />
        </div>
      </div>

      {/* 右侧控制按钮 */}
      <div className="control-buttons">
        <button
          className={`control-btn ${isPaused ? 'active' : ''}`}
          onClick={onPause}
        >
          {isPaused ? <BsPlayFill size={18} /> : <BsPauseFill size={18} />}
        </button>
        <button
          className="control-btn"
          onClick={onReset}
        >
          <BsArrowCounterclockwise size={16} />
        </button>
        <button
          className="generate-btn"
          onClick={onGenerate}
        >
          <BsLightningFill size={14} />
          <span>一键生成</span>
        </button>
      </div>
    </div>
  );
};

export default ToolBar;
