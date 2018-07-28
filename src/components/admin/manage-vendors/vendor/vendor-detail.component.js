import React, { Component }from 'react';
import { getWeb3Contract } from '../../../../services/web3.service';
import * as appService  from '../../../../services/app.service';
import * as accountService from '../services/account.service';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import {  Link  } from 'react-router-dom';

export default class VendorDetail extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
              vendor: {},
        }
    }



    componentDidMount() {
        appService.getContract((contract) => {
            this.storeInstance = contract;
            appService.getAccount((account) => {
                this.setState({account: account});
                accountService.getVendor(contract, this.props.vendorAccount, account).then((vendor) => {
                    this.setState(prev => {
                           return {
                             ...prev,
                             vendor: vendor,
                           }
                    });
                })
            });
            
        });
    }

    handleApproveVendor = () => {
        if(this.storeInstance) {
              this.storeInstance.approveVendorAccount(this.state.vendor.account,{
                  from: this.state.account,
                  gas: 3000000
              }).then((result) => {
                    console.log(result)
              })
        }
    }
    
    renderAction =() => {
        if(this.state.vendor.status === 0) {
              return(
                <Button onClick={e => this.handleApproveVendor()} size="small">APPROVE THIS ACCOUNT</Button>
              );
        }else if(this.state.vendor.status === 1) {
              return(
                <Button size="small">PAUSE THIS ACCOUNT</Button>
              );
        }
    }
    renderVendors =() => {
           const { vendor } = this.state;
            return(<div >
                  <div>
                    <Typography style = {{display: 'inline-block'}}  color="textSecondary"> NAME: </Typography><strong> {vendor.name}</strong>
                  </div>
                  <div>
                    <Typography style = {{display: 'inline-block'}}  color="textSecondary"> EMAIL: </Typography><strong> {vendor.email}</strong>
                  </div>
                  <div>
                    <Typography style = {{display: 'inline-block'}}  color="textSecondary"> PHONE: </Typography><strong> {vendor.phone}</strong>
                  </div>
                  <div>
                    <Typography style = {{display: 'inline-block'}}  color="textSecondary"> STATUS: </Typography><strong> {vendor.statusText}</strong>
                  </div>
                 
              </div>)
     
    }

    render() {
        
        return(
            <div>
              <h1>VENDOR DETAILS</h1>
              <Card >
                    <CardContent>
                       {this.renderVendors()}
                    </CardContent>
                    <CardActions>
                       {this.renderAction()}
                    </CardActions>
                </Card>
            </div>
        );
    }

}
