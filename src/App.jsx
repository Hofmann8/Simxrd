import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SimXRD from './pages/SimXRD';
import ReferenceStructure from './pages/ReferenceStructure';
import About from './pages/About';

function App() {
  return (
    <div className="app-wrapper">
      <div className="main-content">
        <TitleBar />
        <Router>
          <div className="content-wrapper">
            <Navbar />
            <div className="app-container">
              <div className="app-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/sim-xrd" element={<SimXRD />} />
                  <Route path="/reference-structure" element={<ReferenceStructure />} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </div>
            </div>
          </div>
        </Router>
      </div>
    </div>
  );
}

export default App;
