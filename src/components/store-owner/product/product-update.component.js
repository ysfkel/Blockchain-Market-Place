import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';
import * as helper from './helper';
import ipfs from '../../../ipfs';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import * as styles from './styles';
import CardMedia from '@material-ui/core/CardMedia';
import UpdateProductImageDialog from './update-product-image-dialog';

export default class ProductEdit extends Component{
      
    constructor(props) {
        super(props);

        this.state={
            name:'',
            description:'',
            price:0,
            quantity:0,
            priceInSpinelToken: 0,
            account:'',
            imageHash:'',
            buffer: null,
            formSubmitted: false,
            showUpdateProductImage: false,
            imageUploadInProgress: false
        }
        this.web3;
        this.productNameInput='name';
        this.productDescriptionInput='description';
        this.productPriceInput='price';
        this.productQuantityInput='quantity';
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handlePriceChange = this.handlePriceChange.bind(this);
        this.captureFile = this.captureFile.bind(this);
        this.onSubmitFileForm = this.onSubmitFileForm.bind(this);
        this.handleOpenUpdateImageDialog=this.handleOpenUpdateImageDialog.bind(this);
        this.handleCloseUpdateImageDialog=this.handleCloseUpdateImageDialog.bind(this);
    }

    componentDidMount=() => { 
        const { storeId, productId  } = this.props;   
        const storeIndex = storeId;            
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
            this.web3 = web3;
            this.storeInstance = contract;
            this.listenForEvents({contract})
            getAccount((account) => {
                this.setState({account: account, storeIndex, isUpdatable:(productId!==undefined)});
                if(storeId && productId) {
                  REPO.getProduct({ contract, web3 ,account, storeId, productId})
                  .then((product) => {
                      this.setState({...product})
                  });
                }
            });
            
        })
     }

    listenForEvents = ({contract}) => {
   
           contract.ProductCreated({}, {
               fromBlock:0,
               toBlock: 'latest'
           }).watch((error, event) => {
               
               if(this.state.formSubmitted) {
                    const productId = event.args.productId.toNumber()
                    this.setState({productId});
               }
           });
    
      } 

     handleSubmit = (e) => {
        e.preventDefault();
        if( this.storeInstance ) {
           let { name,quantity, price,priceInSpinelToken, description, productId, storeIndex, account} = this.state;
         
            price = this.web3.toWei(price);
         if(this.state.isUpdatable) {
            const { productId} = this.state;
            const contract = this.storeInstance;
            REPO.editProduct({ name, price,priceInSpinelToken,quantity ,description, productId, storeIndex, account, contract}).then(r=>console.log)
            .catch(console.log);
         } else {
             const storeIndex = this.props.storeId;
           
            REPO.createProduct({ name, price, priceInSpinelToken,quantity,description, account, storeIndex},this.storeInstance).then(r=>console.log)
             .catch(console.log);
             this.setState({formSubmitted:true});
        }
      }
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

    handlePriceChange = (e) => {
        e.preventDefault();
        
        const name =  e.target.name;
        const value = e.target.value;
        if(value > -1) {
         
        const tokens = helper.etherToSpinel({value, web3});
 
        this.setState(prev=>{
                prev['price']= value;
                prev['priceInSpinelToken'] = tokens;
                return {...prev}
        })
        }
      
        
    }
    
    captureFile = (e) => {
       e.preventDefault();
       const file = e.target.files[0];
       const reader = new FileReader();
       reader.readAsArrayBuffer(file);
       reader.onloadend = () => {
           this.setState({buffer: Buffer(reader.result)});
       }

    }

    onSubmitFileForm = (e) => {
          e.preventDefault();
          this.setState({imageUploadInProgress:true})
        ipfs.files.add(this.state.buffer, (error, result) => {
             if(error) {
                 console.error(error);
             }
          
             const imageHash = result[0].hash;
              this.setState({
                 imageHash: imageHash
             })
          this.setState({
              showUpdateProductImage:true,
              imageUploadInProgress:false
          });
        })
     
    }



      handleOpenUpdateImageDialog = () => {
           this.setState({ showUpdateProductImage: true });
       };

     handleCloseUpdateImageDialog = () => {
           this.setState({ showUpdateProductImage: false });
        };
           
 render() {
        return(
            <div style={styles.formContainer}>
              <Paper style={styles.innerContainer}>
                  <h3>Product Details</h3>
                 {!this.state.productId &&  
                  <p >
                     ( Upload Product Image after product has been created)
                  </p>
                 }
                <form onSubmit={this.handleSubmit}>
                  
                   <div>
                      
                        <TextField
                            style={styles.input}
                            type="text"
                            id="name"
                            label="Name"
                            name={this.productNameInput}
                            value={this.state.name}
                            onChange={this.handleChange}
                            margin="normal"
                            />
                    </div>

                     <div>
                       <TextField
                            style={styles.input}
                            type="text"
                            id="price"
                            label="Price"
                            name={this.productPriceInput}
                            value={this.state.price}
                            onChange={this.handlePriceChange}
                            margin="normal"
                            />
                    </div>

                      <div>
                        <TextField
                           style={styles.input}
                            type="text"
                            id="priceInSpinelToken"
                            label="price in spinel"
                            name={'priceInSpinelToken'}
                            value={this.state.priceInSpinelToken}
                            margin="normal"
                            />
                    </div>
                    <div>
                       <TextField
                            style={styles.input}
                            type="text"
                            id="quantity"
                            label="Quantity"
                            name={this.productQuantityInput}
                            value={this.state.quantity}
                            onChange={this.handleChange}
                            margin="normal"
                            />
                     
                    </div>
                    <div>
                      <TextField
                         style={styles.input}
                        id="multiline-flexible"
                        label="Description"
                        multiline
                        rowsMax="4"
                        name={this.productDescriptionInput}
                        value={this.state.description}
                        onChange={this.handleChange}
                        margin="normal"
                        />
                     </div>

                    

                    <div>
                       <button type="submit">Save</button>
                   </div>
                </form>

                {this.state.productId &&  
                    <form onSubmit={this.onSubmitFileForm}>
                   <h3>Upload Product Image</h3>
                   {this.state.imageUploadInProgress &&
                       <span>...please wait, we are upoading your image to ipfs :)</span>
                   }
                   <div>
             
                        <CardMedia
                            style={styles.image}
                            component="img"
                            image={`https://ipfs.io/ipfs/${this.state.imageHash}`}
                            title="Shop"
                        />

                       <input type="file" onChange={this.captureFile}/>
                       <input type="submit" value="UPLOAD IMAGE"/>
                     </div>

                     <UpdateProductImageDialog
                      open={this.state.showUpdateProductImage}
                      handleClose={this.handleCloseUpdateImageDialog} 
                      storeInstance={this.storeInstance} 
                      imageHash={this.state.imageHash} 
                      storeIndex={this.props.storeId} 
                      productId={this.state.productId}
                      account={this.state.account}
                     />
                </form>

                }
              </Paper>
            </div>
        );
    }
}

