import React, { Component } from 'react';
import { getWeb3Contract } from '../../../services/web3.service';

export default class ProductDetail extends Component{
      
    constructor(props) {
        super(props);

        this.state={
            name:'',
            description:'',
            price:0,
            account:'',
            quantity:0
        }
        this.productNameInput='name';
        this.productDescriptionInput='description'
        this.productPriceInput='price'
        this.productQuantityInput='quantity'
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

   

    componentDidMount() { 
        console.log('ss props', this.props)
      getWeb3Contract().then((web3Contract)=>{
        web3Contract.web3.eth.getCoinbase((err, account) =>{
              console.log('contractInstance yk 22',account );
            //    account="0x422437b6c32df2158a45e6e0cb0976b441b0efae"
               this.setState({account:account})
               //"0x01c490bb6e04066ce55aaf4168c2deb8efc19ea5"
               web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                 marketPlaceContractInstance.userStoresCount(account).then(result=>{
                     this.storeInstance = marketPlaceContractInstance;
                     const count = result.toNumber()
                     console.log('-this.props.storeId', this.props);
                     if(this.isUpdatable()) {
                        marketPlaceContractInstance.getUserStoreProduct(this.props.storeId,this.props.productId, 
                            {from:account}).then((product)=>{
                           
                            const name = product[0];
                            const description = product[1];
                            const price = product[2];
                            const quantity = product[3];
                            this.setState({
                               name: name,
                               description: description,
                               price: price,
                               quantity: quantity
                            })
                          
                              console.log('--product', product)
                        })
                     } else {
                         console.log('missing product param')
                     }
                        
                })
                     
             })
          
         })
      })
     }

     isUpdatable=()=> {
           return this.props.storeId!==undefined && this.props.productId !=undefined;
     }

     handleSubmit = (e) => {
        e.preventDefault();
        if( this.storeInstance ) {
         let promise;
         if(this.isUpdatable()) {
             promise = this.storeInstance.editProduct(this.props.storeId,this.props.productId,this.state.name, 
                this.state.description,this.state.price,this.state.quantity, {
                 from: this.state.account
             })
         } else {
             promise = this.storeInstance.addProduct(this.props.storeId,this.state.name, 
                this.state.description,this.state.price,this.state.quantity,{
                 from: this.state.account
             })
         }
         promise.then(function(e){
             console.log('ss result', e )
         })
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
                        <textarea name={this.productDescriptionInput}  value={this.state.description} onChange={this.handleChange}></textarea>
                    </div>

                    <div>
                      <input type="number" name={this.productPriceInput} value={this.state.price} onChange={this.handleChange}/>
                    </div>
                    <div>
                      <input type="number" name={this.productQuantityInput} value={this.state.quantity} onChange={this.handleChange}/>
                    </div>
                    <div>
                       <button type="submit">Save</button>
                   </div>
                </form>
            </div>
        );
    }
}