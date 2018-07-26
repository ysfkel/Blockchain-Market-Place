
import * as actions from './actions';

export const GetUserStores= (payload)=> {
   
    return {
        type: actions.GET_USER_STORES,
        payload: payload
    };
} 
