import React , { Component } from 'react';
import { BrowserRouter as Router, Link , Route, Redirect } from 'react-router-dom';
import StoreList from './components/store-owner/stores-list';
import StoreDetail from './components/store-owner/store/store-detail.component';
import ProductList from './components/store-owner/product/product-list.component';
import ProductDetail from './components/store-owner/product/product-detail.component';
import PublicStoreListViewComponent from './components/public/store/list-view.component';
import ProductListViewComponent from './components/public/product/list-view.component';
import ManageVendors from './components/admin/manage-vendors/manage-vendors';
import Web3 from 'web3';
import TruffleContract from 'truffle-contract';
import MarketPlace from '../build/contracts/MarketPlace.json';
import store from './app.store';
import * as actions from './state-manager/action-creators';
import * as actionDispatchers from './state-manager/action-dispatchers';
export default class App extends Component{
   
    constructor(props) {
        super(props);

        this.state = {
            account: '0x0',
            stores: [],
            contractInstance:{}
        }

        if(typeof web3 != 'undefined') {
            this.web3Provider = web3.currentProvider;
        } else {
            this.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:8545');
        }

        this.web3 = new Web3(this.web3Provider);

        this.marketPlace = TruffleContract(MarketPlace);
        this.marketPlace.setProvider(this.web3Provider);
    }

          
  

      componentDidMount() {
     //  return new Promise((res) => {
        this.web3.eth.getCoinbase((err, account) =>{
              store.dispatch(actions.SetAccountAction(account));
              console.log('contractInstance yk',account )
             
          
            //this.marketPlace.deployed().then((marketPlaceContractInstance)
             this.marketPlace.deployed().then((marketPlaceContractInstance)=>{
               // console.log('marketPlaceContractInstance');
                 //this.setState({ contractInstance: marketPlaceContractInstance })
                // this.setState((res)=>{
                       
                //     return {
                //         contractInstance: marketPlaceContractInstance
                //     }
                //  })
               // store.dispatch(actionDispatchers.test(marketPlaceContractInstance));
                //    this.setContract(marketPlaceContractInstance).then(()=>{
                //          console.log('set -')
                //    })
            })
          
        })
       
        // this.setContract((contractInstance)=>{
        //     console.log('contractInstance', contractInstance)

        //      this.props.setContract(contractInstance, ()=>{
        //         this.setState({ contractInstance: contractInstance })
        //            console.log('completed')
        //      }).then(()=>{
                 
        //      })
           
        //  })
       // });
   }

   

   setContract = (callback) => {
    console.log('contractInstance 1',)
     return new Promise((res, rej)=>{
        this.marketPlace.deployed().then((marketPlaceContractInstance)=>{
            console.log('contractInstance 2')
                res(marketPlaceContractInstance);
                callback(marketPlaceContractInstance)
        })
     })
   }


   setContractInstance=()=>{
       if(this.state.contractInstance) {
           this.props.setContract(this.state.contractInstance, ()=>{
            // this.setState({ contractInstance: contractInstance })
                 console.log('completed')
             })
       }
        
   }
    
   

    render(){
           this.setContractInstance();
          return(
                  <div >
                  <h1>WELCOME TO  MILKY WAY UNIVERSAL</h1>
                  <h3>BUY AND SELL UNIVERSALLY :)</h3>
                    
                     <Router >
                      <div>
                     
                        <ul>
                        <li><Link to="/manage-stores">Manage stores</Link></li>
                        <li><Link to="/store-detail">Create stores</Link></li>
                        <li><Link to="/stores">Stores</Link></li>
                        <li><Link to="/products">Products</Link></li>
                        <li><Link to="/manage-vendors">Manage vendors</Link></li>
                        </ul>
                        
                           
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
                           path={'/manage-vendors'}
                           render={(props)=><ManageVendors/>}/>

                         
                         
                         <Redirect from="/" exact to="/stores" />
                            
                      </div>
                   </Router>
                  </div>
          )
    }
}
