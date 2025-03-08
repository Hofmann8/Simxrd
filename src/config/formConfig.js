import { FaFlask, FaThermometerHalf, FaClock } from 'react-icons/fa';

export const formFields = {
  sio2: {
    label: 'SiO₂/Na₂O',
    icon: <FaFlask />,
    min: 2.0,
    max: 10.0,
    step: 0.1,
    tooltip: 'SiO₂/Na₂O 比值范围：2.0-10.0',
    commonRange: { min: 3.0, max: 6.0 },
    specialValues: [
      { value: 3.0, label: 'A型' },
      { value: 5.0, label: 'FAU' },
      { value: 7.0, label: 'SOD' }
    ]
  },
  na2o: {
    label: 'Na₂O/Al₂O₃',
    icon: <FaFlask />,
    min: 1.7,
    max: 12.0,
    step: 0.1,
    tooltip: 'Na₂O/Al₂O₃ 比值范围：1.7-12.0',
    commonRange: { min: 2.0, max: 6.0 },
    specialValues: [
      { value: 2.0, label: '标准值' },
      { value: 6.0, label: 'SOD' },
      { value: 10.0, label: 'CAN' }
    ]
  },
  h2o: {
    label: 'H₂O/Na₂O',
    icon: <FaFlask />,
    min: 5.0,
    max: 20.0,
    step: 0.5,
    tooltip: 'H₂O/Na₂O 比值范围：5.0-20.0',
    commonRange: { min: 8.0, max: 15.0 },
    specialValues: [
      { value: 10.0, label: '标准值' },
      { value: 5.0, label: '低水' },
      { value: 15.0, label: '高水' }
    ]
  },
  time: {
    label: '晶化时间 (h)',
    icon: <FaClock />,
    min: 1.0,
    max: 24.0,
    step: 0.5,
    tooltip: '晶化时间范围：1.0-24.0 小时',
    commonRange: { min: 3.0, max: 12.0 },
    specialValues: [
      { value: 48.0, label: '48h' },
      { value: 72.0, label: '72h' },
      { value: 96.0, label: '96h' }
    ]
  },
  temperature: {
    label: '晶化温度 (°C)',
    icon: <FaThermometerHalf />,
    min: 60.0,
    max: 120.0,
    step: 5,
    tooltip: '晶化温度范围：60.0-120.0 °C',
    commonRange: { min: 80.0, max: 100.0 },
    specialValues: [
      { value: 90.0, label: '标准' },
      { value: 120.0, label: '高温' },
      { value: 60.0, label: '低温' }
    ]
  }
};

// 特殊时间值的预设参数
export const specialTimePresets = [
  {
    time: 48.0,
    sio2: 3.0,
    na2o: 2.0,
    h2o: 10.0,
    temperature: 90.0,
    description: '48小时晶化实验参数'
  },
  {
    time: 72.0,
    sio2: 3.0,
    na2o: 2.0,
    h2o: 10.0,
    temperature: 90.0,
    description: '72小时晶化实验参数'
  },
  {
    time: 96.0,
    sio2: 3.0,
    na2o: 2.0,
    h2o: 10.0,
    temperature: 90.0,
    description: '96小时晶化实验参数'
  }
];

// 添加其他参数的特殊预设
export const specialPresets = {
  sio2: {
    3.0: { description: '标准SiO₂/Na₂O比值，适合合成A型沸石' },
    5.0: { description: 'FAU型沸石的最佳SiO₂/Na₂O比值' },
    7.0: { description: 'SOD型沸石的最佳SiO₂/Na₂O比值' }
  },
  na2o: {
    2.0: { description: '标准Na₂O/Al₂O₃比值，适合大多数沸石合成' },
    6.0: { description: 'SOD型沸石的最佳Na₂O/Al₂O₃比值' },
    10.0: { description: 'CAN型沸石的最佳Na₂O/Al₂O₃比值' }
  },
  h2o: {
    5.0: { description: '低水条件，有利于高硅沸石的形成' },
    10.0: { description: '标准水含量，适合大多数沸石合成' },
    15.0: { description: '高水条件，有利于低硅沸石的形成' }
  },
  temperature: {
    60.0: { description: '低温晶化，有利于形成亚稳态沸石相' },
    90.0: { description: '标准晶化温度，适合大多数沸石合成' },
    120.0: { description: '高温晶化，有利于形成热力学稳定相' }
  }
}; 