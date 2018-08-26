import React, { Component }from 'react';
import * as services  from '../../../services/app.service';
import * as accountService from '../../../services/account.service';
import {  Link  } from 'react-router-dom';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as REPO from './repo';

export default class ManageTokenSale extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
              handleChange:0
        }

        this.tokenContract;
        this.tokenSaleContract;
        this.handleChange = this.handleChange.bind(this);
    }



    componentDidMount() {
        services.getContract((contract) => {
            this.storeInstance = contract;
            services.getAccount((account) => {
             
                this.setState({account: account});

                services.getTokenSaleContract((tokenSaleContractResult) => {
                          const { tokenSaleContract } =  tokenSaleContractResult ;
                          this.tokenSaleContract = tokenSaleContract;

                          REPO.getContractAddress({contract:tokenSaleContract, account: this.state.account})
                          .then((tokenSaleContractAddress) => {
                               this.setState({
                                   tokenSaleContractAddress
                               })
                          })
                          console.log('--tokenSaleContract',tokenSaleContractResult, tokenSaleContract)    
                });

                 services.getTokenContract((tokenContractResult) => {
                        const { web3 } = tokenContractResult;
                          const { tokenContract } =  tokenContractResult ;
                          this.tokenContract = tokenContract;

                          REPO.getTotalSupply({  contract:tokenContract, web3 , account:this.state.account}) 
                          .then((totalTokenSupply)=>{
                               this.setState({totalTokenSupply})
                          })
  
                });
              
            });
            
         });
       }

    handleApprove =() => {
        REPO.transferAmountToTokenSaleContract({  
         contract: this.tokenContract, 
         account:this.state.account,
         amountToSell:this.state.amountToSell, 
         contractAddress:this.state.tokenSaleContractAddress
         }).then(()=>{
        
         })
    }

    handleChange = (e) => {
       
        const amountToSell = e.target.value;
         if(amountToSell <= this.state.totalTokenSupply) {
             this.setState({
                 amountToSell
             })
         }
    }

    render() {
        
        return(
            <div>
              <h1>MANAGE TOKEN SALE</h1>
                  <div><h3>Total Token Supply: {this.state.totalTokenSupply}</h3></div>
                  <div>
                     <TextField
                        type="number"
                        id="name"
                        label=" to Sell"
                        value={this.state.amount}
                        onChange={this.handleChange}
                        margin="normal"
                    />
                  </div>
                  <Button type="button" onClick={(e)=>this.handleApprove()}>
                        APPROVE AMOUNT
                 </Button>
            </div>
        );
    }

}
