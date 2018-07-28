
import { getWeb3Contract } from './web3.service';


export const getContract=(callback)=> {
  getWeb3Contract().then((web3Contract)=>{
        web3Contract.contract.deployed().then((marketPlaceContractInstance)=>{
          callback(marketPlaceContractInstance);
    })
  });
}

export const getAccount =(callback)=> {
    getWeb3Contract().then((web3Contract)=>{
        web3Contract.web3.eth.getCoinbase((err, account) =>{
            callback(account);   
        })
    });
}