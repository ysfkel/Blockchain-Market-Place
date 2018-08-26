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
import {  Link} from 'react-router-dom';
import ApproveTokenPay from './approve-token-pay';
import * as styles from './styles';

export default class CheckoutTokenPay extends Component {

        constructor(props) {
            super(props)
            this.state = {
               products:[], 
               account:'',
               cartPrice:0,
               showApproveTokenPay: false
            }
            this.web3;
            this.tokenContract;
            this.storeInstance;
            this.handlePayment=this.handlePayment.bind(this);
            this.handleClose = this.handleClose.bind(this);
            this.handleClickOpen = this.handleClickOpen.bind(this);
         
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
            .watch(() => {
                this.handleClose();
                console.log('approved')
            })
        }


        handleClickOpen = () => {
           this.setState({ showApproveTokenPay: true });
       };

         handleClose = () => {
           this.setState({ showApproveTokenPay: false });
        };

        handlePayment = () => {
          if(this.state.balance >= this.state.cartPrice) {
            const storeInstance = this.storeInstance;
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
                            <TableCell>Cart Price: {this.state.cartPrice} / Your balance {this.state.balance} Ether / {this.state.tokenBalance} SL</TableCell>
                        
                        </TableRow>
                            <TableRow>
                           <Button type="button" onClick={(e)=>this.handlePayment()}>
                                PAY
                            </Button>

                             <Button onClick={this.handleClickOpen}>Open form dialog</Button>
       
                               </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            <ApproveTokenPay 
              account={this.state.account} 
              cartPrice={this.state.cartPrice}
              open={this.state.showApproveTokenPay} 
              handleClose={this.handleClose}
              tokenContract={this.tokenContract}
              balance={this.state.balance}
              storeContractAddress={this.state.storeContractAddress}
              />
            </div>
            );
        }
    }