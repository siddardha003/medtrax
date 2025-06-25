import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'antd/dist/reset.css';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './user/sass/style.scss';
import './user/sass/custom.scss';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './Redux/store';
import axios from 'axios';


import 'slick-carousel/slick/slick.css';

axios.defaults.baseURL = 'http://localhost:5003';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

