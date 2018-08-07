
import * as helper from './helper';

export const getVendorAccountsWithListedStoresCount =({ account, contract}) => {

    return new Promise((resolve, reject) => {
              contract.getVendorAccountsWithListedStoresCount.call({from:account})
              .then((result)=>{
                   resolve(result.toNumber());
              });
     });
}

// export const getVendorAccountIndexes = ({storeOwnersCount, account}) => {
//     const accountIndexes = [...Array(storeOwnersCount).keys()];
//     const promise  = accountIndexes.map((accountIndex) => {
//         return contract.getVendorStoreCountPublic.call(accountIndex, {from: account});
//     });

//     return promise;
// }
export const getStore =({ account,web3 ,contract}) => {

    return new Promise((resolve, reject) => {
         getVendorAccountsWithListedStoresCount({ account, contract})
              .then((storeOwnersCount)=>{
                  
                       const accountIndexes = [...Array(storeOwnersCount).keys()];
                        const promise  = accountIndexes.map((accountIndex) => {
                            return contract.getVendorStoreCountPublic.call(accountIndex, {from: account});
                        });
                   
                        Promise.all(promise).then((result) => {
                            const vendorStoreIndexes = result.map((r) => {  
                                  return {
                                       accounIndex: r[0].toNumber(), 
                                       storeIndexes: [...Array(r[1].toNumber()).keys()]
                                  }
                             });
                             
                             let storePromise = [];
                             vendorStoreIndexes.forEach((vendor) => {
                                const { accounIndex } = vendor;
                                const vendorStoresPromise = vendor.storeIndexes.map((storeIndex) => {
                                     return contract.getStorePublic(accounIndex, storeIndex, {from: account});
                                });

                                storePromise.push(vendorStoresPromise);
                            });

                            let promise = [];

                                storePromise.forEach((p) => {
                                    p.forEach((i) => {
                                        promise = [...promise, i];
                                    })
                                })

                                  Promise.all(promise).then((storeResults) => {
                                    const stores = storeResults.map(( storeResult ) => {
                                          return helper.transformStore({storeResult, web3});
                                    });
                                    resolve(stores)
                                 })

                        })
              })

     });
}


