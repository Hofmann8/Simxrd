class XRDProcessor {
  constructor() {
    // 定义每个参数的权重和容差范围
    this.paramConfig = {
      sio2: { weight: 1.0, tolerance: 0.5 },
      na2o: { weight: 1.0, tolerance: 0.3 },
      h2o: { weight: 0.5, tolerance: 1.0 },
      time: { weight: 0.8, tolerance: 1.0 },
      temperature: { weight: 0.8, tolerance: 10 }
    };
  }

  calculateSimilarity(params, reference) {
    // 计算每个参数的归一化差异
    const differences = Object.keys(this.paramConfig).map(key => {
      const diff = Math.abs(params[key] - reference[key]);
      const { weight, tolerance } = this.paramConfig[key];
      // 使用容差范围归一化差异，并应用权重
      return (diff / tolerance) * weight;
    });
    
    // 返回总体相似度得分
    return Math.sqrt(differences.reduce((sum, diff) => sum + diff * diff, 0));
  }

  findClosestMatch(params, dataSource) {
    // 对每个数据点计算相似度，并找出最相似的
    return dataSource
      .map(data => ({
        data,
        similarity: this.calculateSimilarity(params, data)
      }))
      .reduce((closest, current) => {
        return current.similarity < closest.similarity ? current : closest;
      });
  }

  processXRDData(data) {
    const angles = data.map(point => point['2THETA']);
    const intensities = data.map(point => point['Cnt2_D1']);
    
    // 数据平滑
    const smoothed = this.smoothData(intensities);
    
    // 背景去除
    const corrected = this.removeBackground(smoothed);
    
    return {
      angles,
      intensities: corrected
    };
  }

  smoothData(data, windowSize = 5) {
    const result = [];
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j < Math.min(data.length, i + windowSize + 1); j++) {
        sum += data[j];
        count++;
      }
      result[i] = sum / count;
    }
    return result;
  }

  removeBackground(data) {
    const background = Math.min(...data);
    return data.map(val => val - background);
  }
}

export default XRDProcessor; 