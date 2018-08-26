import React, { Component } from 'react';
import StoreListPublic from './list.component';
import * as styles from './styles';

export default class PublicStoreListViewComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div style={styles.storeContainer} >
          
               
               <StoreListPublic/>

            </div>
        );
    }
}