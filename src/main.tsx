import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Splitter from './splitter/splitter';

if(Splitter.exchanges.length === 0) {
  Splitter.init();
}
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
