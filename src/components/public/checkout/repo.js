

export const checkOut =({ account, contract, cartPrice}) => {

    return new Promise((resolve, reject) => {
        const checkoutTimeStamp = (new Date()).getTime();
          contract.checkOutTokenPayment(0,checkoutTimeStamp,
              {from:account, 
          value: cartPrice,
          gas: 3000000})
          .then((result)=>{
             resolve()
          })
    });
}