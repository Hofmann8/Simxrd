import React from 'react';
import CrystalStructureDisplay from './crystal/CrystalStructureDisplay';

// 重定向到新的组件
export default function LegacyCrystalStructureDisplay(props) {
  return <CrystalStructureDisplay {...props} />;
} 