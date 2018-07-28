import React, { Component } from 'react';
import VendorAccountForm from './vendor-account-form';

export default class VendorRequestView extends Component {

    render() {
        return(
            <div>
               <h1>VENDOR ACCOUNT REQUEST</h1>
               <VendorAccountForm/>
            </div>
        );
    }
}