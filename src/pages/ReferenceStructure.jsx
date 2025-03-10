import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './ReferenceStructure.css';
import CrystalStructureDisplay from '../components/CrystalStructureDisplay';
import { FaCubes } from 'react-icons/fa';

const ReferenceStructure = () => {
  const [selectedStructure, setSelectedStructure] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isElectron, setIsElectron] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // 使用 useMemo 包装 modelOptions
  const modelOptions = useMemo(() => ({
    FAU: {
      path: 'FAU.xyz',
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
      path: 'LTA.xyz',
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
      path: 'SOD.xyz',
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
    }
  }), []); // 空依赖数组，因为这些数据是静态的

  // 使用 useCallback 包装 handleStructureSelect 函数
  const handleStructureSelect = useCallback((structure) => {
    setErrorMessage(''); // 清除之前的错误
    setSelectedStructure(structure);
    setSelectedFile(modelOptions[structure].path);
  }, [modelOptions]);

  useEffect(() => {
    // 检测是否在 Electron 环境中
    setIsElectron(window.electron !== undefined);
  }, []);  // 移除 handleStructureSelect 和 selectedStructure 依赖

  return (
    <div className="reference-structure-page">
      <div className="container-fluid h-100">
        <div className="row h-100">
          {/* 左侧信息栏 - 设置高度100%并添加滚动 */}
          <div className="col-md-4 h-100">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">晶体信息</h5>
              </div>
              <div className="card-body" style={{ overflowY: 'auto' }}>
                {selectedStructure ? (
                  <>
                    <h6 className="text-primary mb-2 fw-normal">简要信息</h6>
                    <p className="small text-muted mb-2">{modelOptions[selectedStructure].description}</p>
                    <ul className="list-unstyled small">
                      {modelOptions[selectedStructure].features.map((feature, index) => (
                        <li key={index} className="mb-1 text-secondary">• {feature}</li>
                      ))}
                    </ul>

                    {/* 详细信息表格 */}
                    <h6 className="text-primary mb-2 mt-4 fw-normal">详细信息</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <th style={{ width: '30%' }} className="text-secondary">晶系</th>
                          <td>{modelOptions[selectedStructure].detailedInfo.crystalSystem}</td>
                        </tr>
                        <tr>
                          <th className="text-secondary">空间群</th>
                          <td>{modelOptions[selectedStructure].detailedInfo.spaceGroup}</td>
                        </tr>
                        <tr>
                          <th className="text-secondary">晶胞参数</th>
                          <td>{modelOptions[selectedStructure].detailedInfo.cellParameters}</td>
                        </tr>
                        <tr>
                          <th className="text-secondary">框架密度</th>
                          <td>{modelOptions[selectedStructure].detailedInfo.frameworkDensity}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* 结构特征表格 */}
                    <h6 className="text-primary mb-2 mt-4 fw-normal">结构特征</h6>
                    <table className="table table-sm">
                      <tbody>
                        <tr>
                          <th style={{ width: '30%' }} className="text-secondary">骨架结构</th>
                          <td>{modelOptions[selectedStructure].detailedInfo.framework}</td>
                        </tr>
                        <tr>
                          <th className="text-secondary">孔径尺寸</th>
                          <td>{modelOptions[selectedStructure].detailedInfo.poreSize}</td>
                        </tr>
                        {modelOptions[selectedStructure].detailedInfo.supercage && (
                          <tr>
                            <th className="text-secondary">超笼尺寸</th>
                            <td>{modelOptions[selectedStructure].detailedInfo.supercage}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>

                    <h6 className="text-primary mb-2 mt-4 fw-normal">化学组成</h6>
                    <p className="small">{modelOptions[selectedStructure].detailedInfo.composition}</p>

                    <h6 className="text-primary mb-2 mt-4 fw-normal">主要应用</h6>
                    <p className="small">{modelOptions[selectedStructure].detailedInfo.applications}</p>
                  </>
                ) : (
                  <div className="text-center text-muted">
                    <p>请选择一个晶体结构查看详细信息</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧内容区域 - 使用flex布局控制高度 */}
          <div className="col-md-8 h-100">
            <div className="d-flex flex-column h-100">
              {/* 右上方横向结构选择栏 */}
              <div className="card mb-3">
                <div className="card-body py-2">
                  <div className="d-flex gap-2">
                    {Object.keys(modelOptions).map((structure) => (
                      <button
                        key={structure}
                        className={`btn ${selectedStructure === structure
                          ? 'btn-primary'
                          : 'btn-outline-primary'
                          }`}
                        onClick={() => handleStructureSelect(structure)}
                      >
                        {structure}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 右下方渲染区域 - 占据剩余空间 */}
              <div className="card flex-grow-1">
                <div className="card-body p-0 h-100">
                  {selectedStructure ? (
                    <div className="h-100" style={{ position: 'relative' }}>
                      {errorMessage && (
                        <div className="alert alert-danger m-3">
                          {errorMessage}
                        </div>
                      )}
                      <CrystalStructureDisplay
                        filePath={selectedFile}
                        modelName={selectedStructure}
                      />
                    </div>
                  ) : (
                    <div className="d-flex flex-column align-items-center justify-content-center h-100 p-4">
                      <div className="mb-4">
                        <FaCubes size={64} className="text-muted" />
                      </div>
                      <h4 className="text-muted mb-3">请选择晶体结构</h4>
                      <p className="text-muted">
                        从上方选择一个晶体结构以查看3D模型
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceStructure;
