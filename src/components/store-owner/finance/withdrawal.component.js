import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import TextField from '@material-ui/core/TextField';
import * as REPO from './repo';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import * as styles from './styles';
import * as services from '../../../services/app.service';

export default class FinanceWithdrawal extends Component {

        constructor(props) {
            super(props)
            this.state = {
               account:'',
               amount:0,
               tokenBalance:0
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

                            this.setState({vendorBalance});
                        
                        })
                    this.setTokenBalance();
                        

                });
                
            })
        }

    
    setTokenBalance = () => {
          services.getTokenContract((tokenContractResult) => {
                          const { tokenContract } =  tokenContractResult ;
                          this.tokenContract = tokenContract;
                         
                           REPO.getTokenBalance({ account:this.state.account, tokenContract})
                            .then((tokenBalance) =>{
                       
                                this.setState({tokenBalance})
                            });
                     });
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

            REPO.withdraw({account: this.state.account, contract: this.storeInstance, web3: this.web3}).then(()=>{
                console.log('updated!')
            })
          }
        }



        render() {
          
            return(
            <div style={styles.container}>  
                   
                
             <h1>WITHDRAW FUNDS</h1>
               <Paper style={styles.innerContainer}>
                 
                   <p>
                   <h3>Total Sales Revenue ETHER {this.state.vendorBalance} ETH</h3>
                      Your total revenue from purchases paid by Ether from all
                      of your stores is { this.state.vendorBalance } Ether.
                   </p>
                    <p>
                    <h3>Total Sales Revenue SPINEL TOKENS {this.state.tokenBalance} SL</h3>
                      Your total revenue from purchases paid by SPINEL TOKEN from all
                      of your stores is { this.state.tokenBalance } SL.
                      You can withdraw this fund from an excahnge.
                       <a href="#">view list of exchanges here.</a> 
                   </p>
                  <Button type="button" onClick={(e)=>this.handleWithdrawal()}>
                       CLICK HERE TO WITHDRAW ETHER REVENUE TO YOUR WALLET
                 </Button>
            </Paper>
            </div>
            );
        }
    }