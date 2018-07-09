import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import StockSite from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';


ReactDOM.render(<StockSite />, document.getElementById('root'));
registerServiceWorker();
