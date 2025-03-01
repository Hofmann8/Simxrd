import React from 'react';
import { 
  FaCube, 
  FaTags, 
  FaDownload, 
  FaRuler, 
  FaRulerCombined, 
  FaEraser,
  FaBolt,
  FaEyeSlash
} from 'react-icons/fa';
import { toolsPanelStyles } from './styles';

const ToolsPanel = ({
  displayStyle,
  showUnitCell,
  showLabels,
  handleStyleChange,
  handleUnitCell,
  handleLabels,
  handleExport,
  modelIndex,
  handleModelChange,
  handleMeasureDistance,
  handleMeasureAngle,
  handleClearMeasurements,
  handleShowElectrostatic,
  handleHideSurface
}) => {
  // JSmol 支持的显示样式
  const displayStyles = [
    { id: 'ball-stick', name: '球棍模型', jsmolCmd: 'wireframe 0.15; spacefill 23%' },
    { id: 'spacefill', name: '空间填充', jsmolCmd: 'wireframe off; spacefill 100%' },
    { id: 'wireframe', name: '线框模型', jsmolCmd: 'wireframe 0.15; spacefill off' },
    { id: 'stick', name: '棍状模型', jsmolCmd: 'wireframe 0.3; spacefill off' }
  ];

  // 可用的结构模型
  const models = [
    { id: 0, name: 'FAU (Y型分子筛)' },
    { id: 1, name: 'LTA (A型分子筛)' },
    { id: 2, name: 'SOD (方钠石)' }
  ];

  // 导出格式
  const exportFormats = [
    { id: 'png', name: 'PNG图像' },
    { id: 'jpg', name: 'JPG图像' },
    { id: 'xyz', name: 'XYZ文件' },
    { id: 'mol', name: 'MOL文件' }
  ];

  return (
    <div className="tools-panel" style={toolsPanelStyles.panel}>
      <div className="tools-section" style={toolsPanelStyles.section}>
        <h3 style={toolsPanelStyles.sectionTitle}>显示样式</h3>
        <div className="style-options" style={toolsPanelStyles.optionsContainer}>
          {displayStyles.map(style => (
            <button
              key={style.id}
              className={`style-btn ${displayStyle === style.id ? 'active' : ''}`}
              style={
                displayStyle === style.id
                  ? toolsPanelStyles.activeOptionButton
                  : toolsPanelStyles.optionButton
              }
              onClick={() => handleStyleChange(style.id, style.jsmolCmd)}
              title={style.name}
            >
              {style.name}
            </button>
          ))}
        </div>
      </div>

      <div className="tools-section" style={toolsPanelStyles.section}>
        <h3 style={toolsPanelStyles.sectionTitle}>显示选项</h3>
        <div className="display-options" style={toolsPanelStyles.optionsContainer}>
          <button
            className={`option-btn ${showUnitCell ? 'active' : ''}`}
            style={
              showUnitCell
                ? toolsPanelStyles.activeOptionButton
                : toolsPanelStyles.optionButton
            }
            onClick={handleUnitCell}
            title="显示/隐藏单元格"
          >
            <FaCube style={toolsPanelStyles.icon} /> 显示单元格
          </button>
          <button
            className={`option-btn ${showLabels ? 'active' : ''}`}
            style={
              showLabels
                ? toolsPanelStyles.activeOptionButton
                : toolsPanelStyles.optionButton
            }
            onClick={handleLabels}
            title="显示/隐藏原子标签"
          >
            <FaTags style={toolsPanelStyles.icon} /> 显示标签
          </button>
        </div>
      </div>

      <div className="tools-section" style={toolsPanelStyles.section}>
        <h3 style={toolsPanelStyles.sectionTitle}>结构选择</h3>
        <div className="model-selector" style={toolsPanelStyles.optionsContainer}>
          <select
            value={modelIndex}
            onChange={(e) => handleModelChange(parseInt(e.target.value))}
            style={toolsPanelStyles.select}
            title="选择分子筛结构"
          >
            {models.map(model => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="tools-section" style={toolsPanelStyles.section}>
        <h3 style={toolsPanelStyles.sectionTitle}>测量工具</h3>
        <div className="measurement-options" style={toolsPanelStyles.optionsContainer}>
          <button
            className="measure-btn"
            style={toolsPanelStyles.optionButton}
            onClick={handleMeasureDistance}
            title="测量原子间距离"
          >
            <FaRuler style={toolsPanelStyles.icon} /> 测量距离
          </button>
          <button
            className="measure-btn"
            style={toolsPanelStyles.optionButton}
            onClick={handleMeasureAngle}
            title="测量原子间角度"
          >
            <FaRulerCombined style={toolsPanelStyles.icon} /> 测量角度
          </button>
          <button
            className="measure-btn"
            style={toolsPanelStyles.optionButton}
            onClick={handleClearMeasurements}
            title="清除所有测量"
          >
            <FaEraser style={toolsPanelStyles.icon} /> 清除测量
          </button>
        </div>
      </div>

      <div className="tools-section" style={toolsPanelStyles.section}>
        <h3 style={toolsPanelStyles.sectionTitle}>高级功能</h3>
        <div className="advanced-options" style={toolsPanelStyles.optionsContainer}>
          <button
            className="advanced-btn"
            style={toolsPanelStyles.optionButton}
            onClick={handleShowElectrostatic}
            title="显示静电势表面"
          >
            <FaBolt style={toolsPanelStyles.icon} /> 静电势
          </button>
          <button
            className="advanced-btn"
            style={toolsPanelStyles.optionButton}
            onClick={handleHideSurface}
            title="隐藏表面"
          >
            <FaEyeSlash style={toolsPanelStyles.icon} /> 隐藏表面
          </button>
        </div>
      </div>

      <div className="tools-section" style={toolsPanelStyles.section}>
        <h3 style={toolsPanelStyles.sectionTitle}>导出</h3>
        <div className="export-options" style={toolsPanelStyles.optionsContainer}>
          {exportFormats.map(format => (
            <button
              key={format.id}
              className="export-btn"
              style={toolsPanelStyles.optionButton}
              onClick={() => handleExport(format.id)}
              title={`导出为${format.name}`}
            >
              <FaDownload style={toolsPanelStyles.icon} /> {format.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPanel; 