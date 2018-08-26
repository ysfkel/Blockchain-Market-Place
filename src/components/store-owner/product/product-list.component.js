import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import { getAccount, getWebContract} from '../../../services/app.service';
import { getProducts, deleteProduct } from './repo';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import * as styles from './styles';

class ProductList extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
            products: [],
              contractInstance:{},
              deleteClicked: false
        }
    }

    componentDidMount=() => { 
        const { storeId } = this.props;                 
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
            const storeIndex = storeId;
        
            this.storeInstance = contract;
            this.listenForDeleteEvent();
            getAccount((account) => {
                this.setState({account: account, storeIndex});
                getProducts({account, storeIndex , web3},contract ).then((products) => {
                      this.setState({products: products, storeIndex})
                });
            });
            
        })
     }

    listenForDeleteEvent = ()=> {
          this.storeInstance
          .ProductDeleted({}, {
              fromBlock:0,
              toBlock:'latest'
          })
          .watch((error, event) =>  {
               if(!error && this.state.deleteClicked) {
                     this.setState(prev =>{
                               prev.products = prev.products.filter((p, _index)=>p.productId!==productId);
                               return prev;
                         })
                         
               }
          })
    }

    deleteProduct =({storeIndex, productId}) => {
            if( this.storeInstance) {
                  this.setState({
                      deleteClicked: true
                  })
                  const { account } = this.state;
                  const contract = this.storeInstance;
                  deleteProduct({storeIndex, productId, account, contract})
                  .then((result)=>{
                         
                  }).catch((e)=>{
                         console.log('error', e)
                  })
            }
       }

   //
    render() {
        const { storeIndex, productId } = this.state;

        const products = this.state.products.map((p, index)=>{
             const { name, description, price, productId } = p;
                return(
                    <TableRow key={index}>
                        <TableCell>{name}</TableCell> 
                        <TableCell>{description}</TableCell> 
                        <TableCell>{price} </TableCell> 
                        <TableCell><Link to={`/product-edit/${storeIndex}/${productId}`}>Update</Link></TableCell>
                        <TableCell> <button  type="button" onClick={()=>this.deleteProduct({storeIndex, productId})}>delete</button></TableCell>
                       
                    </TableRow>
                )
        })


        return(
                     <div style={styles.container}>
              <h1>MANAGE PRODUCTS</h1>
                <div>
                     <Link to={`/product-add/${this.props.storeId }`}>ADD PRODUCT</Link>
                </div>
                 <Paper>
                
                    <Table>   
                        <TableHead>
                            <TableRow>
                                <TableCell >Name</TableCell>
                                <TableCell >Desccription)</TableCell>
                                <TableCell >Price (Ether)</TableCell>
                                <TableCell ></TableCell>
                                <TableCell ></TableCell>
                            </TableRow>
                        </TableHead> 
                        <TableBody>
                    
                             {products}
                                <TableRow>
                                <div style={{padding:'10px'}}>
                                </div>
                            </TableRow>
                        </TableBody>
                    </Table>
                    </Paper>

          
            </div>

        );
    }

}

export default ProductList;