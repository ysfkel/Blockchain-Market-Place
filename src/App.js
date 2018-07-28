import React , { Component } from 'react';
import { BrowserRouter as Router, Link , Route, Redirect } from 'react-router-dom';
import StoreList from './components/store-owner/stores-list';
import StoreDetail from './components/store-owner/store/store-detail.component';
import ProductList from './components/store-owner/product/product-list.component';
import ProductDetail from './components/store-owner/product/product-detail.component';
import PublicStoreListViewComponent from './components/public/store/list-view.component';
import ProductListViewComponent from './components/public/product/list-view.component';
import VendorRequestView from './components/public/vendor-request/vendor-request-view';
import ManageVendors from './components/admin/manage-vendors/manage-vendors';
import VendorDetail from './components/admin/manage-vendors/vendor/vendor-detail.component';
import AdminList from './components/admin/manage-admins/admin/admin-list.component'
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
                console.log('--user role', role);
                this.setState({role});

                  // switch(role) {
                  //     case ROLE.ADMIN: {

                  //       break;
                  //     }
                  //     case ROLE.SUPER_ADMIN: {

                  //       break;
                  //     }
                  //     case ROLE.VENDOR: {

                  //       break;
                  //     }
                  //     case ROLE.VENDOR_AWAITING_APPROVAL: {

                  //       break;
                  //     }
                  //     case ROLE.CUSTOMER: {

                  //       break;
                  //     }
                  // }
                
            // this.setState(prev => {
            //        return {
            //          ...prev,
            //          user: user,
            //        }
            // });
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
                              
                              <Link style={style.linkStyle} to="/manage-admin">Manage Admins</Link>   
                               {(this.state.role === ROLE.ADMIN || this.state.role === ROLE.SUPER_ADMIN) &&
                                   <Link style={style.linkStyle} to="/manage-vendors">Manage vendors</Link>   
                               } 
                               {(this.state.role === ROLE.VENDOR) &&
                                  <Link style={style.linkStyle} to="/store-detail">Create store</Link> 
                               } 
                                
                               <Link style={style.linkStyle} to="/stores">Stores</Link>
                               <Link style={style.linkStyle} to="/products">Products</Link>
                               { this.state.role === ROLE.CUSTOMER &&
                                 <Link style={style.linkStyle} to="/vendor-request">Vendor Request</Link>
                               }
                               {this.state.role === ROLE.VENDOR_AWAITING_APPROVAL &&
                                    <span>Your Vendor Account is being Processed</span>
                               }
                                 <Link style={style.linkStyle} to="/manage-vendors">Manage vendors</Link>   
                              </div>
                        </Toolbar>
                      </AppBar>
                    </div>
                            <Route
                                
                            exact path={'/manage-stores'}
                           
                            component={()=><StoreList />}
                           />
                           
                           <Route
                          
                             path={'/store-detail/:id'}
                           
                            render={(props)=><StoreDetail storeId={props.match.params.id}/>}
                           />   

                           <Route
                             path={'/store-detail'}
                            render={(props)=><StoreDetail />}
                           />  
                        
                           <Route
                             exact
                             path={'/product/add/:id'}
                             render={(props)=><ProductDetail storeId={props.match.params.id} />}
                           /> 

                           <Route
                           exact
                           path={'/product/add/:id/:productId'}
                           render={(props)=><ProductDetail storeId={props.match.params.id} productId={props.match.params.productId} />}
                         /> 

                           
                           <Route
                           path={'/product/list/:id'}
                           render={(props)=><ProductList storeId={props.match.params.id} />}
                         /> 

                         <Route
                           path={'/stores'}
                           render={(props)=><PublicStoreListViewComponent/>}
                         /> 

                         <Route
                           path={'/products'}
                           render={(props)=><ProductListViewComponent/>}
                         /> 

                    

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
                           path={'/manage-admin'}
                           render={(props)=><AdminList />}/>
                           
                           
                         
                         <Redirect from="/" exact to="/stores" />
                            
                      </div>
                   </Router>
                  </div>
          )
    }
}
