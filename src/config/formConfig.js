import { FaFlask, FaThermometerHalf, FaClock } from 'react-icons/fa';

export const formFields = {
  sio2: {
    label: 'SiO₂/Al₂O₃ 比例',
    icon: <FaFlask />,
    min: 0,
    max: 10,
    step: 0.1,
    tooltip: '硅铝比影响沸石的骨架结构'
  },
  na2o: {
    label: 'Na₂O/SiO₂ 比例',
    icon: <FaFlask />,
    min: 0,
    max: 10,
    step: 0.1,
    tooltip: '钠硅比影响结晶度'
  },
  h2o: {
    label: 'H₂O/SiO₂ 比例',
    icon: <FaFlask />,
    min: 0,
    max: 25,
    step: 0.5,
    tooltip: '水硅比影响晶化速率'
  },
  time: {
    label: '时间 (h)',
    icon: <FaClock />,
    min: 0,
    max: 24,
    step: 0.5,
    tooltip: '晶化时间影响结晶度'
  },
  temperature: {
    label: '温度 (°C)',
    icon: <FaThermometerHalf />,
    min: 50,
    max: 110,
    step: 5,
    tooltip: '晶化温度影响晶体形貌'
  }
}; 