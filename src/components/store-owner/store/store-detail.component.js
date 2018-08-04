import React , { Component } from 'react';
import { Link } from 'react-router-dom';
import { getAccount, getWebContract} from '../../../services/app.service';
import { getStore } from './helper';

export default class StoreDetail extends Component {
     
    constructor(props) {
        super(props);

        this.state={
            name:'',
            description:'',
            account:''
        }
        this.storeInstance;
        this.storeNameInput='name';
        this.storeDescriptionInput='description'

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit = (e) => {
           e.preventDefault();
           if( this.storeInstance ) {
            let promise;
            if(this.props.storeId!==undefined) {
                promise = this.storeInstance.editStore(this.props.storeId,this.state.name, this.state.description, {
                    from: this.state.account, gas: 3000000
                })
            } else {
                const { account } = this.state;

                promise = this.storeInstance.createStore(this.state.name, this.state.description, {
                    from: account, gas: 3000000
                })
            }
            promise.then(function(e){
          
            })
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

   
    componentDidMount=() => { 
        const { storeId } = this.props;                 
        getWebContract((web3Contract) => {
            const { contract } =  web3Contract ;
            const { web3 } = web3Contract;
 
            this.storeInstance = contract;
            getAccount((account) => {
                this.setState({account: account});
                if(storeId) {
                  getStore({ contract, web3 ,account, storeId})
                  .then((store) => {
                      this.setState({...store})
                  });
                }
            });
            
        })
     }
   
     render() {
        return(
            <div>
                 <h1>STORE DETAIL</h1>
                 <Link to={`/product-add/${this.props.storeId }`}>add product</Link>
                 <form onSubmit={this.handleSubmit}>
                    <div>
                       <input type="text" name={this.storeNameInput} value={this.state.name} onChange={this.handleChange}/>
                    </div>
                    <div>
                       <textarea name={this.storeDescriptionInput}  value={this.state.description} onChange={this.handleChange}></textarea>
                    </div>
                    <div>
                        <button type="submit">Save</button>
                    </div>
                 </form>
            </div>
        )
    }
}
