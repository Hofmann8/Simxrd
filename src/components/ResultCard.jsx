import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import ToolBar from './ToolBar';
import './ResultCard.css';

const ResultCard = ({ resultData }) => {
  const [speed, setSpeed] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // 当 resultData 改变时重置状态
  useEffect(() => {
    setCurrentIndex(0);
    setIsPaused(false);
    setSpeed(1);
  }, [resultData.source]);

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

    // 使用 currentIndex 来控制数据显示
    const displayData = resultData.data.slice(0, currentIndex + 1);
    
    // 确保数据格式正确
    if (!displayData.every(point => '2THETA' in point && 'Cnt2_D1' in point)) {
      console.error('Invalid data format:', displayData);
      return {
        title: {
          text: '数据格式错误',
          left: 'center',
          top: 'center'
        }
      };
    }

    // 计算当前数据的范围，并添加一些边距
    const currentXValues = displayData.map(point => point['2THETA']);
    const minX = Math.max(5, Math.min(...currentXValues) - 2);
    const maxX = Math.min(50, Math.max(...currentXValues) + 2);
    
    // 计算Y轴范围
    const currentYValues = displayData.map(point => point['Cnt2_D1']);
    const maxY = Math.max(...currentYValues) * 1.1; // 留出10%的顶部空间

    // 计算最大值的位数来调整左边距
    const maxDigits = Math.floor(maxY).toString().length;
    const leftPadding = Math.max(70, 40 + maxDigits * 10); // 基础边距40，每位数字增加10px

    return {
      animation: false,
      grid: {
        top: 40,        // 减小顶部边距
        right: 20,      // 减小右边距
        bottom: 40,     // 减小底部边距
        left: 60,       // 减小左边距，但保持足够空间显示坐标值
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
        nameGap: 25,    // 减小名称与轴的距离
        min: minX,
        max: maxX,
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed' }
        },
        axisLabel: {
          margin: 8,    // 减小标签与轴的距离
          formatter: (value) => value.toFixed(1)  // 减少小数位数
        }
      },
      yAxis: {
        type: 'value',
        name: '强度',
        nameLocation: 'center',
        nameGap: 35,    // 减小名称与轴的距离
        min: 0,
        max: maxY,
        splitLine: {
          show: true,
          lineStyle: { type: 'dashed' }
        },
        axisLabel: {
          margin: 8,    // 减小标签与轴的距离
          formatter: (value) => {
            // 对于大数值，使用科学计数法
            if (value >= 1000) {
              return value.toExponential(1);
            }
            return value.toFixed(0);  // 整数显示
          },
          align: 'right'
        }
      },
      series: [{
        type: 'line',
        showSymbol: false,
        clip: true,
        data: displayData.map(item => [item['2THETA'], item['Cnt2_D1']]),
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
        className: "match-tag match-perfect",
        icon: "✓",
        text: "完全匹配"
      };
    } else if (similarity >= 85) {
      return {
        className: "match-tag match-high",
        icon: "★",
        text: "高度匹配"
      };
    } else if (similarity >= 70) {
      return {
        className: "match-tag match-partial",
        icon: "○",
        text: "部分匹配"
      };
    } else {
      return {
        className: "match-tag match-low",
        icon: "⚠",
        text: "低度匹配"
      };
    }
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

      {/* 主要内容区域 */}
      <div className="d-flex flex-grow-1">
        {/* 左侧图表 */}
        <div className="flex-grow-1 p-3">
          <ReactECharts
            option={getChartOptions()}
            style={{ height: '100%', width: '100%' }}
            notMerge={true}
          />
        </div>

        {/* 右侧信息栏 */}
        <div className="border-start" style={{ width: '260px' }}>
          <div className="p-3">
            <h6 className="text-primary mb-3">分析结果</h6>
            <p className="small text-muted mb-4">{resultData.result}</p>

            <h6 className="text-primary mb-3">参考图谱</h6>
            <img 
              src={resultData.img} 
              alt="XRD Result" 
              className="img-fluid mb-3"
              style={{ maxWidth: '100%' }}
            />

            <div className="small text-muted mt-3">
              <div className="fw-bold mb-2">匹配详情</div>
              <p>{getMatchingStyle(resultData.similarity).text}</p>
              <ul className="list-unstyled">
                <li>• 匹配度：{resultData.similarity.toFixed(1)}%</li>
                <li>• 数据源：{resultData.source}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
