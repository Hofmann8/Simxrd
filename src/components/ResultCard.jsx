import React, { useState, useEffect, useRef } from 'react';
import XRDChart from './XRDChart';
import ToolBar from './ToolBar';
import { FaTools } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import './ResultCard.css';

const ResultCard = ({ resultData }) => {
  const [speed, setSpeed] = useState(1);
  const [showToolBar, setShowToolBar] = useState(false);
  const [instantGenerate, setInstantGenerate] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const toolBarRef = useRef(null);

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handleToggleToolBar = () => {
    setShowToolBar((prevShowToolBar) => !prevShowToolBar);
  };

  const handleGenerate = () => {
    setInstantGenerate(true);
  };

  const handleShowDetails = () => {
    setShowDetails((prevShowDetails) => !prevShowDetails);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolBarRef.current && !toolBarRef.current.contains(event.target)) {
        setShowToolBar(false);
      }
    };

    if (showToolBar) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showToolBar]);

  useEffect(() => {
    if (instantGenerate) {
      const timer = setTimeout(() => setInstantGenerate(false), 0);
      return () => clearTimeout(timer);
    }
  }, [instantGenerate]);

  return (
    <div className="card shadow-lg p-3 mb-5 bg-white rounded">
      <div className="card-body">
        <XRDChart data={resultData.data} speed={speed} instantGenerate={instantGenerate} />

        {/* ToolBar 放置在右上角，使用 CSSTransition 动画控制 */}
        <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
          {/* 工具图标按钮，点击展开或收起 ToolBar */}
          {!showToolBar && (
            <button
              onClick={handleToggleToolBar}
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                cursor: 'pointer',
              }}
            >
              <FaTools size={24} />
            </button>
          )}
          <CSSTransition
            in={showToolBar}
            timeout={300}
            classNames="toolbar-transition"
            unmountOnExit
            nodeRef={toolBarRef}
          >
            <div
              ref={toolBarRef}
              style={{
                position: 'absolute',
                top: '0', // 确保展开位置与图标重合
                right: '0',
                opacity: 0.95,
                transformOrigin: 'top right',
              }}
            >
              <ToolBar onSpeedChange={handleSpeedChange} onGenerate={handleGenerate} currentSpeed={speed} />
            </div>
          </CSSTransition>
        </div>

        {/* 控制显示详细实验结果的按钮，灰色背景 */}
        <button
          onClick={handleShowDetails}
          style={{
            marginTop: '20px',
            backgroundColor: '#f0f0f0', // 不显眼的灰色背景
            color: '#333',
            border: '1px solid #ddd',
            borderRadius: '5px',
            padding: '8px 16px',
            cursor: 'pointer',
            opacity: 0.9,
            transition: 'all 0.3s ease', // 添加动画效果
          }}
        >
          {showDetails ? '隐藏实验结果' : '显示实验结果'}
        </button>

        {/* 使用 react-transition-group 实现展开实验结果的动画效果 */}
        <TransitionGroup>
          {showDetails && (
            <CSSTransition
              timeout={300}
              classNames="details-transition"
              unmountOnExit
            >
              <div style={{ marginTop: '20px' }}>
                <img src={resultData.img} alt="XRD Match" className="img-fluid mb-3" />
                <p className="card-text">实验结果由王瑜老师课题组于大连理工大学国家分析测试中心测得。</p>
                <p className="card-text">{resultData.source}</p>
                <p className="card-text">{resultData.result}</p>
              </div>
            </CSSTransition>
          )}
        </TransitionGroup>
      </div>
    </div>
  );
};

export default ResultCard;
