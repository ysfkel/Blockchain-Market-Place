
import * as actions from './actions';

export const SetAccountAction= (payload)=> {
    return {
        type: actions.SET_ACCOUNT,
        payload: payload
    };
} 

export const SetMarketPlaceContractInstanceAction= (payload, callback)=> {
   
    return {
        type: actions.SET_MARKET_PLACE_CONTRACT,
        payload: payload
    };
    callback();
} 

