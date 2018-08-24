


export const getVendorBalance =({account,contract, web3}) => {

    return new Promise((resolve, reject) => {
              contract.getVendorBalance.call({from:account})
              .then((result)=>{
                   console.log('...result balance', result);

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

                   //const balance = web3.fromWei(result.toNumber(),'ether');
                   resolve();
              })
              .then((e)=>{
                  
                  reject(e)
              })
     });
}
