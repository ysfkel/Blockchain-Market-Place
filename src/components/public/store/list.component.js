import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getWeb3Contract } from '../../../services/web3.service';

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
     componentDidMount() {
        
        getWeb3Contract().then((web3Contract)=>{
           
             web3Contract.web3.eth.getCoinbase((err, account) =>{
                 this.setState({account: account});
                  web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                    this.storeInstance = marketPlaceContractInstance;
                    marketPlaceContractInstance.getPublicStoreSize().then(result=>{
                        const count = result.toNumber()
                        
                        let stores = [];
                        for(let i=0; i<count; i++) {
                   
                            marketPlaceContractInstance.getPublicStore(i, {from:account}).then((storeResult)=>{
                             
                                const name = storeResult[0];
                                const description = storeResult[1];
                                stores.push({
                                    name,
                                    description
                                })
                                this.setState({stores: stores})
                            })
                        }
                     
                    })
               })
             
            })
         })
        }

    
    render() {
        const stores = this.state.stores.map((store, index)=>{
              return(<div key={index}>
                   <span>{store.name}</span> <span>{store.description}</span> 
                   <Link to={`/store-detail/${index}`}>details</Link>
                   <Link to={`/product/list/${index}`}>products</Link>
           
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
