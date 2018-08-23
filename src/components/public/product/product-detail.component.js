import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';

export default class ProductDetail extends Component{
      
    constructor(props) {
        super(props);

        this.state={
            name:'',
            description:'',
            price:0,
            quantity:0,
            purchasedQuantity: 0,
            account:''
        }
  
        this.productQuantityInput='purchasedQuantity';
        this.handleAdToCart = this.handleAdToCart.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount=() => { 
        const { storeId , productId , accountId} = this.props;  
        const storeIndex = storeId;
        const vendorAccountId = accountId;             
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
 
            this.storeInstance = contract;
            getAccount((account) => {
                 this.setState({account: account, storeIndex});
                if(storeId && productId) {
                    REPO.getProduct({ vendorAccountId,contract, web3 ,account, storeId, productId})
                  .then((product) => {
                      console.log('--product', product)
                      this.setState({...product})
                  });
                }
            });
            
        })
     }

    //  isUpdatable=()=> {
    //        return this.state.storeIndex!==undefined && this.state.productId !=undefined;
    //  }
    //  export const addItemToCart = ({vendorAccount,  storeIndex,  productId,  productQuantity, contract}) => {
    //     return new Promise((resolve, reject) => {
    //         contract.addItemToCart(vendorAccount, storeIndex, productId, productQuantity,  {from: account, gas: 3000000}).then((reesult) => {
    //               resolve();
    //         })
    //     });
    // }
     handleAdToCart = (e) => {
         console.log('-HIT')
        e.preventDefault();
            const { vendor,  storeIndex,  productId, purchasedQuantity, account } = this.state;
            const contract = this.storeInstance;
            REPO.addItemToCart({ vendor,  storeIndex,  productId, purchasedQuantity  , account, contract}).then(r=>console.log)
            .catch(console.log);
        
        //   else {
        //      const { name,quantity, price, description, account} = this.state;
        //      const storeIndex = this.props.storeId;
        //     REPO.createProduct({ name, price, quantity,description, account, storeIndex},this.storeInstance).then(r=>console.log)
        //      .catch(console.log);
        // }
      
    }


    handleChange = (e) => {
        e.preventDefault();
        const name =  e.target.name;
        const value = e.target.value;
        this.setState(prev=>{
                prev[name]= value;
                return {...prev}
        })
        
    }

    render() {
        return(
            <div>
                <h1>Product Details</h1>
                   <div>
                       <strong> {this.state.name} </strong>
                    </div>

                     <div>
                      <strong> {this.state.price} </strong>
                    </div>
                    <div>
                      <strong> {this.state.quantity} </strong>
                    </div>
                    <div>
                        <strong> {this.state.description}</strong>
                    </div>

                   

                    <div>
                       <form onSubmit={this.handleAdToCart}>
                       <input type="text" placeholder="name" name={this.productQuantityInput} value={this.state.purchasedQuantity} onChange={this.handleChange}/>
                    
                       <button type="submit">Add to cart</button>
                       </form>
                   </div>
   
            </div>
        );
    }
}

