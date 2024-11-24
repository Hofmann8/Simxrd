import React, { useState } from 'react';
import CrystalStructureDisplay from '../components/CrystalStructureDisplay';

const ReferenceStructure = () => {
  const [selectedModel, setSelectedModel] = useState(null);

  // 模型对应的文件路径
  const modelOptions = {
    FAU: '/xyz_data/FAU.xyz',
    LTA: '/xyz_data/LTA.xyz',
    SOD: '/xyz_data/SOD.xyz',
  };

  const handleModelSelection = (model) => {
    setSelectedModel(model);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>参考晶体结构</h2>
      <p style={{ textAlign: 'center' }}>遗留bug（解决后会删除）：每次更改模型后，后台实际加载准备工作慢于优化后的显示速度，导致模型切换后过一段时间会有DOM更新导致react渲染变化导致窗口小跳</p>

      {/* 按钮选择区域 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1rem' }}>
        {Object.keys(modelOptions).map((model) => (
          <button
            key={model}
            onClick={() => handleModelSelection(model)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedModel === model ? '#007bff' : '#f0f0f0',
              color: selectedModel === model ? '#fff' : '#333',
              border: '1px solid #ddd',
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
          >
            {model}
          </button>
        ))}
      </div>

      {/* 显示选中模型或提示信息 */}
      {selectedModel ? (
        <CrystalStructureDisplay
          filePath={modelOptions[selectedModel]} // 动态传递文件路径
          modelName={selectedModel} // 动态传递模型名称
        />
      ) : (
        <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#555' }}>
          请选择一个模型以加载结构。
        </p>
      )}
    </div>
  );
};

export default ReferenceStructure;
