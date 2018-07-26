import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getWeb3Contract } from '../../services/web3.service';

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
        
        getWeb3Contract().then((web3Contract)=>{
           
             web3Contract.web3.eth.getCoinbase((err, account) =>{
                 console.log('contractInstance yk 22',account );
                 this.setState({account: account});
               //    account="0x3b0b5ac5682fc83d82a632a157d3ba6afd3ace88"
                  //"0x01c490bb6e04066ce55aaf4168c2deb8efc19ea5"
                  web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                    this.storeInstance = marketPlaceContractInstance;
                    marketPlaceContractInstance.userStoresCount(account).then(result=>{
                        const count = result.toNumber()
                        console.log('==count', count)
                        
                        let stores = [];
                        console.log('== account', account)
                        for(let i=0; i<count; i++) {
                   
                            marketPlaceContractInstance.getOwnStore(i, {from:account}).then((storeResult)=>{
                             
                                const name = storeResult[0];
                                const description = storeResult[1];
                                stores.push({
                                    name,
                                    description
                                })
                                console.log('storeResult',storeResult)
                                this.setState({stores: stores})
                            })
                        }
                     
                    })
               })
             
            })
         })
        }

    deleteStore =(index) => {
         console.log('--index', index, this.state.account)
         if( this.storeInstance) {
               this.storeInstance.deleteStore(index, {from: this.state.account, gas: 3000000})
               .then((result)=>{
                      console.log('store deleted', result)
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
                   <Link to={`/store-detail/${index}`}>details</Link>
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
