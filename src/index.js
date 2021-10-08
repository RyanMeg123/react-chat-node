import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App.jsx';
import { ContextProvider } from './context/index.jsx';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <ContextProvider>
    <App />
  </ContextProvider>,
  document.getElementById('app')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
