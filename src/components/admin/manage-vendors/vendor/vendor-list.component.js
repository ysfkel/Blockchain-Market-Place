import React, { Component }from 'react';
import { getWeb3Contract } from '../../../../services/web3.service';
import * as appService  from '../../../../services/app.service';
import * as accountService from '../services/account.service';

import {  Link  } from 'react-router-dom';

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
            return(<div key={index}>
                 <span>{vendor.name}</span> <span>{vendor.email}</span>  <span>{vendor.phone}</span>   <span>{vendor.statusText}</span> 
                <Link to={`/manage-vendor/${vendor.account}`}>Details</Link>
                 </div>)
      });
    }

    render() {
        
        return(
            <div>
              <h1>VENDOR LIST</h1>
              <p>
               {this.renderVendors()}
              </p>
            </div>
        );
    }

}

export default VendorList;