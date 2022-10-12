import React from 'react';
import { Provider } from 'react-redux';
import { store }from './redux/app/store';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './index.css';


import ReactDOM from "react-dom/client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { fetchProducts } from './redux/reducers/productsSlice';

const container = document.getElementById('root')!;
const root = ReactDOM.createRoot(container);
root.render(

    
      <Provider store={store}>

      <App />
   
    </Provider>
    
  


);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
