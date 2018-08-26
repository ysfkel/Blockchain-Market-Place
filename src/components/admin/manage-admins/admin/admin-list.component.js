import React, { Component }from 'react';
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

export default class AdminList extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
              users: [],
        }
    }



    componentDidMount() {
        appService.getContract((contract) => {
            this.storeInstance = contract;
            appService.getAccount((account) => {
        
                this.setState({account: account});
                 this.getAdminitrators();
            });
            
         });
       }

        getAdminitrators = ()=> {
            accountService.getAdminUsersList(this.storeInstance, this.state.account).then((users) => {
      
                this.setState(prev => {
                       return {
                         ...prev,
                         users: [...users]
                       }
                });   
            })
        }

      renderList =() => {

          return this.state.users.map((user, index)=>{
                return(
                    <TableRow key={index}>
                    <TableCell>{user.name}</TableCell> 
                    <TableCell >{user.roleText}</TableCell> 
                     <TableCell >{user.account}</TableCell> 
                       <TableCell > <Link to={`/update-admin-account/${user.account}`}>Details</Link></TableCell>    
                    </TableRow>
                )
        })
    }
    render() {

          return(
               <div style={styles.container}>
                       <h1>ADMIN USERS LIST</h1>
                <Paper>
                
                    <Table>   
                        <TableHead>
                            <TableRow>
                                <TableCell >Name</TableCell>
                                <TableCell >ROLE</TableCell>
                                <TableCell >ACCOUNT</TableCell>
                                       <TableCell > </TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                    
                         {this.renderList()}
                        </TableBody>
                    </Table>
                    </Paper>
                </div>
        );
    }

}
