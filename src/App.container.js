import { connect } from "react-redux";
import App from './App';
import * as dispatchers from './state-manager/action-dispatchers';

const mapStateToProps = (state, props) => {

    console.log('-state 2', state)
     return {
       
   }
}

export const mapDispatchToProps = (dispatch)=>{
    console.log('dispatch',dispatch)
   return {
        setAccount: dispatchers.setAccountDispatcher(dispatch),
        setContract:dispatchers.setMarketPlaceContractInstanceDispatcher(dispatch)
   }
};

export default connect(mapStateToProps,mapDispatchToProps)(App);
