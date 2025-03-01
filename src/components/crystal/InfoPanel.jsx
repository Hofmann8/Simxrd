import React from 'react';
import { infoPanelStyles } from './styles';

const InfoPanel = ({ structureInfo, atomCount, bondCount }) => {
  return (
    <div className="info-panel" style={infoPanelStyles.panel}>
      <h3 style={infoPanelStyles.title}>结构信息</h3>
      
      <div className="info-section" style={infoPanelStyles.section}>
        <h4 style={infoPanelStyles.sectionTitle}>基本信息</h4>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>类型:</span>
          <span style={infoPanelStyles.value}>{structureInfo.type}</span>
        </div>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>空间群:</span>
          <span style={infoPanelStyles.value}>{structureInfo.spaceGroup}</span>
        </div>
      </div>
      
      <div className="info-section" style={infoPanelStyles.section}>
        <h4 style={infoPanelStyles.sectionTitle}>晶胞参数</h4>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>晶胞边长:</span>
          <span style={infoPanelStyles.value}>{structureInfo.cellParams}</span>
        </div>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>晶胞角度:</span>
          <span style={infoPanelStyles.value}>{structureInfo.cellAngles}</span>
        </div>
      </div>
      
      <div className="info-section" style={infoPanelStyles.section}>
        <h4 style={infoPanelStyles.sectionTitle}>物理特性</h4>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>Si/Al比:</span>
          <span style={infoPanelStyles.value}>{structureInfo.siAlRatio}</span>
        </div>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>孔径:</span>
          <span style={infoPanelStyles.value}>{structureInfo.poreSize}</span>
        </div>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>比表面积:</span>
          <span style={infoPanelStyles.value}>{structureInfo.surfaceArea}</span>
        </div>
      </div>
      
      <div className="info-section" style={infoPanelStyles.section}>
        <h4 style={infoPanelStyles.sectionTitle}>应用</h4>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.value}>{structureInfo.applications}</span>
        </div>
      </div>
      
      <div className="info-section" style={infoPanelStyles.section}>
        <h4 style={infoPanelStyles.sectionTitle}>统计数据</h4>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>原子数:</span>
          <span style={infoPanelStyles.value}>{atomCount}</span>
        </div>
        <div className="info-item" style={infoPanelStyles.item}>
          <span style={infoPanelStyles.label}>键数:</span>
          <span style={infoPanelStyles.value}>{bondCount}</span>
        </div>
      </div>
    </div>
  );
};

export default InfoPanel; 