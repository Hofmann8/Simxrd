import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFlask, FaCubes, FaInfoCircle, FaChartLine } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FaFlask />,
      title: 'XRD模拟',
      description: '基于机器学习的XRD谱图模拟系统',
      path: '/sim-xrd',
      color: 'linear-gradient(135deg, #0ea5e9, #38bdf8)'
    },
    {
      icon: <FaCubes />,
      title: '参考晶体结构',
      description: '3D交互式晶体结构展示',
      path: '/reference-structure',
      color: 'linear-gradient(135deg, #f43f5e, #fb7185)'
    },
    {
      icon: <FaChartLine />,
      title: '数据分析',
      description: '实验数据可视化与分析',
      path: '/sim-xrd',
      color: 'linear-gradient(135deg, #059669, #34d399)'
    },
    {
      icon: <FaInfoCircle />,
      title: '其他信息',
      description: '关于项目的更多信息',
      path: '/about',
      color: 'linear-gradient(135deg, #6366f1, #818cf8)'
    }
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        {/* 左侧标题区域 */}
        <div
          className="title-section"
        >
          <h1 className="main-title">
            Sim<span className="highlight">X</span>RD
          </h1>
          <p className="subtitle">
            基于机器学习的XRD谱图模拟与分析平台
          </p>
          <button
            className="cta-button"
            onClick={() => navigate('/sim-xrd')}
          >
            开始使用
          </button>
        </div>

        {/* 右侧功能卡片区域 */}
        <div className="features-grid">
          {features.map((feature, index) => (
            <div
              key={index}
              className="feature-card"
              style={{ background: feature.color }}
              onClick={() => navigate(feature.path)}
            >
              <div className="feature-icon">{feature.icon}</div>
              <div className="feature-text">
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home; 