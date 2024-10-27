// src/index.js
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// 引入 Bootstrap 样式
import 'bootstrap/dist/css/bootstrap.min.css';

// 引入自定义 CSS
import './styles/style.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
