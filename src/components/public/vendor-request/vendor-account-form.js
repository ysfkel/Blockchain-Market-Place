import React, { Component } from 'react';
import { getWeb3Contract } from '../../../services/web3.service';

export default class VendorAccountForm extends Component {
   
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
              name:'',
              email:'',
              phone:''
        }

        this.nameInput='name';
        this.emailInput='email'
        this.phoneInput='phone'
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    componentDidMount() {
        
        getWeb3Contract().then((web3Contract)=>{
           
             web3Contract.web3.eth.getCoinbase((err, account) =>{
                 console.log('contractInstance yk 22 22222222',account );
                  this.setState({account: account});
                    web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                      this.storeInstance = marketPlaceContractInstance;
                      console.log('marketPlaceContractInstance', marketPlaceContractInstance)
                   
                    })
             
              })
          })
    }

        handleSubmit = (e) => {
             e.preventDefault();
             console.log('form submitted', this.storeInstance)
             if( this.storeInstance ) {
                let promise;
            
                    promise = this.storeInstance.requestVendorAccount(this.state.name,this.state.email,this.state.phone,{
                        from: this.state.account, gas: 3000000
                    })
                
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
               <h1>Form</h1>
               <form onSubmit={this.handleSubmit}>
               <div>
                   <input type="text" name={this.nameInput} value={this.state.name} onChange={this.handleChange}/>
                </div>

                <div>
                    <input type="text" name={this.emailInput} value={this.state.email} onChange={this.handleChange}/>
                </div>

                <div>
                  <input type="text" name={this.phoneInput} value={this.state.phone} onChange={this.handleChange}/>
                </div>
                <div>
                   <button type="submit">Send</button>
               </div>
            </form>
            </div>
        );
    }
}