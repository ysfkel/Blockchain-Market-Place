import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import TextField from '@material-ui/core/TextField';
import * as services from '../../../services/app.service';
import * as REPO from './repo';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import * as helper from './helper';
import { etherToWei, etherToSpinel } from '../../store-owner/product/helper';

export default class TokenSale extends Component {

/*
         prev['tokenAmount'] = tokenAmount;
                prev['tokenPriceInEther'] = tokenPriceInEther; */
    constructor(props) {
            super(props)
            this.state = {
               account:'',
               price:0,
               tokenAmount:0,
               tokenPriceInEther:0
            }
            this.web3;
         
            this.handleBuyTokens=this.handleBuyTokens.bind(this);
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
                console.log('--balance', balance)
                    // REPO.getVendorBalance({account: this.state.account, 
                    //     contract: this.storeInstance, web3: this.web3}).then((vendorBalance)=>{
                    //                 console.log('updated!', vendorBalance)
                    //     this.setState({vendorBalance});
        
                    // })
                        

                });

                    services.getTokenSaleContract((tokenSaleContractResult) => {
                          const { tokenSaleContract } =  tokenSaleContractResult ;
                          this.tokenSaleContract = tokenSaleContract;
                          console.log('--tokenSaleContract',tokenSaleContractResult, tokenSaleContract)
                         
                     })
                
            })
        }


        
    handleChange = (e) => {
        
        e.preventDefault();
        const name =  e.target.name;
        const tokenAmount = e.target.value;

        const tokenPriceInEther = helper.tokenToEther({
            tokenAmount,
            web3: this.web3
        });

        const priceInWei = helper.tokenToWei({
            tokenAmount,
            web3: this.web3});
    

        this.setState(prev=>{
                prev['tokenAmount'] = tokenAmount;
                prev['price'] = priceInWei;
                prev['tokenPriceInEther'] = tokenPriceInEther;
                return {...prev}
        })
        
    }

        handleBuyTokens = () => {
          if(this.state.tokenPriceInEther <= this.state.balance) {
            const  { tokenAmount, price, account } = this.state;
               
            REPO.buyTokens({ tokenAmount, price ,account, tokenSaleContract: this.tokenSaleContract})
                            .then(() =>{
                                    console.log('--completed success')
                             
               });
          }
        }



        render() {
          
            return(
            <div>  
                   
                
                    <h1> SPINEL TOKEN SALE</h1>
            <Paper>
               <h3>{this.state.tokenPriceInEther} Ether</h3>
                 <form noValidate autoComplete="off">
                    <TextField
                    type="number"
                    id="name"
                    label="Amount"
                    value={this.state.amount}
                    onChange={this.handleChange}
                    margin="normal"
                    />
      
     
                </form>

                  <Button type="button" onClick={(e)=>this.handleBuyTokens()}>
                                BUY TOKENS
                            </Button>
            </Paper>
            </div>
            );
        }
    }