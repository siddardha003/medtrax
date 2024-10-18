import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user/sass/style.scss';
import './user/sass/custom.scss';
import './user/sass1/index.scss';
import { BrowserRouter } from 'react-router-dom';



import 'slick-carousel/slick/slick.css';
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

