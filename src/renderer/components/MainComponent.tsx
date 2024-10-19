import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'typeface-roboto';
import * as echarts from 'echarts';
import './style.css'; // 确保你的CSS文件路径正确

const MainComponent: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // 初始化 ECharts 图表
  useEffect(() => {
    const chartDom = document.getElementById('xrd-chart') as HTMLDivElement;
    if (chartDom) {
      const myChart = echarts.init(chartDom);
      const option = {
        title: {
          text: 'XRD 模拟结果',
        },
        xAxis: {
          type: 'category',
          data: ['衍射角1', '衍射角2', '衍射角3'],
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: [10, 20, 15],
            type: 'line',
          },
        ],
      };
      myChart.setOption(option);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    // 模拟处理，之后关闭加载
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="container mt-5">
      {/* 标题 */}
      <div className="text-center">
        <div className="logo-text sweep-effect">
          Sim<span className="gradient-x">X</span>RD-DUT
        </div>
      </div>

      {/* 表单 */}
      <form id="xrd-form" className="row g-3 mt-4" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="sio2" className="form-label">SiO2/Al2O3 比例:</label>
          <input type="number" className="form-control" id="sio2" defaultValue={3} required />
        </div>

        <div className="col-md-6">
          <label htmlFor="na2o" className="form-label">Na2O/SiO2 比例:</label>
          <input type="number" className="form-control" id="na2o" defaultValue={2} required />
        </div>

        <div className="col-md-6">
          <label htmlFor="h2o" className="form-label">H2O/SiO2 比例:</label>
          <input type="number" className="form-control" id="h2o" defaultValue={10} required />
        </div>

        <div className="col-md-6">
          <label htmlFor="time" className="form-label">时间 (小时):</label>
          <input type="number" className="form-control" id="time" defaultValue={3} required />
        </div>

        <div className="col-md-6">
          <label htmlFor="temperature" className="form-label">温度 (℃):</label>
          <input type="number" className="form-control" id="temperature" defaultValue={90} required />
        </div>

        <div className="col-12">
          <button type="submit" className="btn btn-primary w-100">开始模拟</button>
        </div>
      </form>

      {/* 加载指示器 */}
      {loading && (
        <div id="loading-spinner" className="spinner-border text-primary mt-4" role="status">
          <span className="visually-hidden">加载中...</span>
        </div>
      )}

      {/* 结果显示 */}
      {!loading && (
        <div className="mt-4">
          <h3>最近似结果</h3>
          <div className="card shadow-lg p-3 mb-5 bg-white rounded" id="result-card">
            <div className="card-body">
              {/* ECharts 图表容器 */}
              <div id="xrd-chart" className="chart-container">
                <p className="text-center text-muted placeholder-text">图表加载后显示结果</p>
              </div>
              <p id="source-info" className="card-text">模拟源信息</p>
              <p id="closest-data" className="card-text">最接近的数据</p>
            </div>
          </div>
        </div>
      )}

      {/* 错误信息 */}
      {errorMessage && (
        <div className="alert alert-danger mt-4" id="error-message">
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default MainComponent;
