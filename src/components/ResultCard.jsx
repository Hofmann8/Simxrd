import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import ToolBar from './ToolBar';
import { FaFileExport } from 'react-icons/fa';
import ExportModal from './ExportModal';
import LowMatchWarningModal from './LowMatchWarningModal';
import './ResultCard.css';

const ResultCard = ({ resultData }) => {
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);
  const [showLowMatchWarning, setShowLowMatchWarning] = useState(false);

  // 当 resultData 改变时重置状态
  useEffect(() => {
    setCurrentIndex(0);
    setIsPaused(false);
    setSpeed(1);
    setIsGenerationComplete(false);

    // 检查匹配度是否低于阈值 - 改进的检查逻辑
    if (resultData && typeof resultData.similarity === 'number') {
      // 使用明确的数值比较，并确保只有在有效数据时才显示警告
      if (resultData.similarity < 70) {
        console.log('显示低匹配度警告:', resultData.similarity);
        setShowLowMatchWarning(true);
      } else {
        setShowLowMatchWarning(false);
      }
    }
  }, [resultData]); // 移除特定依赖，改为监听整个resultData对象

  // 动画效果
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= resultData.data.length - 1) {
          clearInterval(timer);
          setIsPaused(true);
          setIsGenerationComplete(true);
          return prev;
        }
        return prev + 1;
      });
    }, 50 / speed); // 速度控制

    return () => clearInterval(timer);
  }, [resultData, speed, isPaused]);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPaused(false);
    setIsGenerationComplete(false);
  };

  const handleGenerate = () => {
    // 先暂停动画
    setIsPaused(true);
    // 使用 setTimeout 确保状态更新完成
    setTimeout(() => {
      setCurrentIndex(resultData.data.length - 1);
      setIsGenerationComplete(true);
    }, 0);
  };

  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const handleCloseModal = () => {
    setShowExportModal(false);
  };

  const handleCloseLowMatchWarning = () => {
    setShowLowMatchWarning(false);
  };

  const exportToCSV = () => {
    if (!resultData || !resultData.data) return;

    // 准备CSV数据
    const headers = ['2THETA', 'Cnt2_D1'];
    const csvContent = [
      headers.join(','),
      ...resultData.data.map(point => `${point['2THETA']},${point['Cnt2_D1']}`)
    ].join('\n');

    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // 创建下载链接
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `xrd_data_${new Date().getTime()}.csv`);
    document.body.appendChild(link);

    // 触发下载
    link.click();

    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 获取匹配度对应的样式 - 为了在 ResultCard 中显示匹配度标签
  const getMatchingStyle = (similarity) => {
    if (similarity >= 95) {
      return { className: "match-tag match-perfect", icon: "✓", text: "完全匹配" };
    } else if (similarity >= 85) {
      return { className: "match-tag match-high", icon: "★", text: "高度匹配" };
    } else if (similarity >= 70) {
      return { className: "match-tag match-partial", icon: "○", text: "部分匹配" };
    } else {
      return { className: "match-tag match-low", icon: "⚠", text: "低度匹配" };
    }
  };

  const getChartOptions = () => {
    // 验证数据
    if (!resultData?.data || !Array.isArray(resultData.data) || !resultData.data.length) {
      return {
        title: {
          text: '数据加载失败',
          left: 'center',
          top: 'center'
        }
      };
    }

    // 获取当前显示的数据
    const displayData = resultData.data.slice(0, currentIndex + 1);

    // 计算数据范围
    const xValues = displayData.map(item => item['2THETA']);
    const yValues = displayData.map(item => item['Cnt2_D1']);

    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const maxY = Math.max(...yValues);

    return {
      grid: {
        left: 60,
        right: 40,
        top: 60,
        bottom: 60
      },
      tooltip: {
        trigger: 'axis',
        formatter: function (params) {
          const data = params[0].data;
          return `2θ: ${data[0].toFixed(2)}°<br/>强度: ${data[1].toFixed(2)} cps`;
        },
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      xAxis: {
        type: 'value',
        name: '2θ (°)',
        nameLocation: 'center',
        nameGap: 30,
        min: minX,
        max: maxX,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E0E0E0',
            type: 'dashed'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: '强度 (cps)',
        nameLocation: 'center',
        nameGap: 45,
        min: 0,
        max: maxY * 1.1,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#E0E0E0',
            type: 'dashed'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#333'
          }
        },
        axisLabel: {
          formatter: function (value) {
            if (value >= 1000) {
              return `${(value / 1000).toFixed(2)}k`;
            }
            return value.toFixed(2);
          },
          margin: 12
        }
      },
      series: [{
        name: '衍射强度',
        type: 'line',
        sampling: 'lttb',
        showSymbol: false,
        clip: true,
        data: displayData.map(item => [item['2THETA'], item['Cnt2_D1']]),
        lineStyle: {
          width: 1.5,
          color: '#1890ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: 'rgba(24,144,255,0.25)'
            }, {
              offset: 1,
              color: 'rgba(24,144,255,0.05)'
            }]
          }
        },
        emphasis: {
          focus: 'series',
          blurScope: 'coordinateSystem'
        }
      }]
    };
  };

  return (
    <div className="d-flex flex-column h-100">
      {/* 顶部区域 */}
      <div className="border-bottom">
        {/* 标题和基本信息 */}
        <div className="d-flex justify-content-between align-items-center p-3">
          <div className="d-flex align-items-center gap-3">
            <h5 className="mb-0">XRD 模拟结果</h5>
            {resultData.similarity !== undefined && (
              <div className="d-flex align-items-center bg-light rounded px-3 py-2">
                <span className={`${getMatchingStyle(resultData.similarity).className} me-2`}>
                  {getMatchingStyle(resultData.similarity).icon}
                </span>
                <span className="text-muted">
                  匹配度: <strong>{resultData.similarity.toFixed(1)}%</strong>
                </span>
              </div>
            )}
          </div>

          {/* 导出按钮 */}
          <button
            className={`btn ${isGenerationComplete ? 'btn-primary' : 'btn-secondary'}`}
            onClick={handleExportClick}
            disabled={!isGenerationComplete}
          >
            <FaFileExport className="me-2" />
            导出结果
          </button>
        </div>

        {/* 工具栏 */}
        <div className="bg-light px-3 py-2 border-top">
          <ToolBar
            onSpeedChange={handleSpeedChange}
            currentSpeed={speed}
            onGenerate={handleGenerate}
            onPause={handlePause}
            isPaused={isPaused}
            onReset={handleReset}
          />
        </div>
      </div>

      {/* 主要内容区域 - 图表 */}
      <div className="flex-grow-1 p-3">
        <ReactECharts
          option={getChartOptions()}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
        />
      </div>

      {/* 使用独立的模态框组件 */}
      <ExportModal
        show={showExportModal}
        onClose={handleCloseModal}
        resultData={resultData}
        onExport={exportToCSV}
      />

      {/* 使用独立的低匹配度警告弹窗组件 */}
      <LowMatchWarningModal
        show={showLowMatchWarning}
        onClose={handleCloseLowMatchWarning}
        similarity={resultData.similarity || 0}
      />
    </div>
  );
};

export default ResultCard;
