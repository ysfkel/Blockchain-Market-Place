import { getAccount, getContract } from '../../../services/app.service';


export const getUsersStoreCount =(contract, account) => {
    console.log('contract',contract)
    return new Promise((resolve, reject) => {
          contract.userStoresCount(account)
          .then((result)=>{
              console.log('result', result)
              resolve(result)
          })
          .then((e)=>{
              console.log('--error', e)
              reject(e)
          })
    });
}