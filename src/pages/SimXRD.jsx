import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import XRDForm from '../components/XRDForm';
import ResultCard from '../components/ResultCard';

const SimXRD = () => {
  const [resultData, setResultData] = useState(null);
  const [dataSource, setDataSource] = useState([]);
  const [speed, setSpeed] = useState(1); // 控制生成速度

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => setDataSource(data))
      .catch((error) => console.error('Error loading data.json:', error));
  }, []);

  const handleFormSubmit = (formData) => {
    const closestData = dataSource.reduce((prev, curr) => {
      const prevDistance = Math.sqrt(
        Math.pow(prev.sio2 - formData.sio2, 2) +
        Math.pow(prev.na2o - formData.na2o, 2) +
        Math.pow(prev.h2o - formData.h2o, 2) +
        Math.pow(prev.time - formData.time, 2) +
        Math.pow(prev.temperature - formData.temperature, 2)
      );
      const currDistance = Math.sqrt(
        Math.pow(curr.sio2 - formData.sio2, 2) +
        Math.pow(curr.na2o - formData.na2o, 2) +
        Math.pow(curr.h2o - formData.h2o, 2) +
        Math.pow(curr.time - formData.time, 2) +
        Math.pow(curr.temperature - formData.temperature, 2)
      );
      return currDistance < prevDistance ? curr : prev;
    }, dataSource[0]);

    if (closestData) {
      fetch(`/xrd_data/${closestData.source}.json`)
        .then((response) => response.json())
        .then((jsonData) => {
          setResultData({
            img: `/xrd_images/${closestData.img}`,
            source: closestData.source,
            result: closestData.result,
            data: jsonData, // 完整数据传给子组件
          });
        })
        .catch((error) => console.error('Error loading XRD data file:', error));
    }
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  const handleGenerate = () => {
    setResultData((prev) => ({
      ...prev,
      data: resultData.data,
    }));
  };

  return (
    <div className="container mt-5">
      <Header />
      <XRDForm onSubmit={handleFormSubmit} />
      {resultData && <ResultCard resultData={resultData} speed={speed} onGenerate={handleGenerate} onSpeedChange={handleSpeedChange} />}
    </div>
  );
};

export default SimXRD;
