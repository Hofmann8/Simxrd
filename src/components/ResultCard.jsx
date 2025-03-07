import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import ToolBar from './ToolBar';
import { FaFileExport } from 'react-icons/fa';
import ExportModal from './ExportModal';
import './ResultCard.css';

const ResultCard = ({ resultData }) => {
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isGenerationComplete, setIsGenerationComplete] = useState(false);

  // 当 resultData 改变时重置状态
  useEffect(() => {
    setCurrentIndex(0);
    setIsPaused(false);
    setSpeed(1);
    setIsGenerationComplete(false);
  }, [resultData.source]);

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
    console.log('导出按钮被点击');
    setShowExportModal(true);
  };

  const handleCloseModal = () => {
    console.log('关闭模态框按钮被点击');
    setShowExportModal(false);
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

    const displayData = resultData.data.slice(0, currentIndex + 1);

    if (!displayData.every(point => '2THETA' in point && 'Cnt2_D1' in point)) {
      return {
        title: {
          text: '数据格式错误',
          left: 'center',
          top: 'center'
        }
      };
    }

    const currentXValues = displayData.map(point => point['2THETA']);
    const currentYValues = displayData.map(point => point['Cnt2_D1']);
    const minX = Math.min(...currentXValues);
    const maxX = Math.max(...currentXValues);
    const maxY = Math.max(...currentYValues);

    return {
      animation: false,
      backgroundColor: '#ffffff',
      grid: {
        top: 60,
        right: 40,
        bottom: 60,
        left: 70,
        containLabel: true
      },
      title: {
        text: 'XRD 衍射图谱',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 16,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        },
        formatter: function (params) {
          return `2θ: ${params[0].data[0].toFixed(2)}°<br/>强度: ${params[0].data[1].toFixed(2)}`;
        }
      },
      xAxis: {
        type: 'value',
        name: '2θ (°)',
        nameLocation: 'center',
        nameGap: 35,
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
        },
        axisLabel: {
          formatter: (value) => value.toFixed(2) + '°',
          margin: 12
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
    </div>
  );
};

export default ResultCard;
