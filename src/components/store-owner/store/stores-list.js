import React , { Component } from 'react';
import {  Link  } from 'react-router-dom';
import { getUserStoreCount } from './helper';
import * as appService  from '../../../services/app.service';
import { getStores } from './helper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import * as styles from './styles';

export default class StoreList extends Component {
   
    constructor(props) {
        super(props);

        this.state = {
           account: '',
            stores: [],
            contractInstance:{}
        }
        this.storeInstance;
        this.deleteStore = this.deleteStore.bind(this);

    }
     componentDidMount() {
      
        appService.getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            this.storeInstance = contract;
            appService.getAccount((account) => {
                this.setState({account: account});
                  getStores(web3Contract,account).then((stores) => {
                     this.setState({stores})
                  });
            });
            
        });
      }

    deleteStore =(index) => {

         if( this.storeInstance) {
               this.storeInstance.deleteStore(index, {from: this.state.account, gas: 3000000})
               .then((result)=>{
              
                      this.setState(prev =>{
                            prev.stores = prev.stores.filter((store, _index)=>_index!==index);
                            return prev;
                      })
               }).catch((e)=>{
                      console.log('error', e)
               })
         }
    }
    
    render() {

           const stores = this.state.stores.map((store, index)=>{
                return(
                    <TableRow key={index}>
                        <TableCell>{store.name}</TableCell> 
                        <TableCell>{store.description}</TableCell> 
                        <TableCell>{store.revenue}</TableCell> 
                        <TableCell><Link to={`/edit-store/${index}`}>details</Link></TableCell>
                        <TableCell><Link to={`/product/list/${index}`}>products</Link></TableCell>
                        <TableCell><button  type="button" onClick={()=>this.deleteStore(index)}>delete</button>
                        </TableCell>      
                    </TableRow>
                )
        })
        return(
            <div style={styles.container}>
              <h1>MANAGE STORES</h1>
                 <Paper>
                
                    <Table>   
                        <TableHead>
                            <TableRow>
                                <TableCell >Name</TableCell>
                                <TableCell >Desccription)</TableCell>
                                <TableCell >Revenue</TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                    
                        {stores}
                                <TableRow>
                                <div style={{padding:'10px'}}>
                                </div>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </Paper>

          
            </div>
        )
    }
}
