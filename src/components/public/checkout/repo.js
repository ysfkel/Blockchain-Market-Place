

export const checkOut =({ account, contract, cartPrice}) => {

    return new Promise((resolve, reject) => {
     
          contract.checkOutTokenPayment(0,
              {from:account, 
          value: cartPrice,
          gas: 3000000})
          .then((result)=>{
             resolve()
          })
    });
}