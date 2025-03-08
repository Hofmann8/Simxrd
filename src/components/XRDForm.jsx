import React, { useState, useEffect, useRef } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { formFields, specialTimePresets, specialPresets } from '../config/formConfig';
import './XRDForm.css';

const XRDForm = ({ onSubmit, suggestions }) => {
  const [formData, setFormData] = useState({
    sio2: 3.0,
    na2o: 2.0,
    h2o: 10.0,
    time: 3.0,
    temperature: 90.0,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [presetToApply, setPresetToApply] = useState(null);
  const [specialValueInfo, setSpecialValueInfo] = useState(null);
  // 引用外层卡片容器
  const cardBodyRef = useRef(null);

  // 组件挂载时查找外层卡片容器
  useEffect(() => {
    // 查找最近的 .card-body 祖先元素
    const findCardBody = () => {
      const formElement = document.querySelector('form');
      if (formElement) {
        let parent = formElement.parentElement;
        while (parent) {
          if (parent.classList.contains('card-body')) {
            return parent;
          }
          parent = parent.parentElement;
        }
      }
      return null;
    };

    cardBodyRef.current = findCardBody();
    console.log('找到卡片容器:', cardBodyRef.current);
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    const numValue = Number(value);

    // 检查是否是特殊时间值
    if (id === 'time' && (numValue === 48.0 || numValue === 72.0 || numValue === 96.0)) {
      // 找到对应的预设配置
      const preset = specialTimePresets.find(p => p.time === numValue);
      if (preset) {
        setPresetToApply(preset);
        setShowConfirmModal(true);
        return;
      }
    }

    // 检查其他参数的特殊值
    if (id !== 'time' && specialPresets[id] && specialPresets[id][numValue]) {
      // 显示特殊值信息提示
      setSpecialValueInfo({
        paramId: id,
        value: numValue,
        description: specialPresets[id][numValue].description
      });

      // 3秒后自动关闭提示
      setTimeout(() => {
        setSpecialValueInfo(null);
      }, 3000);
    }

    setFormData((prevData) => ({ ...prevData, [id]: numValue }));
  };

  // 处理时间滑块点击事件
  const handleTimeSliderClick = () => {
    // 如果当前时间值超出正常范围，则重置为最大正常值
    if (formData.time > formFields.time.max) {
      setFormData(prev => ({ ...prev, time: formFields.time.max }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 验证特殊时间值
    const validatedData = { ...formData };
    onSubmit(validatedData);
  };

  const applyPreset = () => {
    if (presetToApply) {
      setFormData(presetToApply);
      setShowConfirmModal(false);
    }
  };

  const cancelPreset = () => {
    setShowConfirmModal(false);
    // 恢复到默认时间值
    setFormData(prev => ({ ...prev, time: 3.0 }));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2 className="text-center mb-4">实验参数设置</h2>
        <div className="row g-4">
          {Object.entries(formFields).map(([key, field]) => (
            <div key={key} className="col-md-6">
              <div className="form-group">
                <label className="d-flex align-items-center mb-2">
                  <span className="me-2">{field.icon}</span>
                  {field.label}
                  <span
                    className="ms-2"
                    style={{ cursor: 'help' }}
                    title={field.tooltip}
                  >
                    <FaInfoCircle size={14} />
                  </span>
                </label>
                <div className="input-group">
                  <input
                    type="number"
                    className="form-control text-end"
                    id={key}
                    value={formData[key]}
                    onChange={handleChange}
                    min={field.min}
                    max={key === 'time' ? 96.0 : field.max} // 允许时间输入框接受特殊值
                    step={field.step}
                    required
                  />
                  <div className="input-group-text">
                    {key === 'time' ? 'h' : key === 'temperature' ? '°C' : ''}
                  </div>
                  {field.specialValues && (
                    <select
                      className="form-select"
                      style={{ maxWidth: '100px' }}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleChange({
                            target: {
                              id: key,
                              value: e.target.value
                            }
                          });
                        }
                      }}
                      value={field.specialValues.some(sv => sv.value === formData[key]) ? formData[key] : ''}
                    >
                      <option value="">特殊值</option>
                      {field.specialValues.map(sv => (
                        <option key={sv.value} value={sv.value}>
                          {sv.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div className="position-relative mt-2 slider-container-wrapper">
                  {suggestions && suggestions[key] && (
                    <div
                      className="suggestion-range"
                      style={{
                        position: 'absolute',
                        left: `${(suggestions[key].min - field.min) / (field.max - field.min) * 100}%`,
                        width: `${(suggestions[key].max - suggestions[key].min) / (field.max - field.min) * 100}%`,
                        height: '10px',
                        backgroundColor: 'rgba(255, 193, 7, 0.2)',
                        borderRadius: '5px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        zIndex: 1
                      }}
                    >
                      <div
                        className="suggestion-tooltip"
                        style={{
                          position: 'absolute',
                          top: '-25px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          backgroundColor: 'rgba(255, 193, 7, 0.9)',
                          color: '#000',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          whiteSpace: 'nowrap',
                          zIndex: 10
                        }}
                      >
                        推荐: {suggestions[key].min.toFixed(2)} - {suggestions[key].max.toFixed(2)}
                      </div>
                    </div>
                  )}
                  <div
                    className={`slider-container ${key === 'time' && formData[key] > field.max ? 'cursor-pointer' : ''}`}
                    onClick={key === 'time' && formData[key] > field.max ? handleTimeSliderClick : undefined}
                    style={{ position: 'relative', cursor: key === 'time' && formData[key] > field.max ? 'pointer' : 'default' }}
                  >
                    <input
                      type="range"
                      className="form-range"
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={
                        // 对于时间字段的特殊处理：如果是特殊值，则显示最大值
                        key === 'time' && formData[key] > field.max
                          ? field.max
                          : formData[key]
                      }
                      onChange={handleChange}
                      id={key}
                      style={{ position: 'relative', zIndex: 2 }}
                      disabled={key === 'time' && formData[key] > field.max}
                    />
                    {key === 'time' && formData[key] > field.max && (
                      <div
                        className="reset-hint"
                        style={{
                          position: 'absolute',
                          top: '-20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '12px',
                          color: '#6c757d',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        点击重置为24小时
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-4">
          <button type="submit" className="btn btn-primary px-5">
            开始模拟
          </button>
        </div>
      </form>

      {/* 特殊值信息提示 - 渲染到外层卡片容器 */}
      {specialValueInfo && document.querySelector('.card-body') && (
        <div
          className="special-value-toast"
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            backgroundColor: 'rgba(25, 135, 84, 0.95)',
            color: 'white',
            padding: '15px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1060,
            maxWidth: '350px',
            animation: 'fadeIn 0.3s ease'
          }}
        >
          <div className="d-flex align-items-center mb-2">
            <strong>特殊参数值</strong>
          </div>
          <div>
            <p className="mb-1">
              {formFields[specialValueInfo.paramId].label}: <strong>{specialValueInfo.value}</strong>
            </p>
            <p className="mb-0 small">
              {specialValueInfo.description}
            </p>
          </div>
        </div>
      )}

      {/* 特殊时间值确认弹窗 */}
      {showConfirmModal && presetToApply && (
        <div className="modal-backdrop show" style={{ zIndex: 1050 }}></div>
      )}

      {showConfirmModal && presetToApply && (
        <div
          className="modal fade show"
          style={{ display: 'block', zIndex: 1051 }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">特殊实验参数确认</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={cancelPreset}
                ></button>
              </div>
              <div className="modal-body">
                <p>您选择了特殊的晶化时间 <strong>{presetToApply.time}小时</strong>，系统将自动设置以下参数：</p>
                <ul className="list-group mb-3">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    SiO₂/Na₂O
                    <span className="badge bg-primary rounded-pill">{presetToApply.sio2}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Na₂O/Al₂O₃
                    <span className="badge bg-primary rounded-pill">{presetToApply.na2o}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    H₂O/Na₂O
                    <span className="badge bg-primary rounded-pill">{presetToApply.h2o}</span>
                  </li>
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    晶化温度
                    <span className="badge bg-primary rounded-pill">{presetToApply.temperature}°C</span>
                  </li>
                </ul>
                <p className="text-muted small">这些参数来自实际实验数据，可以获得更准确的模拟结果。</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelPreset}
                >
                  取消
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={applyPreset}
                >
                  应用参数
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default XRDForm;
