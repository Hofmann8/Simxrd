class InterpolationProcessor {
  constructor() {
    this.cache = new Map();
  }

  // 计算两个 XRD 数据的相似度
  calculateSimilarity(data1, data2) {
    const angles1 = data1.map(p => p['2THETA']);
    const intensities1 = data1.map(p => p['Cnt2_D1']);
    const angles2 = data2.map(p => p['2THETA']);
    const intensities2 = data2.map(p => p['Cnt2_D1']);

    // 确保角度范围一致
    const minAngle = Math.max(Math.min(...angles1), Math.min(...angles2));
    const maxAngle = Math.min(Math.max(...angles1), Math.max(...angles2));

    // 在相同角度范围内重采样
    const numPoints = 1000;
    const step = (maxAngle - minAngle) / numPoints;
    
    const resampled1 = this.resampleData(angles1, intensities1, minAngle, maxAngle, step);
    const resampled2 = this.resampleData(angles2, intensities2, minAngle, maxAngle, step);

    // 计算皮尔逊相关系数
    const correlation = this.calculateCorrelation(resampled1, resampled2);
    
    // 计算均方根误差
    const rmse = Math.sqrt(
      resampled1.reduce((sum, val, i) => sum + Math.pow(val - resampled2[i], 2), 0) / resampled1.length
    );

    // 计算峰位置匹配度
    const peaks1 = this.findPeaks(resampled1);
    const peaks2 = this.findPeaks(resampled2);
    const peakSimilarity = this.calculatePeakSimilarity(peaks1, peaks2);

    return {
      correlation,
      rmse,
      peakSimilarity
    };
  }

  // 计算皮尔逊相关系数
  calculateCorrelation(array1, array2) {
    const mean1 = array1.reduce((a, b) => a + b, 0) / array1.length;
    const mean2 = array2.reduce((a, b) => a + b, 0) / array2.length;

    const variance1 = array1.reduce((a, b) => a + Math.pow(b - mean1, 2), 0);
    const variance2 = array2.reduce((a, b) => a + Math.pow(b - mean2, 2), 0);

    const covariance = array1.reduce((a, b, i) => a + (b - mean1) * (array2[i] - mean2), 0);

    return covariance / Math.sqrt(variance1 * variance2);
  }

  // 重采样数据
  resampleData(angles, intensities, minAngle, maxAngle, step) {
    const result = [];
    for (let angle = minAngle; angle <= maxAngle; angle += step) {
      result.push(this.interpolateIntensity(angles, intensities, angle));
    }
    return result;
  }

  // 使用线性插值计算强度
  interpolateIntensity(angles, intensities, targetAngle) {
    // 找到最近的两个点
    let i = 0;
    while (i < angles.length && angles[i] < targetAngle) {
      i++;
    }

    if (i === 0) return intensities[0];
    if (i >= angles.length) return intensities[angles.length - 1];

    // 线性插值
    const x0 = angles[i - 1];
    const x1 = angles[i];
    const y0 = intensities[i - 1];
    const y1 = intensities[i];

    return y0 + (y1 - y0) * (targetAngle - x0) / (x1 - x0);
  }

  // 寻找峰位置
  findPeaks(data, threshold = 0.1) {
    const peaks = [];
    const maxIntensity = Math.max(...data);
    const minIntensity = Math.min(...data);
    const range = maxIntensity - minIntensity;
    
    for (let i = 1; i < data.length - 1; i++) {
      if (data[i] > data[i - 1] && data[i] > data[i + 1] && 
          data[i] > minIntensity + range * threshold) {
        peaks.push(i);
      }
    }
    return peaks;
  }

  // 计算峰位置的匹配度
  calculatePeakSimilarity(peaks1, peaks2) {
    if (peaks1.length === 0 || peaks2.length === 0) return 0;

    let matchCount = 0;
    const tolerance = 3; // 允许的峰位置偏差

    for (const peak1 of peaks1) {
      if (peaks2.some(peak2 => Math.abs(peak1 - peak2) <= tolerance)) {
        matchCount++;
      }
    }

    return 2 * matchCount / (peaks1.length + peaks2.length);
  }

  // 多维插值预测
  predictXRDPattern(params, patterns) {
    console.log('Predicting XRD pattern with params:', params);
    console.log('Using patterns:', patterns);

    const weights = this.calculateWeights(params, patterns);
    console.log('Calculated weights:', weights);

    const interpolatedPattern = this.interpolatePatterns(patterns, weights);
    console.log('Interpolated pattern sample:', interpolatedPattern.slice(0, 5));

    return interpolatedPattern;
  }

  // 计算权重
  calculateWeights(params, patterns) {
    console.log('Calculating weights for patterns:', patterns);
    
    const distances = patterns.map(pattern => {
      console.log('Processing pattern:', pattern);
      const dist = Math.sqrt(
        Object.keys(params).reduce((sum, key) => {
          console.log(`Comparing ${key}: params[${key}] = ${params[key]}, pattern[${key}] = ${pattern[key]}`);
          const diff = params[key] - pattern[key];
          return sum + diff * diff;
        }, 0)
      );
      return dist === 0 ? Infinity : 1 / dist;
    });

    console.log('Calculated distances:', distances);

    const totalWeight = distances.reduce((sum, dist) => sum + dist, 0);
    const weights = distances.map(dist => dist / totalWeight);
    
    console.log('Final weights:', weights);
    return weights;
  }

  // 插值多个 XRD 图谱
  interpolatePatterns(patterns, weights) {
    console.log('Interpolating patterns:', patterns);
    
    // 确保所有图谱都有数据
    if (!patterns || !patterns.length || !patterns[0].data) {
      console.error('Invalid patterns data:', patterns);
      throw new Error('Invalid patterns data');
    }

    try {
      // 确保所有图谱具有相同的角度范围和采样点
      const baseAngles = patterns[0].data.map(p => p['2THETA']);
      const interpolatedIntensities = new Array(baseAngles.length).fill(0);

      patterns.forEach((pattern, i) => {
        if (!pattern.data || !Array.isArray(pattern.data)) {
          console.error('Invalid pattern data:', pattern);
          throw new Error(`Invalid data for pattern ${i}`);
        }

        pattern.data.forEach((point, j) => {
          if (!point['Cnt2_D1']) {
            console.error('Invalid point data:', point);
            throw new Error(`Invalid point data at index ${j} in pattern ${i}`);
          }
          interpolatedIntensities[j] += point['Cnt2_D1'] * weights[i];
        });
      });

      return baseAngles.map((angle, i) => ({
        '2THETA': angle,
        'Cnt2_D1': interpolatedIntensities[i]
      }));
    } catch (error) {
      console.error('Error in interpolatePatterns:', error);
      throw error;
    }
  }

  interpolateWithSimulation(simulatedPattern, experimentalPatterns, weights) {
    // 确保数据完整性
    if (!simulatedPattern || !experimentalPatterns || !weights) {
      throw new Error('Invalid input data for interpolation');
    }

    // 获取角度范围
    const angles = simulatedPattern.map(p => p['2THETA']);
    const simulatedIntensities = simulatedPattern.map(p => p['Cnt2_D1']);

    // 将实验数据重采样到相同的角度范围
    const resampledPatterns = experimentalPatterns.map(pattern => {
      return this.resamplePattern(pattern.data, angles);
    });

    // 计算混合强度
    const interpolatedIntensities = angles.map((_, i) => {
      // 模拟数据的权重
      const simulationWeight = 0.4;
      
      // 模拟强度
      let intensity = simulatedIntensities[i] * simulationWeight;
      
      // 加入实验数据的贡献
      experimentalPatterns.forEach((_, j) => {
        intensity += resampledPatterns[j][i] * weights[j] * (1 - simulationWeight);
      });
      
      return intensity;
    });

    // 返回插值结果
    return angles.map((angle, i) => ({
      '2THETA': angle,
      'Cnt2_D1': interpolatedIntensities[i]
    }));
  }

  resamplePattern(pattern, targetAngles) {
    return targetAngles.map(angle => {
      return this.interpolateIntensity(
        pattern.map(p => p['2THETA']),
        pattern.map(p => p['Cnt2_D1']),
        angle
      );
    });
  }
}

export default InterpolationProcessor; 