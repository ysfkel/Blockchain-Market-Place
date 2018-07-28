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
              adminAccounts: [],
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
                 <span>{user.name}</span> <span>{user.role}</span>  <span>{user.account}</span>   
                {/* <Link to={`/manage-vendor/${vendor.account}`}>Details</Link> */}
                 </div>)
      });
    }

    render() {
        
        return(
            <div>
              <h1>ADMIN USERS LIST</h1>
              <p>
               {this.renderList()}
              </p>
            </div>
        );
    }

}
