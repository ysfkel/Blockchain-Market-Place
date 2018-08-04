import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getUserStoreCount } from './helper';
import * as appService  from '../../../services/app.service';
import { getStores } from './helper';

export default class StoreList extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
           account: '',
            stores: [],
            contractInstance:{}
        }
        this.storeInstance;
        this.deleteStore = this.deleteStore.bind(this);

    }
     componentDidMount() {
      
        appService.getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            this.storeInstance = contract;
            appService.getAccount((account) => {
                this.setState({account: account});
                  getStores(web3Contract,account).then((stores) => {
                     this.setState({stores})
                  });
            });
            
        });
      }

    deleteStore =(index) => {

         if( this.storeInstance) {
               this.storeInstance.deleteStore(index, {from: this.state.account, gas: 3000000})
               .then((result)=>{
              
                      this.setState(prev =>{
                            prev.stores = prev.stores.filter((store, _index)=>_index!==index);
                            return prev;
                      })
               }).catch((e)=>{
                      console.log('error', e)
               })
         }
    }
    
    render() {
        const stores = this.state.stores.map((store, index)=>{
              return(<div key={index}>
                   <span>{store.name}</span> <span>{store.description}</span> 
                   <Link to={`/edit-store/${index}`}>details</Link>
                   <Link to={`/product/list/${index}`}>products</Link>
                   <button  type="button" onClick={()=>this.deleteStore(index)}>delete</button>
                </div>)
        })
        return(
            <div>
            <h1>MANAGE STORES</h1>

            {stores}
            </div>
        )
    }
}
