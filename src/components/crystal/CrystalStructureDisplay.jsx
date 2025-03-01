import React, { useState, useRef, useEffect } from 'react';
import ToolsPanel from './ToolsPanel';
import ViewerPanel from './ViewerPanel';
import InfoPanel from './InfoPanel';
import { crystalContainerStyles } from './styles';

const CrystalStructureDisplay = ({ filePath }) => {
  // JSmol 实例引用
  const jsmolRef = useRef(null);

  // 状态管理
  const [isSpinning, setIsSpinning] = useState(true);
  const [displayStyle, setDisplayStyle] = useState('ball-stick');
  const [showUnitCell, setShowUnitCell] = useState(false);
  const [showLabels, setShowLabels] = useState(false);
  const [modelIndex, setModelIndex] = useState(0);
  const [atomCount, setAtomCount] = useState(0);
  const [bondCount, setBondCount] = useState(0);
  const [structureInfo, setStructureInfo] = useState({
    type: '分子筛',
    spaceGroup: 'Fd-3m',
    cellParams: 'a = b = c = 24.3 Å',
    cellAngles: 'α = β = γ = 90°',
    siAlRatio: '2.0',
    poreSize: '7.4 Å',
    surfaceArea: '730 m²/g',
    applications: '催化裂化、吸附分离'
  });

  // 加载结构信息
  useEffect(() => {
    if (!filePath) return;

    // 从文件名中提取结构类型
    const structureType = filePath.split('/').pop().split('.')[0];

    // 加载结构数据
    fetch('/data.json')
      .then(response => response.json())
      .then(data => {
        const structureData = data.structures.find(s => s.id === structureType);
        if (structureData) {
          setStructureInfo({
            type: structureData.name || '分子筛',
            spaceGroup: structureData.spaceGroup || 'Fd-3m',
            cellParams: structureData.cellParams || 'a = b = c = 24.3 Å',
            cellAngles: structureData.cellAngles || 'α = β = γ = 90°',
            siAlRatio: structureData.siAlRatio || '2.0',
            poreSize: structureData.poreSize || '7.4 Å',
            surfaceArea: structureData.surfaceArea || '730 m²/g',
            applications: structureData.applications || '催化裂化、吸附分离'
          });
        }
      })
      .catch(error => {
        console.error('加载结构数据时出错:', error);
      });
  }, [filePath]);

  // 执行 JSmol 脚本并处理错误
  const executeScript = (script) => {
    if (!jsmolRef.current) return;

    try {
      window.Jmol.script(jsmolRef.current, script);
      return true;
    } catch (error) {
      console.error('执行JSmol脚本时出错:', error, script);
      return false;
    }
  };

  // 获取 JSmol 变量值
  const getJmolValue = (variable) => {
    if (!jsmolRef.current) return null;

    try {
      return window.Jmol.evaluateVar(jsmolRef.current, variable);
    } catch (error) {
      console.error('获取JSmol变量时出错:', error, variable);
      return null;
    }
  };

  // 更新原子和键的计数
  const updateCounts = () => {
    if (!jsmolRef.current) return;

    // 使用 JSmol 的 evaluateVar 方法获取原子和键的数量
    const atomCountValue = getJmolValue('({*}).length');
    const bondCountValue = getJmolValue('({*}.bonds.length)');

    if (atomCountValue !== null) setAtomCount(atomCountValue);
    if (bondCountValue !== null) setBondCount(bondCountValue);
  };

  // 处理旋转控制
  const handleSpin = () => {
    const newSpinState = !isSpinning;
    if (executeScript(newSpinState ? 'spin on' : 'spin off')) {
      setIsSpinning(newSpinState);
    }
  };

  // 处理视图重置
  const handleReset = () => {
    executeScript('reset rotation');
    executeScript('center');
    if (isSpinning) executeScript('spin on');
  };

  // 处理显示样式变更
  const handleStyleChange = (style, jsmolCmd) => {
    if (displayStyle === style) return;

    // 先停止旋转，减少渲染负担
    const wasSpinning = isSpinning;
    if (wasSpinning) executeScript('spin off');

    // 应用新样式
    if (executeScript(jsmolCmd)) {
      setDisplayStyle(style);

      // 恢复旋转状态
      if (wasSpinning) {
        setTimeout(() => executeScript('spin on'), 100);
      }
    }
  };

  // 处理单元格显示
  const handleUnitCell = () => {
    const newUnitCellState = !showUnitCell;
    if (executeScript(newUnitCellState ? 'unitcell on; unitcell 0.1;' : 'unitcell off')) {
      setShowUnitCell(newUnitCellState);
    }
  };

  // 处理标签显示
  const handleLabels = () => {
    const newLabelsState = !showLabels;
    if (executeScript(newLabelsState ? 'select all; label %a' : 'label off')) {
      setShowLabels(newLabelsState);
    }
  };

  // 处理导出
  const handleExport = (format) => {
    switch (format) {
      case 'png':
        executeScript('write IMAGE 1200 900 PNG "crystal.png"');
        break;
      case 'jpg':
        executeScript('write IMAGE 1200 900 JPG "crystal.jpg"');
        break;
      case 'xyz':
        executeScript('write XYZ "crystal.xyz"');
        break;
      case 'mol':
        executeScript('write MOL "crystal.mol"');
        break;
      default:
        console.error('不支持的导出格式:', format);
    }
  };

  // 处理模型变更 - 使用直接加载文件内容的方式
  const handleModelChange = (index) => {
    if (modelIndex === index || !jsmolRef.current) return;

    // 先停止旋转，减少渲染负担
    const wasSpinning = isSpinning;
    if (wasSpinning) executeScript('spin off');

    // 根据索引确定模型路径
    let modelPath = '';
    switch (index) {
      case 0:
        modelPath = '/xyz_data/FAU.xyz';
        break;
      case 1:
        modelPath = '/xyz_data/LTA.xyz';
        break;
      case 2:
        modelPath = '/xyz_data/SOD.xyz';
        break;
      default:
        modelPath = '/xyz_data/FAU.xyz';
    }

    // 加载新模型 - 先获取文件内容再加载
    fetch(modelPath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`无法加载文件: ${modelPath}`);
        }
        return response.text();
      })
      .then(fileData => {
        console.log(`${modelPath} 加载成功，长度:`, fileData.length);

        // 使用文件内容加载模型
        if (executeScript(`data "model"\n${fileData}\nend "model"; center`)) {
          setModelIndex(index);

          // 应用当前显示样式
          const currentStyle = displayStyles.find(s => s.id === displayStyle);
          if (currentStyle) executeScript(currentStyle.jsmolCmd);

          // 应用其他设置
          if (showUnitCell) executeScript('unitcell on; unitcell 0.1;');
          if (showLabels) executeScript('select all; label %a');

          // 恢复旋转状态
          if (wasSpinning) {
            setTimeout(() => executeScript('spin on'), 300);
          }

          // 延迟更新计数
          setTimeout(updateCounts, 500);
        }
      })
      .catch(error => {
        console.error("加载模型失败:", error);
        // 恢复旋转状态
        if (wasSpinning) {
          executeScript('spin on');
        }
      });
  };

  // JSmol 支持的显示样式
  const displayStyles = [
    { id: 'ball-stick', name: '球棍模型', jsmolCmd: 'wireframe 0.15; spacefill 23%' },
    { id: 'spacefill', name: '空间填充', jsmolCmd: 'wireframe off; spacefill 100%' },
    { id: 'wireframe', name: '线框模型', jsmolCmd: 'wireframe 0.15; spacefill off' },
    { id: 'stick', name: '棍状模型', jsmolCmd: 'wireframe 0.3; spacefill off' }
  ];

  // 高级功能：测量距离
  const handleMeasureDistance = () => {
    executeScript('set picking MEASURE DISTANCE');
    executeScript('set pickingStyle MEASURE ON');
    executeScript('set measurements angstroms');
  };

  // 高级功能：测量角度
  const handleMeasureAngle = () => {
    executeScript('set picking MEASURE ANGLE');
    executeScript('set pickingStyle MEASURE ON');
  };

  // 高级功能：清除测量
  const handleClearMeasurements = () => {
    executeScript('measures delete');
    executeScript('set picking OFF');
  };

  // 高级功能：显示静电势
  const handleShowElectrostatic = () => {
    executeScript('isosurface vdw map mep');
  };

  // 高级功能：隐藏表面
  const handleHideSurface = () => {
    executeScript('isosurface off');
  };

  return (
    <div className="crystal-container" style={crystalContainerStyles.container}>
      <ToolsPanel
        displayStyle={displayStyle}
        showUnitCell={showUnitCell}
        showLabels={showLabels}
        handleStyleChange={handleStyleChange}
        handleUnitCell={handleUnitCell}
        handleLabels={handleLabels}
        handleExport={handleExport}
        modelIndex={modelIndex}
        handleModelChange={handleModelChange}
        handleMeasureDistance={handleMeasureDistance}
        handleMeasureAngle={handleMeasureAngle}
        handleClearMeasurements={handleClearMeasurements}
        handleShowElectrostatic={handleShowElectrostatic}
        handleHideSurface={handleHideSurface}
      />

      <ViewerPanel
        filePath={filePath}
        jsmolRef={jsmolRef}
        isSpinning={isSpinning}
        handleSpin={handleSpin}
        handleReset={handleReset}
        updateCounts={updateCounts}
      />

      <InfoPanel
        structureInfo={structureInfo}
        atomCount={atomCount}
        bondCount={bondCount}
      />
    </div>
  );
};

export default CrystalStructureDisplay; 