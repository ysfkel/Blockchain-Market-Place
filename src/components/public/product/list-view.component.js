import React, { Component } from 'react';
import ProductsListPublic from './list.component';
import * as styles from './styles';

export default class ProductListViewComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div style={styles.productsListContainer}>
              <ProductsListPublic storeId={this.props.storeId}
               accountId={this.props.accountId}/>

            </div>
        );
    }
}