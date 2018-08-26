import React, { Component }from 'react';
import { Link } from 'react-router-dom';
import { getAccount, getWebContract} from '../../../services/app.service';
import { getProducts, deleteProduct } from './repo';

class ProductList extends Component {
       
    constructor(props) {
        super(props);
        this.storeInstance;
        this.state = {
              account: '',
            products: [],
              contractInstance:{}
        }
    }

    componentDidMount=() => { 
        const { storeId } = this.props;                 
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
            const storeIndex = storeId;
        
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account, storeIndex});
                getProducts({account, storeIndex , web3},contract ).then((products) => {
                      console.log('products',products)
                      this.setState({products: products, storeIndex})
                });
            });
            
        })
     }

    deleteProduct =({storeIndex, productId}) => {
            if( this.storeInstance) {
                  const { account } = this.state;
                  const contract = this.storeInstance;
                  deleteProduct({storeIndex, productId, account, contract})
                  .then((result)=>{
                         this.setState(prev =>{
                               prev.products = prev.products.filter((p, _index)=>p.productId!==productId);
                               return prev;
                         })
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
            return(<div key={index}>
                 <span>{name}</span> <span>{description}</span>  <span>{price}</span>  
                 <Link to={`/product-edit/${storeIndex}/${productId}`}>edit</Link>
                 <button  type="button" onClick={()=>this.deleteProduct({storeIndex, productId})}>delete</button>
             
              </div>)
      })
        return(
            <div>
              <h1>PRODUCT LIST</h1>
              <p>
              {products}
              </p>
            </div>
        );
    }

}

export default ProductList;