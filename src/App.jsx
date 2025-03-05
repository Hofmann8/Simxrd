import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CustomTitleBar from './components/CustomTitleBar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SimXRD from './pages/SimXRD';
import ReferenceStructure from './pages/ReferenceStructure';
import About from './pages/About';
import ConformationExplanation from './pages/ConformationExplanation';

function App() {
  const isElectron = window.electron !== undefined;

  React.useEffect(() => {
    if (isElectron) {
      document.body.classList.add('electron-app');
    }
  }, [isElectron]);

  return (
    <div className="app-container">
      {isElectron && <CustomTitleBar />}
      <div className="app-content">
        <Router>
          <Navbar />
          <div className="app-layout">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/sim-xrd" element={<SimXRD />} />
              <Route path="/reference-structure" element={<ReferenceStructure />} />
              <Route path="/conformation-explanation" element={<ConformationExplanation />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
