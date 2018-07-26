import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.container';
import { Provider } from 'react-redux';
import store from './app.store';

console.log('store', store)
ReactDOM.render(
    <Provider store={store}>
     <App />
     </Provider>,
    document.querySelector('#root')
 )
 