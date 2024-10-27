import React from 'react';

const ToolBar = ({ onSpeedChange, currentSpeed, onGenerate }) => {
  const handleSpeedChange = (e) => {
    const newSpeed = Number(e.target.value);
    onSpeedChange(newSpeed);
  };

  return (
    <div className="tool-bar bg-light p-2 rounded position-absolute" style={{ bottom: '20px', right: '20px', width: '150px' }}>
      <button className="btn btn-success w-100 mb-2" onClick={onGenerate}>一键生成</button>
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
