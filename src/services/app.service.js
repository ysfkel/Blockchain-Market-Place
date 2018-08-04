
import { getWeb3Contract } from './web3.service';
import { resolve } from 'path';


export const getContract=(callback)=> {
  getWeb3Contract().then((web3Contract)=>{
        web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
          callback(marketPlaceContractInstance);
    })
  });
}

export const getWebContract=(callback)=> {
    getWeb3Contract().then((web3Contract)=>{
          web3Contract.contract.deployed().then((contract)=>{
            callback({web3:web3Contract.web3, contract});
      })
    });
  }
  
export const getAccount =(callback)=> {
    getWeb3Contract().then((web3Contract)=>{
        console.log('--getAccount  333',)
        web3Contract.web3.eth.getCoinbase((err, account) =>{
            console.log('--account  333',account)
            callback(account);   
        })
    });
}



