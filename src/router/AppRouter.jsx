import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import Navbar from '../components/Navbar';
import SimXRD from '../pages/SimXRD';
import ReferenceStructure from '../pages/ReferenceStructure';
import ConformationExplanation from '../pages/ConformationExplanation';
import About from '../pages/About';
import './AppRouter.css';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <TransitionGroup component={null}>
      <CSSTransition
        key={location.key}
        classNames="fade"
        timeout={300}
        unmountOnExit
      >
        <Routes location={location}>
          <Route path="/simxrd" element={<SimXRD />} />
          <Route path="/reference-structure" element={<ReferenceStructure />} />
          <Route path="/conformation-explanation" element={<ConformationExplanation />} />
          <Route path="/about" element={<About />} />
          <Route path="/" element={<Navigate replace to="/simxrd" />} />
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
}

function AppRouter() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <div className="content">
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default AppRouter;
