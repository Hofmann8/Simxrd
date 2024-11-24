import React, { useState } from 'react';
import { FaFlask, FaThermometerHalf, FaClock } from 'react-icons/fa';

const XRDForm = ({ onSubmit }) => {
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

  const iconStyle = { color: '#007bff', marginRight: '5px' }; // 蓝色图标，右侧间距

  const labels = {
    sio2: (
      <>
        <FaFlask style={iconStyle} />
        SiO<sub>2</sub>/Al<sub>2</sub>O<sub>3</sub> 比例
      </>
    ),
    na2o: (
      <>
        <FaFlask style={iconStyle} />
        Na<sub>2</sub>O/SiO<sub>2</sub> 比例
      </>
    ),
    h2o: (
      <>
        <FaFlask style={iconStyle} />
        H<sub>2</sub>O/SiO<sub>2</sub> 比例
      </>
    ),
    time: (
      <>
        <FaClock style={iconStyle} />
        时间 (小时)
      </>
    ),
    temperature: (
      <>
        <FaThermometerHalf style={iconStyle} />
        温度 (℃)
      </>
    ),
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3 mt-4 bg-light p-4 rounded">
      {Object.keys(formData).map((key, idx) => (
        <div key={idx} className="col-md-6">
          <label htmlFor={key} className="form-label">
            {labels[key] || key.toUpperCase()}
          </label>
          <input
            type="number"
            className="form-control"
            id={key}
            value={formData[key]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <div className="col-12">
        <button type="submit" className="btn btn-primary w-100">
          开始模拟
        </button>
      </div>
    </form>
  );
};

export default XRDForm;
