
import * as  helper  from './helper';

export const getProductsIds =({ account, contract}) => {

    return new Promise((resolve, reject) => {
          contract.getCartItemsIds.call({from:account})
          .then((result)=>{
       

              const ids = result.map(i=>i.toNumber());
             resolve(ids)
          })
    });
}

export const getCartPrice = ({contract, account}) => {
      return new Promise((resolve, reject) => {
            contract.getCartPrice.call({from: account}).then((result) => {
                console.log('result', result)
                const cartPrice = web3.fromWei(result.toNumber(), 'ether');
                resolve(cartPrice);
            })
      })
}

export const getCartItem =({account, contract, web3}) => {
    return new Promise((resolve, reject) => {
        getProductsIds({ account, web3, contract}).then((productIds) => {

             const promise  = productIds.map((productId) => {
                   return contract.getCartItem.call( productId, {from: account});
             });
             Promise.all(promise).then((result) => {
                if(result && result.length > 0) {
                         const products = result.map((productResult) => {
                               return helper.transformProduct({productResult, web3});
                         });
               
                         resolve(products);
                   
                 }
                
             }).catch(function(e) {
                  console.log('error while fetching cart items')
             })

        })
        
    })
}

export const updateCartItem = ({account, products, contract}) => {
      return new Promise((resolve, reject) => {const promise = products.map(({productId, vendorAccount, storeIndex, quantity}) => {
            
             return contract.updateCartItem(vendorAccount, storeIndex, productId, quantity, {from: account});
       });

       Promise.all(promise).then((result) => {

            resolve();
       })
    })
}

export const deleteCartItem = ({account, productId, contract}) => {
    return new Promise((resolve, reject) => {
        contract.deleteCartItem(productId, {from:account, gas: 3000000})
        .then((result)=>{
           
     
           resolve()
        })
  });
}




