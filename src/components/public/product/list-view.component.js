import React, { Component } from 'react';
import ProductsListPublic from './list.component';

export default class ProductListViewComponent extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <div>
               <h1>Products</h1>
               
              <ProductsListPublic/>

            </div>
        );
    }
}