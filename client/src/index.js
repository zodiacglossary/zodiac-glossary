import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';

import App from './App';

const loadError = ReactDOM.createRoot(document.getElementById('loadError'))
loadError.render(<></>);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter
      future={{
        v7_relativeSplatPath: true, // Prepare for breaking changes in v7
        v7_startTransition: true, // Prepare for breaking changes in v7
      }}
    >
      <App />
    </BrowserRouter>
  // </React.StrictMode>
);