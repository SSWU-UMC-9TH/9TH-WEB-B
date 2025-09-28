import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';   // ✅ Tailwind 불러오는 핵심 부분

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
