import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/styles.scss'
import App from './App';
import reportWebVitals from './reportWebVitals';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import 'swiper/swiper-bundle.min.css';
import 'swiper/swiper.min.css';

// import 'swiper'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
