import React, { useState, useEffect, useCallback } from 'react';
import CrystalStructureDisplay from '../components/CrystalStructureDisplay';
import { FaAtom, FaInfoCircle, FaCube } from 'react-icons/fa';

const ReferenceStructure = () => {
  const [selectedModel, setSelectedModel] = useState(null);
  const [isElectron, setIsElectron] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 模型对应的文件路径和基本信息
  const modelOptions = {
    FAU: {
      path: '/xyz_data/FAU.xyz',
      description: 'FAU型沸石是一种大孔沸石，具有三维孔道系统，常用于催化裂化和吸附分离。',
      features: ['大孔径: 7.4 Å', '硅铝比: 1.0-3.0', '空间群: Fd-3m', '单胞参数: a = 24.3 Å'],
      detailedInfo: {
        crystalSystem: '立方晶系',
        spaceGroup: 'Fd3m',
        cellParameters: 'a ≈ 24.7 Å（具体值会因钠型（NaX、NaY）和其它金属离子调控而有所差异）',
        framework: '由索达莱单元（sodalite cages）和连接它们的六方柱体构成',
        supercage: '超笼直径大约为12 Å左右',
        poreSize: '连接超笼的12元环孔口，开口直径大约在7.4 Å左右，这种大孔系统使其能够容纳较大分子',
        composition: '典型配方（以NaY为例）：约Na₅₆[Al₅₆Si₁₃₆O₃₈₄]，NaX的Si/Al比约1.2，NaY的Si/Al比可达2.5–3.0',
        frameworkDensity: '大致为13–14个T原子/1000 Å³',
        applications: '由于超大孔道适合大分子和重油裂解等催化反应'
      }
    },
    LTA: {
      path: '/xyz_data/LTA.xyz',
      description: 'LTA型沸石具有α笼和β笼结构，是一种重要的分子筛，广泛用于气体分离和离子交换。',
      features: ['孔径: 4.2 Å', '硅铝比: 1.0-2.0', '空间群: Pm-3m', '单胞参数: a = 11.9 Å'],
      detailedInfo: {
        crystalSystem: '立方晶系',
        spaceGroup: 'Pm3m',
        cellParameters: 'a ≈ 12.0～12.3 Å（以NaA型为代表，Si/Al=1）',
        framework: '以索达莱单元为基本构件，通过双四元环（D4R）连接形成规则的立方结构',
        poreSize: '孔口主要为8元环窗口，开口直径大约在4.1～4.3 Å左右',
        composition: 'Na₁₂[(AlO₂)₁₂(SiO₂)₁₂]·nH₂O',
        frameworkDensity: '大约在15–16个T原子/1000 Å³',
        applications: '非常适合分子筛分（例如气体分离和干燥）'
      }
    },
    SOD: {
      path: '/xyz_data/SOD.xyz',
      description: 'SOD型沸石是一种具有笼状结构的沸石，具有高热稳定性，常用于离子交换和催化反应。',
      features: ['孔径: 2.8 Å', '硅铝比: 1.0-3.0', '空间群: Im-3m', '单胞参数: a = 8.9 Å'],
      detailedInfo: {
        crystalSystem: '立方晶系',
        spaceGroup: 'P-43n（部分文献也有报道I-43m）',
        cellParameters: 'a ≈ 8.9～9.1 Å',
        framework: '整个结构均由索达莱单元构成，构成紧密而规则的笼状结构',
        poreSize: '孔口主要由六元环构成，直径大约在2.8～3.0 Å左右，限制了较大分子的进入',
        composition: '典型化学式如Na₈[Al₆Si₆O₂₄]Cl₂（或其它负载适当的阴离子）',
        frameworkDensity: '相对较高，通常在16个T原子/1000 Å³左右',
        applications: '小孔道限制了分子大小，多用于精细分离和特定催化反应'
      }
    },
  };

  // 使用 useCallback 包装 handleModelSelection 函数
  const handleModelSelection = useCallback((model) => {
    setErrorMessage(''); // 清除之前的错误

    // 在 Electron 环境中检查文件是否存在
    if (isElectron && window.electronAPI) {
      const fileExists = window.electronAPI.fileExists(modelOptions[model].path);
      if (!fileExists) {
        setErrorMessage(`文件 ${modelOptions[model].path} 不存在，请确保数据文件已正确安装。`);
        return;
      }
    }

    setSelectedModel(model);
  }, [isElectron, modelOptions]);

  useEffect(() => {
    // 检测是否在 Electron 环境中
    setIsElectron(window.electron !== undefined);

    // 默认选择 LTA 结构
    if (!selectedModel) {
      handleModelSelection('LTA');
    }
  }, [handleModelSelection, selectedModel]);

  return (
    <div className="container-fluid p-0">
      {/* 现代化标题栏 */}
      <div className="border-bottom shadow-sm py-2 px-3 d-flex align-items-center bg-white">
        <div className="d-flex align-items-center">
          <div className="me-3 d-flex align-items-center justify-content-center"
            style={{ width: '40px', height: '40px', backgroundColor: '#f0f7ff', borderRadius: '8px' }}>
            <FaCube size={20} className="text-primary" />
          </div>
          <h4 className="m-0 fw-normal text-dark">参考晶体结构</h4>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="row m-0" style={{ height: 'calc(100vh - 60px)' }}>
        {/* 左侧选择面板 */}
        <div className="col-md-2 p-0 border-end" style={{ height: '100%', backgroundColor: '#f8f9fa' }}>
          <div className="p-3 border-bottom">
            <h6 className="m-0 text-secondary">选择结构类型</h6>
          </div>
          <div className="list-group list-group-flush border-0">
            {Object.keys(modelOptions).map((model) => (
              <button
                key={model}
                className={`list-group-item list-group-item-action border-0 d-flex align-items-center ${selectedModel === model ? 'active bg-primary text-white' : 'bg-transparent'
                  }`}
                onClick={() => handleModelSelection(model)}
              >
                <FaAtom className="me-2" /> {model}
              </button>
            ))}
          </div>

          {selectedModel && (
            <div className="p-3">
              <h6 className="mb-2 text-secondary">简要信息</h6>
              <p className="small text-muted mb-2">{modelOptions[selectedModel].description}</p>
              <ul className="list-unstyled small">
                {modelOptions[selectedModel].features.map((feature, index) => (
                  <li key={index} className="mb-1 text-secondary">• {feature}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 中间详细信息面板 */}
        {selectedModel && (
          <div className="col-md-3 p-0 border-end bg-white" style={{ height: '100%', overflowY: 'auto' }}>
            <div className="p-3 border-bottom d-flex justify-content-between align-items-center">
              <h5 className="m-0 fw-normal">{selectedModel} 详细信息</h5>
              <FaInfoCircle className="text-primary" />
            </div>

            <div className="p-3">
              <h6 className="text-primary mb-2 fw-normal">基本晶体学参数</h6>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }} className="text-secondary">晶系</th>
                    <td>{modelOptions[selectedModel].detailedInfo.crystalSystem}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">空间群</th>
                    <td>{modelOptions[selectedModel].detailedInfo.spaceGroup}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">晶胞参数</th>
                    <td>{modelOptions[selectedModel].detailedInfo.cellParameters}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">框架密度</th>
                    <td>{modelOptions[selectedModel].detailedInfo.frameworkDensity}</td>
                  </tr>
                </tbody>
              </table>

              <h6 className="text-primary mb-2 mt-4 fw-normal">结构特征</h6>
              <table className="table table-sm">
                <tbody>
                  <tr>
                    <th style={{ width: '30%' }} className="text-secondary">骨架结构</th>
                    <td>{modelOptions[selectedModel].detailedInfo.framework}</td>
                  </tr>
                  <tr>
                    <th className="text-secondary">孔径尺寸</th>
                    <td>{modelOptions[selectedModel].detailedInfo.poreSize}</td>
                  </tr>
                  {modelOptions[selectedModel].detailedInfo.supercage && (
                    <tr>
                      <th className="text-secondary">超笼尺寸</th>
                      <td>{modelOptions[selectedModel].detailedInfo.supercage}</td>
                    </tr>
                  )}
                </tbody>
              </table>

              <h6 className="text-primary mb-2 mt-4 fw-normal">化学组成</h6>
              <p>{modelOptions[selectedModel].detailedInfo.composition}</p>

              <h6 className="text-primary mb-2 mt-4 fw-normal">主要应用</h6>
              <p>{modelOptions[selectedModel].detailedInfo.applications}</p>
            </div>
          </div>
        )}

        {/* 右侧 JSmol 显示区域 */}
        <div className={`col-md-${selectedModel ? '7' : '10'} p-0`} style={{ height: '100%' }}>
          {errorMessage && (
            <div className="alert alert-danger m-3">
              {errorMessage}
            </div>
          )}

          {selectedModel && (
            <CrystalStructureDisplay
              filePath={modelOptions[selectedModel].path}
              modelName={selectedModel}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferenceStructure;
