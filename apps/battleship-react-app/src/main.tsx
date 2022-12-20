import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';
import './globals.css';
import 'battleship-ui/styles/themes.scss';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
