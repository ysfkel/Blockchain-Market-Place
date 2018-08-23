

export const checkOut =({ account, contract, cartPrice}) => {
    console.log('--PAYLOAD', account, cartPrice)
    return new Promise((resolve, reject) => {
         console.log('==contract', contract)
          contract.checkOut(
              {from:account, 
          value: cartPrice,
          gas: 3000000})
          .then((result)=>{
       
       console.log('--checkout complete')
             resolve()
          })
    });
}