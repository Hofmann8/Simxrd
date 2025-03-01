import React, { useState } from 'react';
import CrystalStructureDisplay from '../components/crystal';

const ReferenceStructure = () => {
  const [selectedStructure, setSelectedStructure] = useState(null); // 初始状态为 null，表示未选择
  
  const structures = [
    { id: 'FAU', name: 'Y型分子筛 (FAU)' },
    { id: 'LTA', name: 'A型分子筛 (LTA)' },
    { id: 'SOD', name: '方钠石 (SOD)' }
  ];

  const handleStructureSelect = (id) => {
    setSelectedStructure(id);
  };

  return (
    <div className="reference-container">
      <style>{`
        .reference-container {
          padding: 2rem;
          max-width: 100%;
          margin: 0 auto;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          min-height: calc(100vh - 80px);
          overflow-x: hidden;
        }

        .structure-selector {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .structure-btn {
          padding: 0.75rem 1.5rem;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.2s;
          color: #495057;
          font-weight: 500;
          min-width: 180px;
          text-align: center;
          flex: 0 1 auto;
        }

        .structure-btn:hover {
          background: #e9ecef;
          border-color: #ced4da;
        }

        .structure-btn.active {
          background: #0d6efd;
          border-color: #0d6efd;
          color: white;
        }

        .welcome-message {
          text-align: center;
          margin-top: 4rem;
          color: #6c757d;
        }

        .welcome-title {
          font-size: 1.75rem;
          margin-bottom: 1rem;
          color: #343a40;
        }

        .welcome-description {
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        /* 响应式布局 */
        @media (max-width: 768px) {
          .structure-btn {
            min-width: 120px;
            padding: 0.5rem 1rem;
            flex: 1 1 30%;
          }
          
          .reference-container {
            padding: 1rem;
          }
        }

        @media (max-width: 576px) {
          .structure-btn {
            flex: 1 1 100%;
          }
          
          .structure-selector {
            flex-direction: column;
            width: 100%;
          }
        }
      `}</style>
      
      <div className="structure-selector">
        {structures.map(structure => (
          <button
            key={structure.id}
            className={`structure-btn ${selectedStructure === structure.id ? 'active' : ''}`}
            onClick={() => handleStructureSelect(structure.id)}
          >
            {structure.name}
          </button>
        ))}
      </div>
      
      {selectedStructure ? (
        <CrystalStructureDisplay filePath={`/xyz_data/${selectedStructure}.xyz`} />
      ) : (
        <div className="welcome-message">
          <h2 className="welcome-title">欢迎使用晶体结构查看器</h2>
          <p className="welcome-description">
            请从上方选择一种晶体结构进行查看。您可以查看不同类型的分子筛结构，了解它们的晶体学特性和应用领域。
          </p>
        </div>
      )}
    </div>
  );
};

export default ReferenceStructure;
