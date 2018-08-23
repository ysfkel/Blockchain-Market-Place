
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
        const { web3 } = web3Contract;
        web3.eth.getCoinbase((err, account) =>{
            web3.eth.getBalance(account, function(err, balance) {
                    const accountBalance = web3.fromWei(balance.toNumber(), 'ether')
                    callback(account, accountBalance);   
            })
         
          
        })
    });
}



