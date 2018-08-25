
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

export const checkOutByToken = ({ account, cartPrice, storeInstance ,tokenContract}) => {
     const address = storeInstance.address;
    console.log('--storeInstance addres',address , account, cartPrice)
     return new Promise((resolve, reject) => {
            
             tokenContract.approve(
                         address,
                        cartPrice, {
                        from: account, gas: 3000000
                    })
                    .then(() => {
                          console.log('approval complete')
                          storeInstance.checkOutTokenPayment(
                                1,//paymentMethod token
                                {
                                from:  account, gas: 3000000
                         }).then(() => {
                              console.log('checkout complete')
                         })
                    })
                    .catch((e)=> {
                         console.log('error', e)
                    })
    });
      
        
}