import { connect } from "react-redux";
import App from './App';
import * as dispatchers from './state-manager/action-dispatchers';

const mapStateToProps = (state, props) => {

   
     return {
       
   }
}

export const mapDispatchToProps = (dispatch)=>{
    
   return {
        setAccount: dispatchers.setAccountDispatcher(dispatch),
        setContract:dispatchers.setMarketPlaceContractInstanceDispatcher(dispatch)
   }
};

export default connect(mapStateToProps,mapDispatchToProps)(App);
