    import React, { Component } from 'react';
    import { getAccount, getWebContract} from '../../../services/app.service';
import TextField from '@material-ui/core/TextField';

import * as REPO from './repo';

    import Paper from '@material-ui/core/Paper';
    import Button from '@material-ui/core/Button';


    export default class FinanceWithdrawal extends Component {

        constructor(props) {
            super(props)
            this.state = {
               account:'',
               amount:0
            }
            this.web3;
         
            this.handleWithdrawal=this.handleWithdrawal.bind(this);
            this.handleChange=this.handleChange.bind(this);
         
        }
        
        componentDidMount=() => { 
                    
            getWebContract((web3Contract) => {
                const { contract } =  web3Contract ;
                const { web3 } = web3Contract;
                this.web3 = web3;
                this.storeInstance = contract;
                getAccount((account, balance) => {
                    this.setState({account: account, balance});
                REPO.getVendorBalance({account: this.state.account, 
                contract: this.storeInstance, web3: this.web3}).then((vendorBalance)=>{
                                 console.log('updated!', vendorBalance)
                      this.setState({vendorBalance});
       
                 })
                        

                });
                
            })
        }


        
    handleChange = (e) => {
        
        e.preventDefault();
        const name =  e.target.name;
        const value = e.target.value;
        this.setState(prev=>{
                prev['amount']= value;
                return {...prev}
        })
        
    }

        handleWithdrawal = () => {
          if(this.state.amount <= this.state.balance) {
            let { cartPrice } = this.state;
            // cartPrice = this.web3.toWei(cartPrice);
            REPO.withdraw({account: this.state.account, contract: this.storeInstance, web3: this.web3}).then(()=>{
                console.log('updated!')
            })
          }
        }



        render() {
          
            return(
            <div>  
                   
                
                    <h1>WITHDRAW FUNDS</h1>
            <Paper>
               <h3>{this.state.vendorBalance} Ether</h3>
                 <form noValidate autoComplete="off">
                    <TextField
                    type="text"
                    id="name"
                    label="Amount"
                    value={this.state.amount}
                    onChange={this.handleChange}
                    margin="normal"
                    />
      
     
                </form>

                  <Button type="button" onClick={(e)=>this.handleWithdrawal()}>
                                PAY FOR THESE ITEMS NOW
                            </Button>
            </Paper>
            </div>
            );
        }
    }