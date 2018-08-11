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

export const getProduct = ({ vendorAccountId, contract, web3 ,account, storeId, productId}) => {
        return new Promise((resolve, reject) => {
            console.log('====storeIndex, productId', storeId, productId, account)
                 contract.getProductCustomer.call(vendorAccountId,storeId, productId, {from: account}).then((productResult) => {
                       const product = helper.transformProduct({productResult, web3});
                       resolve(product)
                 })
        })
    
}

export const addItemToCart = ({vendor,  storeIndex,  productId, purchasedQuantity  , account, contract}) => {
    return new Promise((resolve, reject) => {
        contract.addItemToCart(vendor, storeIndex, productId, purchasedQuantity,  {from: account, gas: 3000000}).then((reesult) => {
              resolve();
        })
    });
}

