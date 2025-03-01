import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import About from '../pages/About';
import SimXRD from '../pages/SimXRD';
import ConformationExplanation from '../pages/ConformationExplanation';
import ReferenceStructure from '../pages/ReferenceStructure';
import './AppRouter.css';

const AppRouter = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<SimXRD />} />
            <Route path="/simxrd" element={<SimXRD />} />
            <Route path="/about" element={<About />} />
            <Route path="/conformation" element={<ConformationExplanation />} />
            <Route path="/reference-structure" element={<ReferenceStructure />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default AppRouter;
