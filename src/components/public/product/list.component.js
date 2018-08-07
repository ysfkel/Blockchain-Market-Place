import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getWeb3Contract } from '../../../services/web3.service';
import { getAccount, getWebContract} from '../../../services/app.service';
 import { getProducts } from './repo';

export default class ProductsListPublic extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
            account: '',
          products: [],
            contractInstance:{}
      }
        this.storeInstance;

    }

    componentDidMount=() => { 
                 
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;

            const { storeId, accountId } = this.props;
 
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account});
                getProducts({account, storeIndex: storeId, accountIndex: accountId,  web3, contract} ).then((products) => {
                    console.log('products',products)
                    this.setState({products: products})
                 });
                
            });
            
        })
     }
    
    render() {
        const products = this.state.products.map((p, index)=>{
            return(<div key={index}>
                 <span>{p.name}</span> <span>{p.description}</span>  <span>{p.price}</span>   <span>{p.quantity}</span> 

             
              </div>)
          })
        return(
            <div>
              <h1>PRODUCT LIST</h1>
              <p>
              {products}
              </p>
            </div>
        );
    }
}


/**
 *  
 */