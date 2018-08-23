import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';
import * as helper from './helper';

export default class ProductEdit extends Component{
      
    constructor(props) {
        super(props);

        this.state={
            name:'',
            description:'',
            price:0,
            quantity:0,
            priceInSpinelToken: 0,
            account:''
        }
        this.web3;
        this.productNameInput='name';
        this.productDescriptionInput='description';
        this.productPriceInput='price';
        this.productQuantityInput='quantity';
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
    }

    componentDidMount=() => { 
        const { storeId , productId } = this.props;   
        const storeIndex = storeId;            
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
            this.web3 = web3;
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account, storeIndex});
                if(storeId && productId) {
                  REPO.getProduct({ contract, web3 ,account, storeId, productId})
                  .then((product) => {
                      this.setState({...product})
                  });
                }
            });
            
        })
     }

     isUpdatable=()=> {
           return this.state.storeIndex!==undefined && this.state.productId !=undefined;
     }

     handleSubmit = (e) => {
        e.preventDefault();
        if( this.storeInstance ) {
           let { name,quantity, price,priceInSpinelToken, description, productId, storeIndex, account} = this.state;
            console.log('---prod price', price)
            price = this.web3.toWei(price);
         if(this.isUpdatable()) {
            const { productId} = this.state;
            const contract = this.storeInstance;
            REPO.editProduct({ name, price,priceInSpinelToken,quantity ,description, productId, storeIndex, account, contract}).then(r=>console.log)
            .catch(console.log);
         } else {
           //  const { name,quantity, price, priceInSpinelToken,description, account} = this.state;
             const storeIndex = this.props.storeId;
           
            REPO.createProduct({ name, price, priceInSpinelToken,quantity,description, account, storeIndex},this.storeInstance).then(r=>console.log)
             .catch(console.log);
        }
      }
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

    handlePriceChange = (e) => {
        e.preventDefault();
        
        const name =  e.target.name;
        const value = e.target.value;
        if(value > -1) {
              console.log('value amount--', value)
        const tokens = helper.etherToSpinel({value, web3});
         console.log('token amount', tokens)
        this.setState(prev=>{
                prev['price']= value;
                prev['priceInSpinelToken'] = tokens;
                return {...prev}
        })
        }
      
        
    }

    //etherToSpinel

    render() {
        return(
            <div>
                <h1>Product Details</h1>

                <form onSubmit={this.handleSubmit}>
                   <div>
                       <input type="text" placeholder="name" name={this.productNameInput} value={this.state.name} onChange={this.handleChange}/>
                    </div>

                     <div>
                      <input type="number" placeholder="price" name={this.productPriceInput} value={this.state.price} onChange={this.handlePriceChange}/>
                    </div>

                      <div>
                      <input type="number" placeholder="price in spinel" name={'priceInSpinelToken'} value={this.state.priceInSpinelToken} />
                    </div>
                    <div>
                      <input type="number" placeholder="quantity" name={this.productQuantityInput} value={this.state.quantity} onChange={this.handleChange}/>
                    </div>
                    <div>
                        <textarea name={this.productDescriptionInput}  value={this.state.description} onChange={this.handleChange}></textarea>
                    </div>

                   

                    <div>
                       <button type="submit">Save</button>
                   </div>
                </form>
            </div>
        );
    }
}