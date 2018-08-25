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

export default class CheckoutTokenPay extends Component {

        constructor(props) {
            super(props)
            this.state = {
               products:[], 
               account:'',
               cartPrice:0
            }
            this.web3;
            this.tokenContract;
            this.handlePayment=this.handlePayment.bind(this);
         
        }
        
        componentDidMount=() => { 
                    
            services.getWebContract((web3Contract) => {
                const { contract, tokenSaleContract, tokenContract } =  web3Contract ;
                const { web3 } = web3Contract;

                this.web3 = web3;
                this.storeInstance = contract;
                services.getAccount((account, balance) => {

                           this.setState({account: account, balance});
                            xREPO.getCartItem({ contract, web3 ,account})
                            .then((products) => {
                                    console.log('--product', products)
                                    this.setState({products})
                            });

                            REPO.getCartPrice({ contract ,account})
                            .then(cartPrice => {
                                    this.setState({cartPrice});
                            });


                            

                     services.getTokenContract((tokenContractResult) => {
                          const { tokenContract } =  tokenContractResult ;
                          this.tokenContract = tokenContract;
                          console.log('--tokenSaleContract',tokenContractResult, tokenContract)
                          REPO.getTokenBalance({ account, tokenContract})
                            .then((tokenBalance) =>{
                                    console.log('--tokenBalance', tokenBalance)
                                this.setState({tokenBalance})
                            });
                     });
                });
                
            })
        }


        

        handlePayment = () => {
          if(this.state.balance >= this.state.cartPrice) {
            const { cartPrice } = this.state;
            const storeInstance = this.storeInstance;
            const tokenContract = this.tokenContract;
            const { account } = this.state;
            //cartPrice = this.web3.toWei(cartPrice);
            //checkOutByToken = ({ account, amountToApprove, contract ,tokenContract, spenderContractAddress}
            REPO.checkOutByToken({
                account, 
                cartPrice,
                storeInstance,
                tokenContract
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
                               </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            </div>
            );
        }
    }