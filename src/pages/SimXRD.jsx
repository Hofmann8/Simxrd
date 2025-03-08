import React, { useState, useEffect } from 'react';
import XRDForm from '../components/XRDForm';
import ResultCard from '../components/ResultCard';
import XRDProcessor from '../utils/XRDProcessor';
import { formFields } from '../config/formConfig';
import { FaChartLine } from 'react-icons/fa';
import { fetchXRDData } from '../api/ApiPresentations';

const processor = new XRDProcessor();

const SimXRD = () => {
  const [dataSource, setDataSource] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [formSuggestions, setFormSuggestions] = useState(null);

  useEffect(() => {
    // 加载数据源
    fetch('/final_merged_data.json')
      .then(response => response.json())
      .then(data => setDataSource(data))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  const handleFormSubmit = async (formData) => {
    try {
      const { data: closestData, similarity } = processor.findClosestMatch(formData, dataSource);
      const matchPercentage = similarity === 0 ? 100 : Math.max(0, 100 - similarity * 10);

      if (matchPercentage < 70) {
        const suggestedRanges = {};
        const parameters = Object.keys(formFields);

        // 为每个参数计算可行区间
        for (const param of parameters) {
          const testPoints = [];
          const step = (formFields[param].max - formFields[param].min) / 50;

          for (let value = formFields[param].min; value <= formFields[param].max; value += step) {
            const testData = { ...formData, [param]: value };
            const { similarity: testSimilarity } = processor.findClosestMatch(testData, dataSource);
            const testMatchPercentage = testSimilarity === 0 ? 100 : Math.max(0, 100 - testSimilarity * 10);

            if (testMatchPercentage >= 70) {
              testPoints.push(value);
            }
          }

          // 只有找到可行点时才添加建议区间
          if (testPoints.length > 0) {
            suggestedRanges[param] = {
              min: Math.min(...testPoints),
              max: Math.max(...testPoints)
            };
          }
          // 如果没有找到可行点，不添加该参数的建议区间
        }

        // 更新表单的建议区间
        setFormSuggestions(suggestedRanges);
      } else {
        setFormSuggestions(null);
      }

      try {
        const xrdData = await fetchXRDData(closestData.id);
        setResultData({
          ...xrdData,
          similarity: similarity === 0 ? 100 : Math.max(0, 100 - similarity * 10)
        });
      } catch (error) {
        console.error('Error loading XRD data:', error);
        // 使用自定义弹窗替代 alert
        // 这里可以添加一个错误提示弹窗组件
      }

    } catch (error) {
      console.error('Error in form submission:', error);
      // 使用自定义弹窗替代 alert
      // 这里可以添加一个错误提示弹窗组件
    }
  };

  return (
    <div className="simxrd-page" style={{ height: 'calc(100vh - 8px)' }}>
      <div className="container-fluid h-100">
        <div className="row h-100">
          {/* 左侧参数设置区域 */}
          <div className="col-md-4 h-100">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h5 className="card-title mb-0">参数设置</h5>
              </div>
              <div className="card-body" style={{ overflowY: 'auto' }}>
                <XRDForm
                  onSubmit={handleFormSubmit}
                  suggestions={formSuggestions}
                />

                {/* 添加参数说明区域 */}
                {!resultData && (
                  <div className="mt-4">
                    <h6 className="text-primary mb-3">参数说明</h6>
                    <div className="small text-muted">
                      <p className="mb-2">• SiO₂/Na₂O 比例：影响沸石的骨架结构，建议范围 3-6</p>
                      <p className="mb-2">• Na₂O/Al₂O₃ 比例：影响结晶度，建议范围 2-6</p>
                      <p className="mb-2">• H₂O/Na₂O 比例：影响晶化速率，建议范围 8-15</p>
                      <p className="mb-2">• 时间：晶化时间，建议范围 2-24小时</p>
                      <p className="mb-2">• 温度：晶化温度，建议范围 80-100℃</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 右侧结果显示区域 */}
          <div className="col-md-8 h-100">
            <div className="d-flex flex-column h-100">
              {resultData ? (
                // 有结果时显示结果卡片
                <div className="card flex-grow-1">
                  <div className="card-body p-0 h-100">
                    <ResultCard resultData={resultData} />
                  </div>
                </div>
              ) : (
                // 无结果时显示提示信息
                <div className="card flex-grow-1">
                  <div className="card-body d-flex flex-column align-items-center justify-content-center h-100">
                    <div className="text-center">
                      <div className="mb-4">
                        <FaChartLine size={64} className="text-muted" />
                      </div>
                      <h4 className="text-muted mb-3">等待模拟</h4>
                      <p className="text-muted">
                        请在左侧设置参数并点击"开始模拟"按钮
                      </p>
                      <div className="mt-4 text-start">
                        <h6 className="text-primary mb-3">功能说明：</h6>
                        <ul className="text-muted">
                          <li>支持多种晶体结构的XRD模拟</li>
                          <li>实时动态显示衍射图谱</li>
                          <li>可调节模拟速度和显示效果</li>
                          <li>提供匹配度分析和结果导出</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimXRD;
