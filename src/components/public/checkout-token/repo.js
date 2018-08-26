
export const getCartPrice = ({contract, account}) => {
      return new Promise((resolve, reject) => {
            contract.getCartPrice.call(1,{from: account}).then((result) => {
                console.log('result', result)
                const cartPrice = result.toNumber()
                resolve(cartPrice);
            })
      })
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

export const checkOutByToken = ({ account, storeInstance }) => {
 
     return new Promise((resolve, reject) => {
         
         storeInstance.checkOutTokenPayment(
                                1,//paymentMethod token
                          {
                                from:  account, gas: 3000000
                         }).then(() => {
                              console.log('checkout complete')
                         })
                         .catch((e)=> {
                         console.log('error', e)
                        })
             
    });
      
        
}


export const approveTokenPay = ({ account, cartPrice,storeContractAddress, tokenContract}) => {
   console.log(account, cartPrice,storeContractAddress, tokenContract)
     return new Promise((resolve, reject) => {
            
             tokenContract.approve(
                        storeContractAddress,
                        cartPrice, {
                        from: account, gas: 3000000
                    })
                    .then(() => {
                        resolve();
                    })
                    .catch((e)=> {
                         console.log('error', e)
                    })
    });
      
        
}

export const clearApproval = ({account, spender, tokenContract }) => {

     return new Promise((resolve, reject ) =>  {
             tokenContract
            .clearApproval(spender, {from: account})
            .then(function(iscleared) {
                  resolve(iscleared);
            })
     })
}