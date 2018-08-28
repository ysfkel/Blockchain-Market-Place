import React, { Component } from 'react';
import * as services from '../../../services/app.service';
import * as xREPO from '../cart/repo';
import * as REPO from './repo';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import ApproveTokenPay from './approve-token-pay';
import * as styles from './styles';
import InsufficientBalnace from '../insufficient-balance/insufficient-balance.component';

export default class CheckoutTokenPay extends Component {

        constructor(props) {
            super(props)
            this.state = {
               products:[], 
               account:'',
               cartPrice:0,
               showApproveTokenPay: false,
               allowPayment: false,
               paymentSubmitted: false,
               approvalSubmitted:false
            }
            this.web3;
            this.tokenContract;
            this.storeInstance;
            this.handlePayment=this.handlePayment.bind(this);
            this.handleClose = this.handleClose.bind(this);
            this.handleClickOpen = this.handleClickOpen.bind(this);
            this.handleApproveSubmitted = this.handleApproveSubmitted.bind(this);
         
        }
        
        componentDidMount=() => { 
                    
            services.getWebContract((web3Contract) => {
                const { contract, tokenSaleContract, tokenContract } =  web3Contract ;
                const { web3 } = web3Contract;

                this.web3 = web3;
                this.storeInstance = contract;
                services.getAccount((account, balance) => {

                           this.setState({
                              account: account, 
                              balance,
                              storeContractAddress: this.storeInstance.address
                           });
                            xREPO.getCartItem({ contract, web3 ,account})
                            .then((products) => {
                                 
                                    this.setState({products})
                            });

                            REPO.getCartPrice({ contract ,account})
                            .then(cartPrice => {
                                    this.setState({cartPrice});
                            });


                            

                     services.getTokenContract((tokenContractResult) => {
                          const { tokenContract } =  tokenContractResult ;
                          this.tokenContract = tokenContract;
                          this.listenForApprovalEvent();
                          this.listendForPaymentCompleted();
                          this.listendForTokenBalanceEvent();

                           REPO.getTokenBalance({ account, tokenContract})
                            .then((tokenBalance) =>{
                       
                                this.setState({tokenBalance})
                            });
                     });
                });
                
            })
        }

        listenForApprovalEvent = () => {
            this.tokenContract
            .Approval({},{
                fromBlock:0,
                toBlock:'latest'
            })
            .watch((error, event) => {
            
                this.handleClose();

                if(this.state.approvalSubmitted) {
                this.setState({
                    allowPayment: true
                })
              }
       
            })
        }

        listendForPaymentCompleted = () => {
             this.storeInstance
             .PaymentCompleted({}, {
                 fromBlock:0,
                 toBlock:'latest'
             })
             .watch((error, event) => {
                 console.log('payment completed');
                  if(!error && this.state.paymentSubmitted) {
                    
                      REPO.clearApproval({
                          spender: this.state.storeContractAddress,
                          account: this.state.account,
                          tokenContract: this.tokenContract
                      })
                      .then((isCleared) => {
                           console.log('approval cleared')
                      })
                  }

             })
        }

        listendForTokenBalanceEvent = () => {
              this.tokenContract
              .TokenBalance({},{
                  fromBlock:0,
                  toBlock: 'latest'
              })
              .watch((error, event) => {
                  if(!error && this.state.paymentSubmitted) {
                       const balance = event.args._balance;
                       this.setState({balance});
                  }
              })
        }

        handleApproveSubmitted = () => {
                 this.setState({approvalSubmitted:true});
        }
        handleClickOpen = () => {
           this.setState({ showApproveTokenPay: true });
       };

         handleClose = () => {
           this.setState({ showApproveTokenPay: false });
        };
        hasSufficientBalance = () => {
             return this.state.tokenBalance >= this.state.cartPrice;
        }
        handlePayment = () => {
          if(this.hasSufficientBalance()) {
            const storeInstance = this.storeInstance;
            this.setState({paymentSubmitted:true});
            const { account } = this.state;
            REPO.checkOutByToken({
                account, 
                storeInstance
                }).then(()=>{
                console.log('purchase updated!')
            })
          }
        }



        render() {
            const products = this.state.products.map((product, index)=>{
                return(
                    <TableRow key={index}>
                    <TableCell>{product.name}</TableCell> 
                    <TableCell numeric>{product.price}</TableCell> 
                     <TableCell numeric>{product.priceInSpinelToken}</TableCell> 
                    <TableCell numeric>{product.quantity}</TableCell> 
                         
                    </TableRow>
                )
        })
            return(
                 <div>
                {!this.hasSufficientBalance() &&
                    <div style={styles.container}>
                      <InsufficientBalnace/>
                      </div>
                }
               {this.hasSufficientBalance() && 
                 <div style={styles.container}>
                        <h1>SHOPPING CART</h1>
                <Paper>
                
                    <Table>   
                        <TableHead>
                            <TableRow>
                                <TableCell >Name</TableCell>
                                <TableCell numeric>Price (ETH)</TableCell>
                                <TableCell numeric>Price (SL)</TableCell>
                                <TableCell numeric>Quantity </TableCell>
                                
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                    
                        {products}
                        <TableRow>
                            <TableCell>Cart Price: {this.state.cartPrice} SL TOKENS / Your balance  {this.state.tokenBalance} SL</TableCell>
                            
                            </TableRow>
                                <TableRow>
                                <div style={{padding:'10px'}}>
                                {this.state.allowPayment &&
                                <Button type="button" onClick={(e)=>this.handlePayment()}>
                                    COMPLETE PAYMENT
                                </Button>
                                }
                                { !this.state.allowPayment &&
                                    <span style={{fontSize: '12px' }}>YOU ARE ABOUT TO A PAYMENT OF {this.state.cartPrice} SPINEL TOKENS  <Button  onClick={this.handleClickOpen}>APPROVE THIS TRANSACTION</Button> </span>
                                }
                                </div>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </Paper>
                    <ApproveTokenPay 
                    approveSubmitted={this.handleApproveSubmitted}
                    account={this.state.account} 
                    cartPrice={this.state.cartPrice}
                    open={this.state.showApproveTokenPay} 
                    handleClose={this.handleClose}
                    tokenContract={this.tokenContract}
                    balance={this.state.balance}
                    storeContractAddress={this.state.storeContractAddress}
                />
                </div>
             
             
                }
                 </div>
               );
        }
    }