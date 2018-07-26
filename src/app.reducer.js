import { combineReducers } from 'redux';
import { Reducer } from 'redux';
import { storeReducer } from './components/store-owner/store/state-manager/reducer';
import { commonReducer } from './state-manager/reducer';
//import { web3Redux } from 'web3-redux';


export const AppReducer=combineReducers({
  //  web3Redux: web3Redux,
    common: commonReducer,
    userStore: storeReducer
})
