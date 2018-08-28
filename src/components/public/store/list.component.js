import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';
import StoreListItem from './item.component';
import * as styles from './styles';

export default class StoreListPublic extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
           account: '',
            stores: [],
            contractInstance:{}
        }
        this.storeInstance;

    }

    componentDidMount=() => { 
                 
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
 
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account});
       
                  REPO.getStore({ contract, web3 ,account})
                  .then((stores) => {
                   
                       this.setState({stores})
                  });
                
            });
            
        })
     }
  
    
    render() {
        const stores = this.state.stores.map((store, index)=>{
              return(
                   <div key={index} style={styles.storeItemContainer} >
                     <StoreListItem store={store}/>
                   </div>
                )
        })
        return(
            <div>
            <h1> STORES LIST</h1>

            {stores}
            </div>
        )
    }
}
