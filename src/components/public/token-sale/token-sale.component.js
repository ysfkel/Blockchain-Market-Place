import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import TextField from '@material-ui/core/TextField';
import * as services from '../../../services/app.service';
import * as REPO from './repo';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import * as helper from './helper';
import { etherToWei, etherToSpinel } from '../../store-owner/product/helper';
import * as styles from './styles';

export default class TokenSale extends Component {


    constructor(props) {
            super(props)
            this.state = {
               account:'',
               price:0,
               tokenAmount:0,
               tokenPriceInEther:0,
               amountOfTokensOnSale: 0,
               userTokenBalance:0
            }
            this.web3;
            this.tokenContract;
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

                });

                    services.getTokenSaleContract((tokenSaleContractResult) => {
                          const { tokenSaleContract } =  tokenSaleContractResult ;
                          this.tokenSaleContract = tokenSaleContract;
                         
                     })

                     services.getTokenContract((tokenContractResult) => {
                        const { web3 } = tokenContractResult;
                          const { tokenContract } =  tokenContractResult ;
                          this.tokenContract = tokenContract;

                          this.getAmountOftokensOnSale();
                          this.getTokenBalance();
  
                });

              
                
            })
        }


    getAmountOftokensOnSale =() => {
          const saleContractAddress = this.tokenSaleContract.address;
          REPO.getAmountOfTokensOnSale({ saleContractAddress , tokenContract: this.tokenContract})
          .then((amountOfTokensOnSale) => {
               this.setState({amountOfTokensOnSale});
          }) 
    }

     getTokenBalance =() => {
     
          REPO.getTokenBalance({ account: this.state.account , tokenContract: this.tokenContract})
          .then((userTokenBalance) => {
               this.setState({userTokenBalance});
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
            <div style={styles.container}>  
                   
                
                    <h1> BUY SPINEL TOKENS</h1>
            <Paper style={{padding: '24px'}}>
               <h3> You are buying { this.state.tokenAmount } Tokens, will cost {this.state.tokenPriceInEther} Ether</h3>
                {this.state.amountOfTokensOnSale > 0 && 
                    <p>There are currently {this.state.amountOfTokensOnSale} Spinel Tokens on sale</p>
                }
                {this.state.amountOfTokensOnSale <= 0 && 
                    <p>There are currently no Tokens on sale, you may contact the owner to place some tokens on sale</p>
                }
                <p>
                  {this.state.userTokenBalance <= 0 &&
                      <strong>You currently have no tokens</strong>
                   }
                   {this.state.userTokenBalance >0 && 
                   <strong>Your token balance is { this.state.userTokenBalance } SL </strong>
                   }
                </p>
                
                 <form noValidate autoComplete="off">
                    <TextField
                    style={{width:'100%'}}
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