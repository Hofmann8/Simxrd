import React from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import SimXRD from '../pages/SimXRD';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Main Application Page */}
        <Route path="/simxrd" element={<SimXRD />} />

        {/* Redirect "/" to "simxrd" */}
        <Route path="/" element={<Navigate replace to="/simxrd" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
