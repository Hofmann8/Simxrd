import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFlask, FaCubes, FaTable, FaInfoCircle } from 'react-icons/fa';
import NavbarHeader from './NavbarHeader';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-header-container">
        <NavbarHeader /> {/* 顶部居中的标题 */}
      </div>
      <div className="navbar-buttons-container">
        <ul>
          <li className={location.pathname === "/simxrd" ? "active" : ""}>
            <Link to="/simxrd">
              <FaFlask size={24} />
              <span className="tooltip-text">SimXRD</span>
            </Link>
          </li>
          <li className={location.pathname === "/reference-structure" ? "active" : ""}>
            <Link to="/reference-structure">
              <FaCubes size={24} />
              <span className="tooltip-text">参考晶体结构</span>
            </Link>
          </li>
          <li className={location.pathname === "/conformation-explanation" ? "active" : ""}>
            <Link to="/conformation-explanation">
              <FaTable size={24} />
              <span className="tooltip-text">解释和对照表格</span>
            </Link>
          </li>
          <li className={location.pathname === "/about" ? "active" : ""}>
            <Link to="/about">
              <FaInfoCircle size={24} />
              <span className="tooltip-text">其他信息</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
