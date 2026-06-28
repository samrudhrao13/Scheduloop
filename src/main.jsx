import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import InitPage from './InitPage';

const isInitPage = window.location.pathname === '/init';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {isInitPage ? <InitPage /> : <App />}
  </React.StrictMode>
);