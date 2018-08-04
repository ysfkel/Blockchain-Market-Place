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
            account:''
        }
        this.productNameInput='name';
        this.productDescriptionInput='description'
        this.productPriceInput='price'
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount=() => { 
        const { storeId , productId } = this.props;               
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
 
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account});
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
         if(this.isUpdatable()) {
            const { name, price, description, productId, storeIndex, account} = this.state;
            const contract = this.storeInstance;
            REPO.editProduct({ name, price, description, productId, storeIndex, account, contract}).then(r=>console.log)
            .catch(console.log);
         } else {
             const { name, price, description, account} = this.state;
             const storeIndex = this.props.storeId;
            REPO.createProduct({ name, price, description, account, storeIndex},this.storeInstance).then(r=>console.log)
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

    render() {
        return(
            <div>
                <h1>Product Details</h1>

                <form onSubmit={this.handleSubmit}>
                   <div>
                       <input type="text" name={this.productNameInput} value={this.state.name} onChange={this.handleChange}/>
                    </div>

                     <div>
                      <input type="number" name={this.productPriceInput} value={this.state.price} onChange={this.handleChange}/>
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