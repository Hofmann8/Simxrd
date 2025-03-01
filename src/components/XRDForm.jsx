import React, { useState } from 'react';
import { FaInfoCircle } from 'react-icons/fa';
import { formFields } from '../config/formConfig';

const XRDForm = ({ onSubmit, suggestions }) => {
  const [formData, setFormData] = useState({
    sio2: 3,
    na2o: 2,
    h2o: 10,
    time: 3,
    temperature: 90,
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
      <style jsx>{`
        form {
          width: 100%;
        }

        /* 调整表单布局 */
        :global(.form-row) {
          display: flex;
          flex-wrap: wrap;
          margin: 0 -20px;
        }

        :global(.form-group) {
          flex: 1;
          min-width: 300px;
          padding: 0 20px;
          margin-bottom: 1.5rem;
        }

        /* 调整输入框样式 */
        :global(.form-control) {
          border-radius: 8px;
          padding: 0.75rem 1rem;
        }

        /* 调整按钮样式 */
        :global(.btn) {
          padding: 0.75rem 2rem;
          border-radius: 8px;
        }
      `}</style>
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
                  style={{ width: '100px' }}
                />
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
