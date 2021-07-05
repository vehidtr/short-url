import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// console.log(window.location.pathname);
// if (window.location.pathname.length > 2)
//   window.location.href = `http://192.168.0.13:5000${window.location.pathname}`;
// else
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
