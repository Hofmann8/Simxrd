import React, { useState, useEffect } from 'react';
import CrystalStructureDisplay from '../components/CrystalStructureDisplay';

const ReferenceStructure = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [isElectron, setIsElectron] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // 检测是否在 Electron 环境中
    setIsElectron(window.electron !== undefined);
  }, []);

  // 模型对应的文件路径
  const modelOptions = {
    FAU: '/xyz_data/FAU.xyz',
    LTA: '/xyz_data/LTA.xyz',
    SOD: '/xyz_data/SOD.xyz',
  };

  const handleModelSelection = (model) => {
    setErrorMessage(''); // 清除之前的错误
    
    // 在 Electron 环境中检查文件是否存在
    if (isElectron && window.electronAPI) {
      const fileExists = window.electronAPI.fileExists(modelOptions[model]);
      if (!fileExists) {
        setErrorMessage(`文件 ${modelOptions[model]} 不存在，请确保数据文件已正确安装。`);
        return;
      }
    }
    
    setSelectedModel(model);
  };

  return (
    <div className="reference-structure-container">
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>参考晶体结构</h2>
      
      {/* 模型选择按钮 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        {Object.keys(modelOptions).map((model) => (
          <button
            key={model}
            onClick={() => handleModelSelection(model)}
            style={{
              padding: '10px 20px',
              backgroundColor: selectedModel === model ? '#007bff' : '#f0f0f0',
              color: selectedModel === model ? '#fff' : '#333',
              border: '1px solid #ccc',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: selectedModel === model ? 'bold' : 'normal',
            }}
          >
            {model}
          </button>
        ))}
      </div>

      {/* 错误信息显示 */}
      {errorMessage && (
        <div style={{ 
          color: 'red', 
          textAlign: 'center', 
          padding: '10px', 
          margin: '10px 0', 
          backgroundColor: '#ffeeee', 
          borderRadius: '5px' 
        }}>
          {errorMessage}
        </div>
      )}

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
