import React, { Component } from 'react';
import { getAccount, getWebContract} from '../../../services/app.service';
import * as REPO from './repo';
import * as helper from './helper';
import ipfs from '../../../ipfs';
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
            buffer: null
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
                const productId = event.args.productId.toNumber()
                console.log('-event', event, productId)
                this.setState({productId});
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
           //  const { name,quantity, price, priceInSpinelToken,description, account} = this.state;
             const storeIndex = this.props.storeId;
           
            REPO.createProduct({ name, price, priceInSpinelToken,quantity,description, account, storeIndex},this.storeInstance).then(r=>console.log)
             .catch(console.log);
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
        ipfs.files.add(this.state.buffer, (error, result) => {
             if(error) {
                 console.error(error);
             }
          
             const imageHash = result[0].hash;
             console.log('imageHash - ', imageHash)
              this.setState({
                 imageHash: imageHash
             })

           const { productId, storeIndex, account } = this.state;

           REPO.updateProductImage({ contract: this.storeInstance, 
           imageHash, storeIndex, productId, account})
        })
       console.log('submit file');
    }


    render() {
        return(
            <div>
                <h1>Product Details</h1>

                <form onSubmit={this.handleSubmit}>
                   <div>
                       <input type="text" placeholder="name" name={this.productNameInput} value={this.state.name} onChange={this.handleChange}/>
                    </div>

                     <div>
                      <input type="number" placeholder="price" name={this.productPriceInput} value={this.state.price} onChange={this.handlePriceChange}/>
                    </div>

                      <div>
                      <input type="number" placeholder="price in spinel" name={'priceInSpinelToken'} value={this.state.priceInSpinelToken} />
                    </div>
                    <div>
                      <input type="number" placeholder="quantity" name={this.productQuantityInput} value={this.state.quantity} onChange={this.handleChange}/>
                    </div>
                    <div>
                        <textarea name={this.productDescriptionInput}  value={this.state.description} onChange={this.handleChange}></textarea>
                    </div>

                    

                    <div>
                       <button type="submit">Save</button>
                   </div>
                </form>

                <form onSubmit={this.onSubmitFileForm}>
                   <h2>UPLOAD</h2>
                   <div>
                       <img src={`https://ipfs.io/ipfs/${this.state.imageHash}`} alt=""/>
                       <input type="file" onChange={this.captureFile}/>
                       <input type="submit"/>
                     </div>
                </form>
            </div>
        );
    }
}