import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getWeb3Contract } from '../../../services/web3.service';

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


    componentDidMount() {
        
        getWeb3Contract().then((web3Contract)=>{
           
             web3Contract.web3.eth.getCoinbase((err, account) =>{
                 this.setState({account: account});
                web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                    this.storeInstance = marketPlaceContractInstance;
                    marketPlaceContractInstance.getPublicStoreSize().then(result=>{
                        const STORE_SIZE = result.toNumber();
                        const products = [];
                        for(let store_index=0; store_index<STORE_SIZE; store_index++) {
                           
                            marketPlaceContractInstance.getStoreProductsCountPublic(store_index, {from:account}).then(p_result=>{
                                const STORE_PRODUCTS_LIST_SIZE = p_result.toNumber();
                               
                                for(let product_index=0; product_index < STORE_PRODUCTS_LIST_SIZE; product_index++) {

                                    marketPlaceContractInstance.getStoreProductPublic(store_index,product_index, {from:account}).then((productResult)=>{
                                
                                        const name = productResult[0];
                                        const description = productResult[1];
                                        const price = productResult[2].toNumber();
                                        const quantity = productResult[3].toNumber();

                                 
                                        
                                        products.push({
                                            name,
                                            description,
                                            price,
                                            quantity
                                        })
                                        this.setState({products: products})
                                    });

                                }
                           });
                        }
                    })
                })
              })
        });
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