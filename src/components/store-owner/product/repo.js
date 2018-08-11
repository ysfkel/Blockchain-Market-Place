import { getAccount, getContract, getWeb3 } from '../../../services/app.service';
import * as helper from './helper';

export const getProductsIds =({storeIndex, account}, contract) => {

    return new Promise((resolve, reject) => {
          contract.getProductsIdsVendor.call(storeIndex,{from:account})
          .then((result)=>{
              console.log('result count', result)
              const ids = result.map(i=>i.toNumber());
             resolve(ids)
          })
          .then((e)=>{
              console.log('--error at getProductsIds', e)
              reject(e)
          })
    });
}

export const createProduct =({ name, quantity,price, description, account, storeIndex}, contract) => {
       
    return new Promise((resolve, reject) => {
              contract.createProduct(storeIndex, name, description, price, quantity, {from:account})
              .then((result)=>{
                   console.log('...saved')
                   resolve();
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}

export const editProduct =({ name,quantity ,price, description, productId, account, storeIndex, contract}) => {

    return new Promise((resolve, reject) => {
              contract.editProduct(storeIndex, productId, name, description, price, quantity,{from:account})
              .then((result)=>{
                   console.log('...saved')
                   resolve();
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}


export const getProducts =({storeIndex, account}, contract) => {
 
    return new Promise((resolve, reject) => {
        getProductsIds({storeIndex, account, web3}, contract).then((productIds) => {
       
             const promise  = productIds.map((productId) => {
                   return contract.getProductVendor.call(storeIndex, productId, {from: account});
             });
             Promise.all(promise).then((result) => {
                 if(result && result.length > 0) {
                         const products = result.map((productResult) => {
                               return helper.transformProduct({productResult, web3});
                         });

                         resolve(products);
                   
                 }
                
             })
        })
     });
}

export const getProduct =({ contract, web3 ,account, storeId, productId}) => {
    return new Promise((resolve, reject) => {
        console.log('====storeIndex, productId', storeId, productId, account)
             contract.getProductVendor.call(storeId, productId, {from: account}).then((productResult) => {
                   const product = helper.transformProduct({productResult, web3});
                   resolve(product)
             })
        })
}


export const deleteProduct = ({storeIndex, productId, account, contract}) => {
      return new Promise((resolve, reject) => {
          contract.deleteProduct(storeIndex, productId, {from: account, gas: 3000000}).then((reesult) => {
                resolve();
          })
      });
}
