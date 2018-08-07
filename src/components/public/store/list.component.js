import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';

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
                      console.log('--stores',stores)
                       this.setState({stores})
                  });
                
            });
            
        })
     }
  
    
    render() {
        const stores = this.state.stores.map((store, index)=>{
              return(<div key={index}>
                   <span>{store.name}</span> <span>{store.description}</span> 
                   <Link to={`/store-detail/${index}`}>details</Link>
                   <Link to={`/products-catalog/${store.actIdx}/${store.storeId}`}>products</Link>
           
                </div>)
        })
        return(
            <div>
            <h3> STORES LIST</h3>

            {stores}
            </div>
        )
    }
}
