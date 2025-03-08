import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const LowMatchWarningModal = ({ show, onClose, similarity }) => {
  // 添加调试日志
  useEffect(() => {
    console.log('LowMatchWarningModal: show =', show, 'similarity =', similarity);
  }, [show, similarity]);

  useEffect(() => {
    if (show) {
      // 禁止背景滚动
      document.body.style.overflow = 'hidden';
    } else {
      // 恢复背景滚动
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [show]);

  if (!show) return null;

  // 找到 app-content 元素（更精确的目标容器）
  const appContent = document.querySelector('.app-content');
  
  // 如果找不到，尝试 app-container
  const appContainer = !appContent ? document.querySelector('.app-container') : null;
  
  // 如果都找不到，则回退到 body
  const container = appContent || appContainer || document.body;

  const modalContent = (
    <>
      <div className="modal-backdrop show" style={{ zIndex: 1050 }}></div>
      <div 
        className="modal fade show" 
        style={{ display: 'block', zIndex: 1051 }}
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning">
              <h5 className="modal-title">
                <FaExclamationTriangle className="me-2" />
                匹配度警告
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <p>当前参数组合的模拟结果与实验数据匹配度较低 (<strong>{similarity.toFixed(1)}%</strong>)。</p>
              <p>可能的原因：</p>
              <ul>
                <li>参数组合不符合实际合成条件</li>
                <li>该参数组合可能导致非晶态产物</li>
                <li>该参数组合可能导致多相混合产物</li>
              </ul>
              <p className="mb-0 text-muted small">建议调整参数或参考推荐参数范围重新模拟。</p>
            </div>
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={onClose}
              >
                我已了解
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  // 使用 createPortal 将模态框内容渲染到指定容器
  return createPortal(modalContent, container);
};

export default LowMatchWarningModal; 