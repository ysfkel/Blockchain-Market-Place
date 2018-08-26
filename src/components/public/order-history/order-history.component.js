import React, { Component } from 'react';
import * as services from '../../../services/app.service';
import * as REPO from './repo';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import {  Link} from 'react-router-dom';
import * as styles from './styles';

export default class OrderHistory extends Component {

        constructor(props) {
            super(props)
            this.state = {
               orderHistory:[], 
               account:''
            }
            this.web3;
            this.storeInstance;
         
        }
        
        componentDidMount=() => { 
                    
            services.getWebContract((web3Contract) => {
                const { contract } =  web3Contract ;
                const { web3 } = web3Contract;

                this.web3 = web3;
                this.storeInstance = contract;
                services.getAccount((account, balance) => {

                           this.setState({account: account, balance});
                            REPO.getOrderHistory({ contract, web3 ,account})
                            .then((orderHistory) => {
                            
                                  console.log('--orderHistory 22333222',orderHistory);
                              
                                  this.setState({orderHistory})
                            });

                });
                
            })
        }


        

       renderOrder = (order) => {
    
             const { transactions } = order;
             const transactionsList =  transactions.map((transaction, index)=>{
                return(
                    <TableRow key={index}>
                     <TableCell>{transaction.vendor}</TableCell> 
                       <TableCell>{transaction.storeName}</TableCell> 
                      <TableCell>{transaction.productName}</TableCell> 
                      <TableCell numeric>{transaction.quantity}</TableCell> 
                     <TableCell numeric>{transaction.price}</TableCell> 
                      <TableCell>{transaction.paymentMethod}</TableCell> 
                         
                    </TableRow>
                )
            });

             return(
                    //    <h1>ORDER 3</h1>
                 <Paper>
            
                <Table >   
                    <TableHead>
                        <TableRow>
                            <TableCell >Vendor</TableCell>
                            <TableCell >Store Name</TableCell>
                              <TableCell>Product Name </TableCell>
                            <TableCell>Quantity </TableCell>
                            <TableCell>Price </TableCell>
                            <TableCell>Payment method </TableCell>
                        </TableRow>
                    </TableHead> 
                    <TableBody>
                     {transactionsList}
                   
                      <TableRow>
                           <TableCell>Grand total: {order.grandTotal} /  Date: {order.date}</TableCell>
                         
                        </TableRow>
                    </TableBody>
                </Table>
             </Paper>
             );
       }

     

        render() {
             const orderHistory = this.state.orderHistory.map((order, index)=>{
            
                const renderedOrder = this.renderOrder(order);
                return(
                      <div>
                        {renderedOrder}
                      </div>
                    //  {renderedOrder}
                )
            })

        return(
              <div style={styles.container}>
                 <h1>ORDER HISTORY</h1>
                  {orderHistory}
              </div>
        );


        }
    }