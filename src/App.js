import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomTitleBar from './components/CustomTitleBar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ReferenceStructure from './pages/ReferenceStructure';
import SimXRD from './pages/SimXRD';
import About from './pages/About';
import ConformationExplanation from './pages/ConformationExplanation';

function App() {
  const isElectron = window.electron !== undefined;

  // 在应用加载时，如果是Electron环境，添加electron-app类到body
  React.useEffect(() => {
    if (isElectron) {
      document.body.classList.add('electron-app');
    }
  }, [isElectron]);

  return (
    <div className="app-container">
      {/* 仅在Electron环境中显示自定义标题栏 */}
      <CustomTitleBar />
      <div className="app-content">
        <Router>
          {/* 添加Navbar组件 */}
          <Navbar />
          <Routes>
            <Route path="/" element={<SimXRD />} />
            <Route path="/reference-structure" element={<ReferenceStructure />} />
            <Route path="/conformation-explanation" element={<ConformationExplanation />} />
            <Route path="/about" element={<About />} />
            <Route path="/home" element={<Home />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App; 