
import * as actionsCreators from './action-creators';

export const setAccountDispatcher=(dispatch)=>{
    return (account) =>{
        dispatch(actionsCreators.SetAccountAction(account));
    }
}

export const setMarketPlaceContractInstanceDispatcher=(dispatch)=>{
    return (contractInstance, callback) =>{
       return new Promise(res=>{
               dispatch(actionsCreators.SetMarketPlaceContractInstanceAction(contractInstance),()=>{
               
           });
        callback();
       })
       
      
        
    }
}

