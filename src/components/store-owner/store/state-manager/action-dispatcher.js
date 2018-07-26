
import * as actionsCreators from 'action-creators';

export const GetUserStoresDispatcher=(dispatch)=>{
    return () =>{
        dispatch(actionsCreators.GetUserStores());
    }
}
