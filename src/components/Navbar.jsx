import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaFlask, FaCubes, FaTable, FaInfoCircle, FaHome } from 'react-icons/fa';
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
          <li className={location.pathname === "/" ? "active" : ""}>
            <Link to="/">
              <FaFlask size={24} />
              <span className="tooltip-text">XRD模拟</span>
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
          <li className={location.pathname === "/home" ? "active" : ""}>
            <Link to="/home">
              <FaHome size={24} />
              <span className="tooltip-text">首页</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* 版权信息部分 */}
      <div className="navbar-footer">
        <div className="copyright-info">
          <p className="copyright-text">
            <span className="copyright-year">© 2024</span>
            <br className="copyright-break" />
            <span className="copyright-name">Lin Kai</span>
          </p>
          <p className="license-text">
            MIT License
          </p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
