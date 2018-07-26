import React, { Component } from 'react';
import StoreListPublic from './list.component';

export default class PublicStoreListViewComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
               <h1>STORES</h1>
               
               <StoreListPublic/>

            </div>
        );
    }
}