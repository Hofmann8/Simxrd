import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaChartLine, FaCubes, FaInfoCircle, FaHome } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="home-page" style={{height: 'calc(100vh - 8px)'}}>
      <div className="container-fluid h-100 p-0">
        <div className="home-container">
          <div className="home-content">
            <div className="title-section">
              <h1 className="main-title">
                Sim<span className="highlight">X</span>RD
              </h1>
              <p className="subtitle">
                X射线衍射模拟与晶体结构分析工具
              </p>
              <button 
                className="cta-button"
                onClick={() => handleNavigate('/sim-xrd')}
              >
                开始使用
              </button>
            </div>
            
            <div className="features-grid">
              <div 
                className="feature-card" 
                style={{background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'}}
                onClick={() => handleNavigate('/sim-xrd')}
              >
                <div className="feature-icon">
                  <FaChartLine />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">XRD模拟</h3>
                  <p className="feature-description">
                    基于参数设置生成X射线衍射图谱，实时动态显示
                  </p>
                </div>
              </div>
              
              <div 
                className="feature-card" 
                style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}
                onClick={() => handleNavigate('/reference-structure')}
              >
                <div className="feature-icon">
                  <FaCubes />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">晶体结构</h3>
                  <p className="feature-description">
                    查看和交互式探索各种沸石晶体的三维结构
                  </p>
                </div>
              </div>
              
              <div 
                className="feature-card" 
                style={{background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)'}}
                onClick={() => handleNavigate('/')}
              >
                <div className="feature-icon">
                  <FaHome />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">首页</h3>
                  <p className="feature-description">
                    返回应用首页，查看概览和快速导航
                  </p>
                </div>
              </div>
              
              <div 
                className="feature-card" 
                style={{background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'}}
                onClick={() => handleNavigate('/about')}
              >
                <div className="feature-icon">
                  <FaInfoCircle />
                </div>
                <div className="feature-text">
                  <h3 className="feature-title">关于</h3>
                  <p className="feature-description">
                    了解开发团队、技术支持和使用说明
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 