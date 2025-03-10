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
      path: '/FAU.xyz',
      description: '沸石分子筛FAU结构',
      features: [
        '大孔道系统',
        '三维孔道结构',
        '高稳定性'
      ],
      detailedInfo: {
        crystalSystem: '立方晶系',
        spaceGroup: 'Fd-3m',
        cellParameters: 'a = 24.345 Å',
        frameworkDensity: '12.7 T/1000 Å³'
      }
    },
    LTA: {
      path: '/LTA.xyz',
      description: '沸石分子筛LTA结构',
      features: [
        'α笼和β笼结构',
        '三维孔道系统',
        '高选择性'
      ],
      detailedInfo: {
        crystalSystem: '立方晶系',
        spaceGroup: 'Fm-3c',
        cellParameters: 'a = 24.555 Å',
        frameworkDensity: '14.2 T/1000 Å³'
      }
    },
    SOD: {
      path: '/SOD.xyz',
      description: '沸石分子筛SOD结构',
      features: [
        '六方晶系',
        'β笼基本结构单元',
        '高度对称性'
      ],
      detailedInfo: {
        crystalSystem: '立方晶系',
        spaceGroup: 'Im-3m',
        cellParameters: 'a = 8.965 Å',
        frameworkDensity: '16.7 T/1000 Å³'
      }
    }
  }), []); // 空依赖数组，因为这些数据是静态的

  // 使用 useCallback 包装 handleStructureSelect 函数
  const handleStructureSelect = useCallback((structure) => {
    setErrorMessage(''); // 清除之前的错误

    // 在 Electron 环境中检查文件是否存在
    if (isElectron && window.electronAPI) {
      try {
        console.log(`检查文件是否存在: ${modelOptions[structure].path}`);

        // 异步检查文件是否存在
        window.electronAPI.fileExists(modelOptions[structure].path)
          .then(exists => {
            if (!exists) {
              console.error(`文件不存在: ${modelOptions[structure].path}`);
              setErrorMessage(`文件 ${modelOptions[structure].path} 不存在，请确保数据文件已正确安装。`);

              // 尝试使用getResourcePath获取资源路径
              if (window.electronAPI.getResourcePath) {
                const relativePath = modelOptions[structure].path.startsWith('/')
                  ? modelOptions[structure].path.substring(1)
                  : modelOptions[structure].path;

                window.electronAPI.getResourcePath(relativePath)
                  .then(resourcePath => {
                    console.log(`尝试使用资源路径: ${resourcePath}`);
                    if (resourcePath && window.electronAPI.fileExists(`file://${resourcePath}`)) {
                      console.log(`资源路径文件存在，设置选中结构`);
                      setSelectedStructure(structure);
                      // 确保路径不为null
                      setSelectedFile(`file://${resourcePath}`);
                      setErrorMessage('');
                    }
                  })
                  .catch(err => {
                    console.error(`获取资源路径失败: ${err}`);
                  });
              }
            } else {
              console.log(`文件存在，设置选中结构`);
              setSelectedStructure(structure);
              // 确保路径不为null
              setSelectedFile(modelOptions[structure].path);
            }
          })
          .catch(err => {
            console.error(`检查文件是否存在时出错: ${err}`);
            setErrorMessage(`检查文件时出错: ${err.message}`);
          });

        // 不立即设置选中结构，等待文件检查完成
        return;
      } catch (error) {
        console.error(`处理文件检查时出错: ${error}`);
      }
    }

    // 如果不在Electron环境中，或者文件检查出错，直接设置选中结构
    setSelectedStructure(structure);
    // 确保路径不为null
    setSelectedFile(modelOptions[structure].path);
  }, [isElectron, modelOptions]);

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
