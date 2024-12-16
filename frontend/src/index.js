import React from 'react';
import ReactDOM from 'react-dom/client';  // Use the new client import
import './index.css';
import App from './App';
import 'bootswatch/dist/lux/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));  // Create a root
root.render(  // Use render method on the root object
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

