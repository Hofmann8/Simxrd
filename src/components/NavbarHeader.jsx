import React from 'react';
import { useNavigate } from 'react-router-dom';
import './NavbarHeader.css';

const NavbarHeader = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/');
  };

  return (
    <div className="navbar-header-container">
      <div className="navbar-header">
        <div className="navbar-logo sweep-effect">
          <span className="logo-text">XRD</span>
          <span className="hover-full-title">Sim<span className="gradient-x">X</span>RD<br />-DUT</span>
        </div>
      </div>
      <div className="header-overlay" onClick={handleClick}></div>
    </div>
  );
};

export default NavbarHeader;
