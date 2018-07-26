
import * as actions from './actions';
import * as states from './state';
export const commonReducer = (state = states.CommonState, action) => {
  
   switch(action.type) {
       
        case actions.SET_ACCOUNT: {
              
              state = {
                  ...state,
                  account: action.payload
              }

              return state;
        }
        case actions.SET_MARKET_PLACE_CONTRACT: {
              
            state = {
                ...state,
                marketPlaceContractInstance: action.payload
            }

            return state;
       }
        default: {
            return state;
        }
   }
      
}
