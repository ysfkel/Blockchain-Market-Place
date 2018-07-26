import React, { Component }from 'react';
import { getWeb3Contract } from '../../../../services/web3.service';
import {  Link  } from 'react-router-dom';

class VendorList extends Component {
       
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
                 console.log('contractInstance yk 22',account );
                  web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                      this.storeInstance = marketPlaceContractInstance;
                      console.log('marketPlaceContractInstance', marketPlaceContractInstance)
                    marketPlaceContractInstance.getPendingVendorsCount.call({from:account}).then(result=>{
                        const count = result.toNumber()
                        this.setState({account: account});
                        console.log('--pending vendors', result)
                        let products = [];
                  
                        for(let i=0; i<count; i++) {
                    
                            marketPlaceContractInstance.getPendingVendorByIndex.call(i, {from:account}).then((result)=>{
                               console.log('--result', result)
                                // const name = result[0];
                                // const description = result[1];
                                // const price = result[2].toNumber();
                                // const quantity = result[3].toNumber();
                                
                                // products.push({
                                //     name,
                                //     description,
                                //     price,
                                //     quantity
                                // })
                              //  this.setState({products: products})
                            })
                        }
                     
                    })
               })
             
            })
         })
        }

    //     deleteProduct =(index) => {
    //         console.log('--index', index, this.state.account)
    //         if( this.storeInstance) {
    //               this.storeInstance.deleteProduct(this.props.storeId,
    //                 index, {from: this.state.account, gas: 3000000})
    //               .then((result)=>{
    //                      console.log('store deleted', result)
    //                      this.setState(prev =>{
    //                            prev.products = prev.products.filter((p, _index)=>_index!==index);
    //                            return prev;
    //                      })
    //               }).catch((e)=>{
    //                      console.log('error', e)
    //               })
    //         }
    //    }

    render() {
        return(
            <div>
              <h1>VENDOR LIST</h1>
              <p>
          
              </p>
            </div>
        );
    }

}

export default VendorList;


/**
 *   render() {
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
 */