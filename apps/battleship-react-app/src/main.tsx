import React from 'react';
import ReactDOM from 'react-dom/client';

import 'sanitize.css';
import 'sanitize.css/forms.css';
import 'sanitize.css/typography.css';

import 'battleship-ui/styles/themes.scss';

import App from './App';
import './globals.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
