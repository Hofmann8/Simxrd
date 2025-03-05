import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const XRDChart = ({ dataPath, speed, instantGenerate }) => {
  const chartRef = useRef(null);
  const indexRef = useRef(0);
  const storedDataRef = useRef([]);
  const animationTimeoutRef = useRef(null);
  const [isInstantRender, setIsInstantRender] = useState(false);

  useEffect(() => {
    const chartContainer = document.getElementById('xrd-chart');
    if (!chartContainer) {
      console.error("Chart container not found");
      return;
    }

    if (!chartRef.current) {
      chartRef.current = echarts.init(chartContainer);

      chartRef.current.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        xAxis: {
          type: 'value',
          name: 'Angle (2θ)',
          nameLocation: 'center',
          nameGap: 25,
          min: dataPath ? data[0]["2THETA"] : 0,
        },
        yAxis: { 
          type: 'value', 
          name: 'Intensity', 
          nameLocation: 'center', 
          nameGap: 40,
        },
        series: [{
          type: 'line',
          data: [],
          showSymbol: false,
          connectNulls: false,
          lineStyle: {
            opacity: 1,
          },
          emphasis: {
            focus: 'series',
            itemStyle: {
              color: 'auto'
            }
          },
          markLine: {
            silent: true,
            lineStyle: {
              type: 'dashed',
              color: '#333'
            },
            data: []
          }
        }],
      });
      chartRef.current.resize();
    }

    return () => {
      if (chartRef.current) {
        chartRef.current.dispose();
      }
    };
  }, [dataPath]);

  // 清除动画函数
  const clearAnimationTimeout = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
      animationTimeoutRef.current = null;
    }
  };

  // 一键生成逻辑
  useEffect(() => {
    if (instantGenerate) {
      chartRef.current.setOption({
        series: [{ data: dataPath ? data.map((point) => [point["2THETA"], point["Cnt2_D1"]]) : [] }],
      });
      setIsInstantRender(true);
    } else if (!isInstantRender) {
      clearAnimationTimeout();
      let index = indexRef.current;

      const animateData = () => {
        if (index >= dataPath ? data.length : 0) return;

        const newPoint = [dataPath ? data[index]["2THETA"] : 0, dataPath ? data[index]["Cnt2_D1"] : 0];
        storedDataRef.current = [...storedDataRef.current, newPoint];
        chartRef.current.setOption({
          series: [{ data: storedDataRef.current }],
        });

        index += 1;
        indexRef.current = index;
        animationTimeoutRef.current = setTimeout(animateData, 100 / speed);
      };

      animateData();
    }

    return () => clearAnimationTimeout();
  }, [dataPath, speed, instantGenerate, isInstantRender]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch(dataPath);
        const data = await response.json();
        // 处理数据逻辑
        // ... existing code ...
      } catch (error) {
        console.error('Error loading XRD data:', error);
      }
    };

    if (dataPath) {
      loadData();
    }
  }, [dataPath]);

  return <div id="xrd-chart" style={{ width: '100%', height: '400px', minHeight: '400px' }} />;
};

export default XRDChart;
