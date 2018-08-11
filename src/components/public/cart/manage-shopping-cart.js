    import React, { Component } from 'react';
    import { getAccount, getWebContract} from '../../../services/app.service';
    import * as REPO from './repo';
    import Table from '@material-ui/core/Table';
    import TableBody from '@material-ui/core/TableBody';
    import TableCell from '@material-ui/core/TableCell';
    import TableHead from '@material-ui/core/TableHead';
    import TableRow from '@material-ui/core/TableRow';
    import Paper from '@material-ui/core/Paper';
    import Button from '@material-ui/core/Button';

    export default class ManageShoppingCart extends Component {

        constructor(props) {
            super(props)
            this.state = {
               products:[], 
               account:'',
               cartPrice:0
            }
            this.handleChange = this.handleChange.bind(this);
            this.handleDelete=this.handleDelete.bind(this);
            this.handleUpdate=this.handleUpdate.bind(this);
            this.quantiyInput = "quantity";
        }
        
        componentDidMount=() => { 
            const { storeId , productId } = this.props;               
            getWebContract((web3Contract) => {
                const { contract } =  web3Contract ;
                const { web3 } = web3Contract;
    
                this.storeInstance = contract;
                getAccount((account) => {
                    this.setState({account: account});
                // if(storeId && productId) {
                        REPO.getCartItem({ contract, web3 ,account})
                        .then((products) => {
                            console.log('--product', products)
                            this.setState({products})
                        });

                        REPO.getCartPrice({ contract ,account})
                        .then(cartPrice => {
                              this.setState({cartPrice});
                        })
                    // }
                });
                
            })
        }


        

        handleChange = ({event,index}) => {
            const quantity = event.target.value;
            this.setState(prev=>{
                prev.products[index] = {...prev.products[index], quantity}
                prev.products = [...prev.products]
                    return {...prev}
            })
            
        }

        handleUpdate = () => {
  
          REPO.updateCartItem({account: this.state.account, products: this.state.products, contract: this.storeInstance}).then(()=>{
            console.log('updated!')
          })
        }

        handleDelete = ({productId}) => {
           
           
            REPO.deleteCartItem({account:this.state.account, productId, contract:this.storeInstance}).then(()=>{
                console.log('item deleted')
            })
        }


        render() {
            const products = this.state.products.map((product, index)=>{
                return(
                    <TableRow key={index}>
                    <TableCell>{product.name}</TableCell> 
                    <TableCell numeric>{product.price}</TableCell> 
                    <TableCell numeric><input type="number" placeholder="Quantity" 
                    name={this.quantiyInput} value={product.quantity} 
                    onChange={(event) => this.handleChange({event,index})}></input></TableCell> 
                            <TableCell > 
                                <Button type="button" onClick={(e)=>this.handleDelete({
                                    productId:product.productId
                                })}>
                                DELETE
                            </Button></TableCell> 
                    </TableRow>
                )
        })
            return(
            <div>
                    <h1>SHOPPING CART</h1>
            <Paper>
            
                <Table>   
                    <TableHead>
                        <TableRow>
                            <TableCell >Name</TableCell>
                            <TableCell numeric>Price</TableCell>
                            <TableCell numeric>Quantity </TableCell>
                            <TableCell > </TableCell>
                        </TableRow>
                    </TableHead> 
                    <TableBody>
                
                    {products}
                    <TableRow>
                            <TableCell>Cart Price: {this.state.cartPrice}</TableCell>
                            <TableCell >
                            <Button type="button" onClick={(e)=>this.handleUpdate()}>
                                UPDATE CART
                            </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Paper>
            </div>
            );
        }
    }