import React, { Component }from 'react';
import { getWeb3Contract } from '../../../../services/web3.service';
import * as appService  from '../../../../services/app.service';
import * as accountService from '../services/account.service';
import {  Link  } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import * as styles from './styles';

class VendorList extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
               pendingVendors: [],
               allVendors: [],
               approvedVendors:[],
              contractInstance:{}
        }
    }



    componentDidMount() {
        appService.getContract((contract) => {
            this.storeInstance = contract;
            appService.getAccount((account) => {
                this.setState({account: account});
                 this.getVendors();
            });
            
         });
       }

        
       getVendors = () => {
               this.getApprovedVendors()
               this.getPendingVendors();
       }

        getApprovedVendors = ()=> {
            accountService.getApprovedVendors(this.storeInstance, this.state.account).then((approvedVendors) => {
             
                this.setState(prev => {
                       return {
                         ...prev,
                         approvedVendors: approvedVendors,
                          allVendors: [...approvedVendors,...prev.pendingVendors]
                       }
                });   
            })
        }

        getPendingVendors = ()=> {
            accountService.getPendingVendors(this.storeInstance, this.state.account).then((pendingVendors) => {
           
                this.setState(prev => {
                       return {
                         ...prev,
                          pendingVendors: pendingVendors,
                          allVendors: [...prev.approvedVendors, ...pendingVendors]
                       }
                });   
            }) 
        }

    
    renderVendors =() => {

          return this.state.allVendors.map((vendor, index)=>{
                return(
                    <TableRow key={index}>
                    <TableCell>{vendor.name}</TableCell> 
                    <TableCell >{vendor.email}</TableCell> 
                     <TableCell >{vendor.phone}</TableCell> 
                    <TableCell >{vendor.statusText}</TableCell> 
                       <TableCell > <Link to={`/manage-vendor/${vendor.account}`}>Details</Link></TableCell>    
                    </TableRow>
                )
        })
    }

    render() {
        
        return(
               <div style={styles.container}>
                     <h3>VENDOR LIST</h3>
                <Paper>
                
                    <Table>   
                        <TableHead>
                            <TableRow>
                                <TableCell >Name</TableCell>
                                <TableCell >Email</TableCell>
                                <TableCell >Phone</TableCell>
                                <TableCell >Account Status </TableCell>
                                       <TableCell > </TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                    
                         {this.renderVendors()}
                        </TableBody>
                    </Table>
                    </Paper>
                </div>
        );
    }

}

export default VendorList;