import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SimXRD from './pages/SimXRD';
import ReferenceStructure from './pages/ReferenceStructure';
import About from './pages/About';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <div className="app-layout">
          <Routes>
            <Route path="/" element={<SimXRD />} />
            <Route path="/home" element={<Home />} />
            <Route path="/reference-structure" element={<ReferenceStructure />} />
            <Route path="/about" element={<About />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
