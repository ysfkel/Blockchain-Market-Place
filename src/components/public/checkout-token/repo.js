

export const getTokenBalance =({ account, tokenSaleContract}) => {

    return new Promise((resolve, reject) => {
          tokenSaleContract.getBalanceOf.call(account, {from:account})
          .then((result)=>{
            const balance = result.toNumber();

            console.log('--balance', balance);
             resolve(balance)
          })
    });
}