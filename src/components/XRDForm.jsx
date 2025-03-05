import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { formFields } from '../config/formConfig';

const XRDForm = ({ onSubmit, suggestions }) => {
  const [formData, setFormData] = useState({
    sio2: 3.0,
    na2o: 2.0,
    h2o: 10.0,
    time: 3.0,
    temperature: 90.0,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
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
                  max={field.max}
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
              <div className="position-relative mt-2">
                {suggestions && suggestions[key] && (
                  <div
                    className="suggestion-range"
                    style={{
                      position: 'absolute',
                      left: `${(suggestions[key].min - field.min) / (field.max - field.min) * 100}%`,
                      width: `${(suggestions[key].max - suggestions[key].min) / (field.max - field.min) * 100}%`,
                      height: '10px',
                      backgroundColor: 'rgba(255, 193, 7, 0.3)',
                      borderRadius: '5px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      zIndex: 1
                    }}
                  />
                )}
                <input
                  type="range"
                  className="form-range"
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  value={formData[key]}
                  onChange={handleChange}
                  id={key}
                  style={{ position: 'relative', zIndex: 2 }}
                />
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
  );
};

export default XRDForm;
