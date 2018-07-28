import React, { Component }from 'react';
import { getWeb3Contract } from '../../../services/web3.service';
import {  Link  } from 'react-router-dom';

class ProductList extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
            products: [],
              contractInstance:{}
        }
    }

    componentDidMount() {
        
        getWeb3Contract().then((web3Contract)=>{
           
             web3Contract.web3.eth.getCoinbase((err, account) =>{
                 console.log('contractInstance yk 22 ppp',account );
               //    account="0x3b0b5ac5682fc83d82a632a157d3ba6afd3ace88"
                  //"0x01c490bb6e04066ce55aaf4168c2deb8efc19ea5"
                  web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                      this.storeInstance = marketPlaceContractInstance;
                    marketPlaceContractInstance.getStoreProductsCount(this.props.storeId, {from:account}).then(result=>{
                        const count = result.toNumber()
                        this.setState({account: account});
                        
                        let products = [];
                  
                        for(let i=0; i<count; i++) {
                    
                            marketPlaceContractInstance.getUserStoreProduct(this.props.storeId,i, {from:account}).then((result)=>{
                          
                                const name = result[0];
                                const description = result[1];
                                const price = result[2].toNumber();
                                const quantity = result[3].toNumber();
                                console.log('contractInstance yk 22 result',result );
                                products.push({
                                    name,
                                    description,
                                    price,
                                    quantity
                                })
                                this.setState({products: products})
                            })
                        }
                     
                    })
               })
             
            })
         })
        }

        deleteProduct =(index) => {
            console.log('--index', index, this.state.account)
            if( this.storeInstance) {
                  this.storeInstance.deleteProduct(this.props.storeId,
                    index, {from: this.state.account, gas: 3000000})
                  .then((result)=>{
                         console.log('store deleted', result)
                         this.setState(prev =>{
                               prev.products = prev.products.filter((p, _index)=>_index!==index);
                               return prev;
                         })
                  }).catch((e)=>{
                         console.log('error', e)
                  })
            }
       }

   //
    render() {
        const products = this.state.products.map((p, index)=>{
            return(<div key={index}>
                 <span>{p.name}</span> <span>{p.description}</span>  <span>{p.price}</span>   <span>{p.quantity}</span> 
                 <Link to={`/product/add/${this.props.storeId}/${index}`}>edit</Link>
                 <button  type="button" onClick={()=>this.deleteProduct(index)}>delete</button>
             
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

export default ProductList;