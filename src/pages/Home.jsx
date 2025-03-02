import React from 'react';
import { Link } from 'react-router-dom';
import { FaChartLine, FaCube, FaInfoCircle, FaArrowRight } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="content">
      <div className="home-container">
        {/* 页面标题 */}
        <div className="page-header">
          <div className="page-title">
            <div className="page-icon">
              <FaChartLine />
            </div>
            <h2>XRD模拟与晶体结构分析</h2>
          </div>
        </div>

        {/* 欢迎信息 */}
        <div className="welcome-section">
          <h3>欢迎使用XRD模拟分析工具</h3>
          <p>
            本工具提供X射线衍射(XRD)模拟和晶体结构可视化功能，帮助研究人员更好地理解材料结构特性。
            通过简单的参数设置，您可以快速获得高质量的XRD模拟图谱，并查看典型晶体结构的三维模型。
          </p>
        </div>

        {/* 功能卡片区域 */}
        <div className="feature-cards">
          {/* XRD模拟卡片 */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaChartLine />
            </div>
            <div className="feature-content">
              <h4>XRD模拟</h4>
              <p>通过设置晶体参数，模拟生成X射线衍射图谱，支持多种晶体结构和参数调整。</p>
              <Link to="/" className="feature-link">
                开始使用 <FaArrowRight />
              </Link>
            </div>
          </div>

          {/* 参考晶体结构卡片 */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaCube />
            </div>
            <div className="feature-content">
              <h4>参考晶体结构</h4>
              <p>查看典型晶体结构的三维模型，了解不同晶体的结构特征和空间排布。</p>
              <Link to="/reference-structure" className="feature-link">
                查看结构 <FaArrowRight />
              </Link>
            </div>
          </div>

          {/* 关于项目卡片 */}
          <div className="feature-card">
            <div className="feature-icon">
              <FaInfoCircle />
            </div>
            <div className="feature-content">
              <h4>关于项目</h4>
              <p>了解本项目的开发背景、技术实现和使用指南，获取更多帮助信息。</p>
              <Link to="/about" className="feature-link">
                了解更多 <FaArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 