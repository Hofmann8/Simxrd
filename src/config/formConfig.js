import { FaFlask, FaThermometerHalf, FaClock } from 'react-icons/fa';

export const formFields = {
  sio2: {
    label: 'SiO₂/Na₂O',
    icon: <FaFlask />,
    min: 2.0,
    max: 10.0,
    step: 0.1,
    tooltip: 'SiO₂/Na₂O 比值范围：2.0-10.0',
    commonRange: { min: 2.0, max: 8.0 }
  },
  na2o: {
    label: 'Na₂O/Al₂O₃',
    icon: <FaFlask />,
    min: 1.7,
    max: 12.0,
    step: 0.1,
    tooltip: 'Na₂O/Al₂O₃ 比值范围：1.7-12.0',
    commonRange: { min: 1.7, max: 10.0 }
  },
  h2o: {
    label: 'H₂O/Na₂O',
    icon: <FaFlask />,
    min: 1.0,
    max: 15.0,
    step: 0.5,
    tooltip: 'H₂O/Na₂O 比值范围：1.0-15.0',
    commonRange: { min: 5.0, max: 15.0 }
  },
  time: {
    label: '晶化时间 (h)',
    icon: <FaClock />,
    min: 1.0,
    max: 24.0,
    step: 0.5,
    tooltip: '晶化时间范围：1.0-24.0 小时',
    commonRange: { min: 1.0, max: 12.0 },
    specialValues: [
      { value: 48.0, label: '48h' },
      { value: 72.0, label: '72h' },
      { value: 96.0, label: '96h' }
    ]
  },
  temperature: {
    label: '晶化温度 (°C)',
    icon: <FaThermometerHalf />,
    min: 50.0,
    max: 150.0,
    step: 5,
    tooltip: '晶化温度范围：50.0-150.0 °C',
    commonRange: { min: 70.0, max: 120.0 }
  }
}; 