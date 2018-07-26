import React , { Component } from 'react';
import { getWeb3Contract } from '../../../services/web3.service';
import { Link } from 'react-router-dom'
export default class StoreDetail extends Component {
     
    constructor(props) {
        super(props);
        this.state={
            name:'',
            description:'',
            account:''
        }
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
                    from: this.state.account
                })
            } else {
                promise = this.storeInstance.createStore(this.state.name, this.state.description, {
                    from: this.state.account
                })
            }
            promise.then(function(e){
                console.log('ss result', e )
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

    componentDidMount() { 
        console.log('ss props', this.props)
     getWeb3Contract().then((web3Contract)=>{
        web3Contract.web3.eth.getCoinbase((err, account) =>{
              console.log('contractInstance yk 22',account );
            //    account="0x422437b6c32df2158a45e6e0cb0976b441b0efae"
               this.setState({account:account})
               //"0x01c490bb6e04066ce55aaf4168c2deb8efc19ea5"
               web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
                 marketPlaceContractInstance.userStoresCount(account).then(result=>{
                     this.storeInstance = marketPlaceContractInstance;
                     const count = result.toNumber()
                     console.log('-this.props.storeId', this.props);
                     if(this.props.storeId!==undefined) {
                        marketPlaceContractInstance.getOwnStore(this.props.storeId, {from:account}).then((storeResult)=>{
                           
                            const name = storeResult[0];
                            const description = storeResult[1];
                            this.setState({
                               name: name,
                               description: description
                            })
                          
                              console.log('ss', storeResult)
                        })
                     }
                        
                })
                     
             })
          
         })
      })
     }
   
     render() {
        return(
            <div>
                 <h1>STORE DETAIL</h1>
                 <Link to={`/product/add/${this.props.storeId }`}>add product</Link>
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
