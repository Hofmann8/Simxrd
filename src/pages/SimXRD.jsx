import React, { useState, useEffect } from 'react';
import XRDForm from '../components/XRDForm';
import ResultCard from '../components/ResultCard';
import XRDProcessor from '../utils/XRDProcessor';
import { formFields } from '../config/formConfig';

const processor = new XRDProcessor();

const SimXRD = () => {
  const [dataSource, setDataSource] = useState([]);
  const [resultData, setResultData] = useState(null);
  const [formSuggestions, setFormSuggestions] = useState(null);

  useEffect(() => {
    // 加载数据源
    fetch('/data.json')
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
        let hasAnySuggestion = false;
        
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
            hasAnySuggestion = true;
          }
          // 如果没有找到可行点，不添加该参数的建议区间
        }

        if (!hasAnySuggestion) {
          // 如果所有参数都没有可行区间
          alert(
            `当前参数组合与已知数据差异较大 (匹配度: ${matchPercentage.toFixed(1)}%)。\n\n` +
            `建议：\n` +
            `1. 检查参数输入是否正确\n` +
            `2. 考虑更大范围的参数调整\n` +
            `3. 可能需要进行实验验证`
          );
        } else {
          // 有可行区间时显示建议
          const message = `当前参数匹配度较低 (${matchPercentage.toFixed(1)}%)。\n` +
            `建议调整范围（保持其他参数不变）：\n\n` +
            Object.entries(suggestedRanges)
              .map(([key, range]) => {
                const label = formFields[key].label;
                return `${label}: ${range.min.toFixed(1)}-${range.max.toFixed(1)}` +
                       `${key === 'temperature' ? '°C' : key === 'time' ? 'h' : ''}`;
              })
              .join('\n') +
            '\n\n注：以上范围是在保持其他参数不变的情况下计算得出';

          alert(message);
        }

        // 更新表单的建议区间（即使某些参数没有建议）
        setFormSuggestions(suggestedRanges);
      } else {
        setFormSuggestions(null);
      }

      try {
        // 加载并处理 XRD 数据
        const response = await fetch(`/xrd_data/${closestData.source}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load XRD data for ${closestData.source} (${response.status})`);
        }
        
        let xrdData;
        try {
          xrdData = await response.json();
        } catch (jsonError) {
          console.error('Invalid JSON response:', await response.text());
          throw new Error('Invalid XRD data format');
        }

        // 确保数据格式正确
        if (!Array.isArray(xrdData) || !xrdData.length || !xrdData[0]['2THETA'] || !xrdData[0]['Cnt2_D1']) {
          console.error('Invalid XRD data structure:', xrdData);
          throw new Error('Invalid XRD data structure');
        }

        // 处理数据
        const processedData = processor.processXRDData(xrdData);

        // 转换处理后的数据为图表所需格式
        const chartData = processedData.angles.map((angle, index) => ({
          '2THETA': angle,
          'Cnt2_D1': processedData.intensities[index]
        }));

        setResultData({
          img: `/xrd_images/${closestData.img}`,
          source: closestData.source,
          result: closestData.result,
          data: chartData,
          similarity: matchPercentage
        });

      } catch (dataError) {
        console.error('Error loading XRD data:', dataError);
        alert(`无法加载 XRD 数据 (${closestData.source}): ${dataError.message}`);
      }

    } catch (error) {
      console.error('Error in form submission:', error);
      alert(`处理表单数据时出错: ${error.message}`);
    }
  };

  return (
    <div className="container-fluid">
      <div className="simxrd-container">
        <style>{`
          .simxrd-container {
            padding: 2.5rem;
            max-width: 2400px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }

          :global(.container-fluid) {
            padding: 0 40px;
            max-width: 2400px;
            margin: 0 auto;
          }

          :global(.card) {
            width: 100%;
            max-width: none;
          }

          :global(.form-row) {
            margin: 0 -20px;
          }

          :global(.form-group) {
            padding: 0 20px;
          }
        `}</style>
        <XRDForm 
          onSubmit={handleFormSubmit} 
          suggestions={formSuggestions}
        />
        {resultData && <ResultCard resultData={resultData} />}
      </div>
    </div>
  );
};

export default SimXRD;
