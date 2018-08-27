import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import * as styles from './styles';

export default class ProductDetail extends Component{
      
    constructor(props) {
        super(props);

        this.state={
            name:'',
            description:'',
            price:0,
            quantity:0,
            purchasedQuantity: 0,
            account:''
        }
  
        this.productQuantityInput='purchasedQuantity';
        this.handleAdToCart = this.handleAdToCart.bind(this);
        // this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount=() => { 
   
        const { storeId , productId , accountId} = this.props;  
        const storeIndex = storeId;
        const vendorAccountId = accountId;             
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
 
            this.storeInstance = contract;
            getAccount((account) => {
                 this.setState({account: account, storeIndex, productId});
                if(storeId && productId) {
                    REPO.getProduct({ vendorAccountId,contract, web3 ,account, storeId, productId})
                  .then((product) => {
                  
                      this.setState({...product})
                  });
                }
            });
            
        })
     }
     handleAdToCart = (e) => {
        
        e.preventDefault();
            const { vendor,  storeIndex,  productId, purchasedQuantity, account } = this.state;
            const contract = this.storeInstance;
            REPO.addItemToCart({ vendor,  storeIndex,  productId, purchasedQuantity  , account, contract}).then(r=>console.log)
            .catch(console.log);
      
    }


    handleChange = (e) => {
        e.preventDefault();
        const name =  e.target.name;
        const value = e.target.value;
        this.setState(prev=>{
                prev[name]= value;
                return {...prev}
        })
        
    }

    render() {
        return(
            <Card style={styles.container}>
            <CardMedia
               style={styles.image}
              component="img"
              image={`https://ipfs.io/ipfs/${this.state.imageHash}`}
              title="Shop"
            />
           
            <CardContent>
              <Typography gutterBottom variant="headline" component="h3">
                {this.state.name}
              </Typography>
              <Typography >
                 {this.state.price}
              </Typography>
              <Typography >
                 {this.state.quantity}
              </Typography>
              <Typography >
                 {this.state.description}
              </Typography>
              <div>
                       <form onSubmit={this.handleAdToCart}>
                       <input type="text" placeholder="name" name={this.productQuantityInput} value={this.state.purchasedQuantity} onChange={this.handleChange}/>
                    
                       <button type="submit">Add to cart</button>
                       </form>
                   </div>
               
            </CardContent>
           
          </Card>
           
        );
    }
}

{/* <div>
<h1>Product Details</h1>
  <div>
     <img src={`https://ipfs.io/ipfs/${this.state.imageHash}`} alt=""/>
      
  </div>
   <div>
       <strong> {this.state.name} </strong>
    </div>

     <div>
      <strong> {this.state.price} </strong>
    </div>
    <div>
      <strong> {this.state.quantity} </strong>
    </div>
    <div>
        <strong> {this.state.description}</strong>
    </div>

   

    <div>
       <form onSubmit={this.handleAdToCart}>
       <input type="text" placeholder="name" name={this.productQuantityInput} value={this.state.purchasedQuantity} onChange={this.handleChange}/>
    
       <button type="submit">Add to cart</button>
       </form>
   </div>

</div> */}