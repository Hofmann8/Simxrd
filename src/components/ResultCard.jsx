import React, { useState } from 'react';
import XRDChart from './XRDChart';
import ToolBar from './ToolBar';

const ResultCard = ({ resultData }) => {
  const [speed, setSpeed] = useState(1); // 默认速度设为1x
  const [isInstantGenerate, setIsInstantGenerate] = useState(false); // 控制一键生成

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed); // 更新速度
    setIsInstantGenerate(false); // 确保非一键生成状态
  };

  const handleGenerate = () => {
    setIsInstantGenerate(true); // 激活一键生成
  };

  return (
    <div className="card shadow-lg p-3 mb-5 bg-white rounded">
      <div className="card-body">
        <img src={resultData.img} alt="XRD Match" className="img-fluid" />
        
        {/* 传递 speed, isInstantGenerate 和 resultData.data 到 XRDChart */}
        <XRDChart data={resultData.data} speed={speed} instantGenerate={isInstantGenerate} />

        {/* 传递速度控制和一键生成到 ToolBar */}
        <ToolBar onSpeedChange={handleSpeedChange} currentSpeed={speed} onGenerate={handleGenerate} />
        
        <p className="card-text">{resultData.source}</p>
        <p className="card-text">{resultData.result}</p>
      </div>
    </div>
  );
};

export default ResultCard;
