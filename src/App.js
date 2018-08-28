import React , { Component } from 'react';
import { BrowserRouter as Router, Link , Route, Redirect } from 'react-router-dom';
import StoreList from './components/store-owner/store/stores-list';
import FinanceWithdrawal from './components/store-owner/finance/withdrawal.component'
import StoreDetail from './components/store-owner/store/store-detail.component';
import ProductList from './components/store-owner/product/product-list.component';
import ProductUpdate from './components/store-owner/product/product-update.component';
import ProductDetail from './components/public/product/product-detail.component';
import ManageShoppingCart from './components/public/cart/manage-shopping-cart';
import Checkout from './components/public/checkout/checkout.component';
import OrderHistory from './components/public/order-history/order-history.component';
import CheckoutTokenPay from './components/public/checkout-token/checkout-token.component';
import TokenSale from './components/public/token-sale/token-sale.component';
import PublicStoreListViewComponent from './components/public/store/list-view.component';
import ProductListViewComponent from './components/public/product/list-view.component';
import VendorRequestView from './components/public/vendor-request/vendor-request-view';
import ManageVendors from './components/admin/manage-vendors/manage-vendors';
import VendorDetail from './components/admin/manage-vendors/vendor/vendor-detail.component';
import AdminList from './components/admin/manage-admins/admin/admin-list.component';
import AdminUserDetail from './components/admin/manage-admins/admin/admin-detail.component';
import ManageTokenSale from './components/admin/manage-token-sale/manage-token-sale.component';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import MarketPlace from '../build/contracts/MarketPlace.json';
import store from './app.store';
import * as actions from './state-manager/action-creators';
import * as actionDispatchers from './state-manager/action-dispatchers';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import * as style from './App.style';
import * as appService  from './services/app.service';
import * as accountService from './services/account.service';
import { ROLE } from './constants/constants';

const styles = {
    root: {
      flexGrow: 1,
    },
  };

export default class App extends Component{
   
    constructor(props) {
        super(props);

        this.state = {
            account: '',
            role:'',
        }
        this.contractInstance;
    }

    componentDidMount() {
        appService.getContract((contract) => {
            this.storeInstance = contract;
            appService.getAccount((account) => {
                this.setState({account: account});
                this.getUserRole();
            });
            
         });
        

    }

    getUserRole =() => {
        accountService.getUserRole(this.storeInstance, this.state.account).then((role) => {
            
                this.setState({role});

        })
    }


    render(){
       
          return(
                  <div >
                  
                    
                     <Router >
                      <div>
                      <div  >
                      <AppBar position="static" color="default">
                        <Toolbar style={style.toolbar}>
                              <div style={style.linksContainer}>
                              {this.state.account &&
                                <strong style={style.linkStyle}>Your Account [{this.state.account}]</strong>
                              }   
                              {!this.state.account &&
                                  <strong style={style.linkStyle_warning}>Your Account is not connected, please verify your metamask / network settings</strong>
                              }                          
                              {(this.state.role  === ROLE.OWNER) &&
                                  <Link style={style.linkStyle} to="/manage-admin-accounts">Manage Admins</Link>    
                               } 
                        
                               {(this.state.role === ROLE.OWNER || this.state.role === ROLE.ADMIN || this.state.role === ROLE.SUPER_ADMIN) &&
                                  <span>
                                      <Link style={style.linkStyle} to="/manage-vendors">Manage vendors</Link>   

                                   <Link style={style.linkStyle} to="/manage-token-sale">Manage Token Sale </Link>
                                  </span>
                               } 
                               {(this.state.role === ROLE.VENDOR) &&
                                 <span> <Link style={style.linkStyle} to="/create-store">Create store</Link> 
                                 <Link style={style.linkStyle} to="/manage-stores">Manage Stores</Link> 
                                  <Link style={style.linkStyle} to="/withdrawal">Finance</Link> 
                                 </span>
                                  
                               } 
                                <Link style={style.linkStyle}  to="/shopping-cart">Shopping cart</Link>
                               <Link style={style.linkStyle} to="/stores">Stores</Link>
                               <Link style={style.linkStyle} to="/token-sale">Buy Tokens</Link>
                               <Link style={style.linkStyle} to="/order-history">Order History</Link>
                               
                               { this.state.role === ROLE.CUSTOMER &&
                                 <Link style={style.linkStyle} to="/vendor-request">Vendor Request</Link>
                               }
                               {this.state.role === ROLE.VENDOR_AWAITING_APPROVAL &&
                                    <span>Your Vendor Account is being Processed</span>
                               }
                              </div>
                        </Toolbar>
                      </AppBar>
                    </div>
                            <Route
                                
                            exact path={'/manage-stores'}
                           
                            component={()=><StoreList />}
                           />
                           
                           <Route
                          
                             path={'/edit-store/:id'}
                           
                            render={(props)=><StoreDetail storeId={props.match.params.id}/>}
                           />   

                           <Route
                             path={'/create-store'}
                            render={(props)=><StoreDetail />}
                           />  
                        
                           <Route
                             exact
                             path={'/product-add/:storeId'}
                             render={(props)=><ProductUpdate storeId={props.match.params.storeId} />}
                           /> 

                           <Route
                           exact
                           path={'/product-edit/:storeId/:productId'}
                           render={(props)=><ProductUpdate storeId={props.match.params.storeId} productId={props.match.params.productId} />}
                         /> 

                          <Route
                           exact
                           path={'/product-details/:accountId/:storeId/:productId'}
                           render={(props)=><ProductDetail 
                            accountId= {props.match.params.accountId}
                            storeId={props.match.params.storeId} 
                            productId={props.match.params.productId} />}
                         /> 
                           
                           
                           <Route
                           path={'/product/list/:storeId'}
                           render={(props)=><ProductList storeId={props.match.params.storeId} />}
                         /> 

                         <Route
                           path={'/stores'}
                           render={(props)=><PublicStoreListViewComponent/>}
                         /> 

                         <Route
                           path={'/products-catalog/:accountId/:storeId'}
                           render={(props)=><ProductListViewComponent storeId={props.match.params.storeId} 
                           accountId={props.match.params.accountId} />}
                         /> 

                          <Route exact path={'/withdrawal'} render={(props)=><FinanceWithdrawal/>} />

                           <Route 
                           path={'/vendor-request'}
                           render={(props)=><VendorRequestView/>}/>

                           <Route 
                           path={'/manage-vendors'}
                           render={(props)=><ManageVendors/>}/>

                           <Route 
                           path={'/manage-vendor/:account'}
                           render={(props)=><VendorDetail vendorAccount = {props.match.params.account}/>}/>

                           <Route 
                           path={'/manage-admin-accounts'}
                           render={(props)=><AdminList />}/>

                            <Route 
                           path={'/update-admin-account/:account'}
                           render={(props)=><AdminUserDetail adminAccount = {props.match.params.account}/>}/>

                            <Route 
                           path={'/create-admin-account'}
                           render={(props)=><AdminUserDetail />}/>
                           
                           <Route exact path={'/shopping-cart'} render={(props)=><ManageShoppingCart/>} />

                           <Route exact path={'/checkout'} render={(props)=><Checkout/>}/>
                           <Route exact path={'/order-history'} render={(props)=><OrderHistory/>}/>
                           <Route exact path={'/checkout-token-pay'} render={(props)=><CheckoutTokenPay/>}/>
                           <Route exact path={'/manage-token-sale'} render={(props)=><ManageTokenSale/>} />
                         <Route exact path={'/token-sale'} render={(props)=><TokenSale/>}/>
                         <Redirect from="/" exact to="/stores" />

                         
                            
                      </div>
                   </Router>
                  </div>
          )
    }
}
