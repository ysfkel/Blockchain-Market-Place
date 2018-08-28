


export const getVendorBalance =({account,contract, web3}) => {

    return new Promise((resolve, reject) => {
              contract.getVendorBalance.call({from:account})
              .then((result)=>{
 

                   const balance = web3.fromWei(result.toNumber(),'ether');
                   resolve(balance);
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}

export const withdraw =({account,contract, web3}) => {

    return new Promise((resolve, reject) => {
              contract.withdraw({from:account, gas:3000000})
              .then((result)=>{
                   console.log('...withdrwal completed');
                     resolve();
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}

export const getTokenBalance =({ account, tokenContract}) => {

    return new Promise((resolve, reject) => {
          tokenContract.balanceOf.call(account, {from:account})
          .then((result)=>{
            const balance = result.toNumber();

            console.log('--balance', balance);
             resolve(balance)
          })
    });
}
