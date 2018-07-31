import React, { Component }from 'react';
import * as appService  from '../../../../services/app.service';
import * as accountService from '../services/account.service';

import {  Link  } from 'react-router-dom';

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
                console.log('account', account)
                this.setState({account: account});
                 this.getAdminitrators();
            });
            
         });
       }

        getAdminitrators = ()=> {
            accountService.getAdminUsersList(this.storeInstance, this.state.account).then((users) => {
                console.log(' users ', users)
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
            return(<div key={index}>
                 <span>{user.name}</span> <span>{user.roleText}</span>  <span>{user.account}</span>   
                <Link to={`/update-admin-account/${user.account}`}>Details</Link>
                 </div>)
         });
    }

    render() {
        
        return(
            <div>
              <h1>ADMIN USERS LIST</h1>
              <Link to={`/create-admin-account`}>CREATE</Link>
              <p>
               {this.renderList()}
              </p>
            </div>
        );
    }

}
