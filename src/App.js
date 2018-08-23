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
import PublicStoreListViewComponent from './components/public/store/list-view.component';
import ProductListViewComponent from './components/public/product/list-view.component';
import VendorRequestView from './components/public/vendor-request/vendor-request-view';
import ManageVendors from './components/admin/manage-vendors/manage-vendors';
import VendorDetail from './components/admin/manage-vendors/vendor/vendor-detail.component';
import AdminList from './components/admin/manage-admins/admin/admin-list.component';
import AdminUserDetail from './components/admin/manage-admins/admin/admin-detail.component';
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
      console.log('-getContract', )
        appService.getContract((contract) => {
            this.storeInstance = contract;
            console.log('-contract', contract)
            appService.getAccount((account) => {
              console.log('-******account', account)
                this.setState({account: account});
                this.getUserRole();
            });
            
         });
        

    }

    getUserRole =() => {
        accountService.getUserRole(this.storeInstance, this.state.account).then((role) => {
                console.log('--user role', role);
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
                              {(this.state.role  === ROLE.OWNER) &&
                                  <Link style={style.linkStyle} to="/manage-admin-accounts">Manage Admins</Link>    
                               } 
                        
                               {(this.state.role === ROLE.OWNER || this.state.role === ROLE.ADMIN || this.state.role === ROLE.SUPER_ADMIN) &&
                                   <Link style={style.linkStyle} to="/manage-vendors">Manage vendors</Link>   
                               } 
                               {(this.state.role === ROLE.VENDOR) &&
                                 <span> <Link style={style.linkStyle} to="/create-store">Create store</Link> 
                                 <Link style={style.linkStyle} to="/manage-stores">Manage Stores</Link> 
                                  <Link style={style.linkStyle} to="/withdrawal">Finance</Link> 
                                 </span>
                                  
                               } 
                                <Link style={style.linkStyle}  to="/shopping-cart">Shopping cart</Link>
                               <Link style={style.linkStyle} to="/stores">Stores</Link>
                               <Link style={style.linkStyle} to="/products">Products</Link>
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
                         
                         <Redirect from="/" exact to="/stores" />

                         
                            
                      </div>
                   </Router>
                  </div>
          )
    }
}
