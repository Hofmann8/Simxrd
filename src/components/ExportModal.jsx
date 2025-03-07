import React from 'react';
import ReactDOM from 'react-dom';
import { FaFileDownload, FaTimes } from 'react-icons/fa';

const ExportModal = ({ show, onClose, resultData, onExport }) => {
  if (!show) return null;

  // 获取匹配度对应的样式
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

  // 找到 app-content 元素（更精确的目标容器）
  const appContent = document.querySelector('.app-content');
  
  // 如果找不到，尝试 app-container
  const appContainer = !appContent ? document.querySelector('.app-container') : null;
  
  // 如果都找不到，则回退到 body
  const container = appContent || appContainer || document.body;

  // 创建模态框内容
  const modalContent = (
    <div className="export-modal-wrapper" style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      // 确保遮罩层不会超出容器
      overflow: 'hidden'
    }}>
      <div className="export-modal-content" style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        width: '90%',
        maxWidth: '800px',
        maxHeight: '80vh',
        overflow: 'auto',
        boxShadow: '0 5px 15px rgba(0,0,0,0.5)',
        position: 'relative'
      }}>
        <div className="modal-header" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem',
          borderBottom: '1px solid #dee2e6'
        }}>
          <h5 className="modal-title">XRD 分析结果</h5>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              padding: '0.25rem'
            }}
          >
            <FaTimes />
          </button>
        </div>
        <div className="modal-body" style={{ padding: '1rem' }}>
          <div className="row">
            <div className="col-md-6">
              <h6 className="text-primary mb-3">分析结果</h6>
              <p className="mb-4">{resultData.result}</p>

              <div className="mb-4">
                <h6 className="text-primary mb-3">匹配详情</h6>
                <div className="d-flex align-items-center mb-2">
                  <span className={`${getMatchingStyle(resultData.similarity).className} me-2`}>
                    {getMatchingStyle(resultData.similarity).icon}
                  </span>
                  <span>{getMatchingStyle(resultData.similarity).text}</span>
                </div>
                <ul className="list-unstyled">
                  <li className="mb-2">• 匹配度：{resultData.similarity?.toFixed(1)}%</li>
                  <li className="mb-2">• 数据源：{resultData.source}</li>
                </ul>
              </div>
            </div>
            <div className="col-md-6">
              <h6 className="text-primary mb-3">参考图谱</h6>
              <img
                src={resultData.img}
                alt="XRD Result"
                className="img-fluid mb-3"
                style={{ maxWidth: '100%' }}
              />
            </div>
          </div>
        </div>
        <div className="modal-footer" style={{
          display: 'flex',
          justifyContent: 'flex-end',
          padding: '1rem',
          borderTop: '1px solid #dee2e6',
          gap: '0.5rem'
        }}>
          <button
            className="btn btn-secondary"
            onClick={onClose}
          >
            关闭
          </button>
          <button
            className="btn btn-primary"
            onClick={onExport}
          >
            <FaFileDownload className="me-2" />
            导出数据到CSV
          </button>
        </div>
      </div>
    </div>
  );

  // 使用 ReactDOM.createPortal 将模态框渲染到指定容器
  return ReactDOM.createPortal(modalContent, container);
};

export default ExportModal; 