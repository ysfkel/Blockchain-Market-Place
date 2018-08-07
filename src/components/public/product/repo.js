import * as helper from './helper';


export const getProductsIds =({storeIndex, accountIndex, account, contract}) => {

    return new Promise((resolve, reject) => {
          contract.getProductsIdsCustomer.call(accountIndex, storeIndex,{from:account})
          .then((result)=>{
              console.log('result count', result)
              const ids = result.map(i=>i.toNumber());
             resolve(ids)
          })
          .then((e)=>{
              console.log('--error', e)
              reject(e)
          })
    });
}


export const getProducts =({storeIndex, accountIndex, account, contract}) => {
    return new Promise((resolve, reject) => {
        getProductsIds({storeIndex, accountIndex, account, web3, contract}).then((productIds) => {
       
             const promise  = productIds.map((productId) => {
                   return contract.getProductCustomer.call(accountIndex, storeIndex, productId, {from: account});
             });
             Promise.all(promise).then((result) => {
                 if(result && result.length > 0) {
                         const products = result.map((productResult) => {
                               return helper.transformProduct({productResult, web3});
                         });
                         console.log('--products', products)
                         resolve(products);
                   
                 }
                
             })
        })
     });
}

