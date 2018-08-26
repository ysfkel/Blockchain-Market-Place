import { getAccount, getContract, getWeb3 } from '../../../services/app.service';
import * as helper from './helper';

export const getProductsIds =({storeIndex, account}, contract) => {

    return new Promise((resolve, reject) => {
            console.log('-- storeIndex', storeIndex)
          contract.getProductsIdsVendor.call(storeIndex,{from:account})
          .then((result)=>{
              console.log('result count', result)
              const ids = result.map(i=>i.toNumber());
             resolve(ids)
          })
          .catch((e)=>{
              console.log('--error at getProductsIds', e)
              reject(e)
          })
    });
}


// export const listenForEvents: function({contractInstance}) {
   
//            contractInstance.ProductCreated({}, {
//                fromBlock:0,
//                toBlock: 'latest'
//            }).watch((error, event) => {
//                 console.log('-event', event)
//            });
    
// } 


export const createProduct =({ name, quantity,price, description, account, storeIndex, priceInSpinelToken}, contract) => {
  
  console.log('CREATE PRODUCT',  storeIndex, name, description, price, quantity,priceInSpinelToken)
   
    return new Promise((resolve, reject) => {
              contract.createProduct(storeIndex, name, description, price, quantity,priceInSpinelToken, {from:account})
              .then((result)=>{
                   console.log('...saved')
                   resolve();
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}

export const updateProductImage = ({contract, imageHash, account, storeIndex, productId}) => {
   return new Promise((resolve, reject) => {
              contract.updateProductImage(imageHash, storeIndex, productId, {from:account})
              .then((result)=>{
                   console.log('...image saved')
                   resolve();
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}
export const editProduct =({ name,quantity ,price, description, productId, account, storeIndex,priceInSpinelToken,contract}) => {
  console.log(' name, price',name, price)
    return new Promise((resolve, reject) => {
              contract.editProduct(storeIndex, productId, name, description, price, quantity, priceInSpinelToken,{from:account})
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
