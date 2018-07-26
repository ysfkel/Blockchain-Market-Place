import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AppReducer } from './app.reducer';

export default createStore(
     AppReducer,
     composeWithDevTools(applyMiddleware(thunk))
)
