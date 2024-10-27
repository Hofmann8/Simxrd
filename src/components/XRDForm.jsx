import React, { useState } from 'react';

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

  return (
    <form onSubmit={handleSubmit} className="row g-3 mt-4">
      {Object.keys(formData).map((key, idx) => (
        <div key={idx} className="col-md-6">
          <label htmlFor={key} className="form-label">
            {key.toUpperCase()}:
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
