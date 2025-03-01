import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import ToolBar from './ToolBar';
import { FaChevronDown, FaChevronUp, FaTools } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';
import './ResultCard.css';

const ResultCard = ({ resultData }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);  // 默认不展开工具栏
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // 当 resultData 改变时重置状态
  useEffect(() => {
    setCurrentIndex(0);
    setIsPaused(false);
    setSpeed(1);
  }, [resultData.source]); // 使用 source 作为依赖，因为它能唯一标识数据集

  // 动画效果
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= resultData.data.length - 1) {
          clearInterval(timer);
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
  };

  const handleGenerate = () => {
    // 先暂停动画
    setIsPaused(true);
    // 使用 setTimeout 确保状态更新完成
    setTimeout(() => {
      setCurrentIndex(resultData.data.length - 1);
    }, 0);
  };

  const getChartOptions = () => {
    // 验证数据
    if (!resultData?.data || !Array.isArray(resultData.data) || !resultData.data.length) {
      console.error('Invalid or empty data:', resultData);
      return {
        title: {
          text: '数据加载失败',
          left: 'center',
          top: 'center'
        }
      };
    }

    // 计算当前显示数据的范围
    const currentData = resultData.data.slice(0, currentIndex + 1);
    
    // 确保数据格式正确
    if (!currentData.every(point => '2THETA' in point && 'Cnt2_D1' in point)) {
      console.error('Invalid data format:', currentData);
      return {
        title: {
          text: '数据格式错误',
          left: 'center',
          top: 'center'
        }
      };
    }

    // 计算当前数据的范围，并添加一些边距
    const currentXValues = currentData.map(point => point['2THETA']);
    const minX = Math.max(5, Math.min(...currentXValues) - 2);
    const maxX = Math.min(50, Math.max(...currentXValues) + 2);
    
    // 计算Y轴范围
    const currentYValues = currentData.map(point => point['Cnt2_D1']);
    const maxY = Math.max(...currentYValues) * 1.1; // 留出10%的顶部空间

    // 计算最大值的位数来调整左边距
    const maxDigits = Math.floor(maxY).toString().length;
    const leftPadding = Math.max(70, 40 + maxDigits * 10); // 基础边距40，每位数字增加10px

    return {
      animation: false,
      grid: {
        top: 50,
        right: 60,
        bottom: 50,
        left: leftPadding,  // 动态调整左边距
        containLabel: true
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        },
        formatter: function(params) {
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
          lineStyle: { type: 'dashed' }
        },
        axisLabel: {
          margin: 12,
          formatter: (value) => value.toFixed(2)
        }
      },
      yAxis: {
        type: 'value',
        name: '强度',
        nameLocation: 'center',
        nameGap: 55,  // 增加名称与轴的距离
        min: 0,
        max: maxY,
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed' }
        },
        axisLabel: {
          margin: 16,  // 增加标签与轴的距离
          formatter: (value) => value.toFixed(2),
          align: 'right'  // 确保数字右对齐
        }
      },
      series: [{
        type: 'line',
        showSymbol: false,
        clip: true,
        data: currentData.map(point => [
          point['2THETA'],
          point['Cnt2_D1']
        ]),
        lineStyle: {
          width: 2,
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
              color: 'rgba(24,144,255,0.3)'
            }, {
              offset: 1,
              color: 'rgba(24,144,255,0.1)'
            }]
          }
        }
      }]
    };
  };

  // 获取匹配度对应的样式
  const getMatchingStyle = (similarity) => {
    if (similarity >= 95) {
      return {
        className: "alert alert-success",
        icon: "✓",
        text: "完全匹配"
      };
    } else if (similarity >= 85) {
      return {
        className: "alert alert-info",
        icon: "★",
        text: "高度匹配"
      };
    } else if (similarity >= 70) {
      return {
        className: "alert alert-warning",
        icon: "○",
        text: "部分匹配"
      };
    } else {
      return {
        className: "alert alert-danger",
        icon: "⚠",
        text: "低度匹配"
      };
    }
  };

  return (
    <div className="result-card">
      <style jsx>{`
        .result-card {
          width: 100%;
          margin-top: 2rem;
        }

        /* 覆盖 Bootstrap 卡片样式 */
        :global(.card) {
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          border: none;
        }

        :global(.card-body) {
          padding: 2rem;
        }

        /* 图表容器样式 */
        :global(.chart-container) {
          width: 100%;
          min-height: 400px;
          margin: 1.5rem 0;
        }
      `}</style>
      <div className="card mt-4">
        <div className="card-body p-0">
          {/* 工具栏切换按钮 */}
          <div className="position-absolute" style={{ right: '15px', top: '15px', zIndex: 1000 }}>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setShowToolbar(!showToolbar)}
              title={showToolbar ? "隐藏工具栏" : "显示工具栏"}
            >
              <FaTools />
            </button>
          </div>

          {/* 图表区域 */}
          <div style={{ height: '400px', position: 'relative' }}>
            <ReactECharts 
              option={getChartOptions()} 
              style={{ height: '100%', width: '100%' }}
              notMerge={true}
              lazyUpdate={false}
            />
          </div>

          {/* 工具栏 */}
          <CSSTransition
            in={showToolbar}
            timeout={300}
            classNames="toolbar"
            unmountOnExit
          >
            <div className="border-top">
              <ToolBar
                onSpeedChange={handleSpeedChange}
                currentSpeed={speed}
                onGenerate={handleGenerate}
                onPause={handlePause}
                isPaused={isPaused}
                onReset={handleReset}
              />
            </div>
          </CSSTransition>

          {/* 展开/收起按钮 */}
          <div 
            className="text-center py-2 border-top" 
            style={{ cursor: 'pointer' }}
            onClick={() => setShowDetails(!showDetails)}
          >
            {showDetails ? <FaChevronUp /> : <FaChevronDown />}
          </div>

          {/* 详细信息区域 */}
          {showDetails && (
            <div className="p-3 border-top">
              {resultData.similarity !== undefined && (
                <div className={getMatchingStyle(resultData.similarity).className}>
                  <div className="d-flex align-items-center">
                    <span className="me-2" style={{ fontSize: '1.2em' }}>
                      {getMatchingStyle(resultData.similarity).icon}
                    </span>
                    <div>
                      <strong>{getMatchingStyle(resultData.similarity).text}</strong>
                      <div>匹配度: {resultData.similarity.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              )}
              <div className="row">
                <div className="col-md-6">
                  <h6>分析结果:</h6>
                  <p>{resultData.result}</p>
                </div>
                <div className="col-md-6">
                  <img 
                    src={resultData.img} 
                    alt="XRD Result" 
                    className="img-fluid"
                    style={{ maxHeight: '300px' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
