import React from 'react';
import ReactDOM from 'react-dom/client';
import WeatherDescription from './components/pages/home';
import "./styles/index.css";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <WeatherDescription />
  </React.StrictMode>
);
