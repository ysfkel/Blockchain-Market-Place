import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getWeb3Contract } from '../../../services/web3.service';
import { getAccount, getWebContract} from '../../../services/app.service';
 import { getProducts } from './repo';
import ProductListItem from './item.component';
import * as styles from './styles';

export default class ProductsListPublic extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
            account: '',
          products: [],
            contractInstance:{}
      }
        this.storeInstance;

    }

    componentDidMount=() => { 
                 
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;

            const { storeId, accountId } = this.props;
            this.setState({vendorAccountIndex: accountId})
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account});
                getProducts({account, storeIndex: storeId, accountIndex: accountId,  web3, contract} ).then((products) => {
                    console.log('products',products)
                    this.setState({products})
                 });
                
            });
            
        })
     }
    
    render() {
        const products = this.state.products.map((p, index)=>{
            return(<div key={index} style={styles.listContainer}>
                    <ProductListItem product={p} accountId={this.props.accountId} storeId={this.props.storeId} />
                
              </div>)
          })
        return(
            <div>
              <h3>PRODUCT LIST</h3>
              <p>
              {products}
              </p>
            </div>
        );
    }
}


/**
 *  
 */