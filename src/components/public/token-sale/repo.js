
export const buyTokens =({ tokenAmount, price ,account, tokenSaleContract}) => {

    return new Promise((resolve, reject) => {
              tokenSaleContract
              .buyTokens(tokenAmount, {from:account, value:price, 
              gas: 3000000 })
              .then((result)=>{
                   console.log('...buyTokens complete')
                   resolve();
              })
              .catch((e)=>{
                  
                  reject(e)
              })
     });
}

export const getAmountOfTokensOnSale = ({tokenContract,saleContractAddress}) => {
       return new Promise((resolve, reject) => {
              tokenContract
              .balanceOf.call(saleContractAddress)
              .then((balance) => {
                    
                    resolve(balance.toNumber());
              })
       })
}

export const getTokenBalance =({ account, tokenContract}) => {

    return new Promise((resolve, reject) => {
          tokenContract.balanceOf.call(account, {from:account})
          .then((result)=>{
            const balance = result.toNumber();

             resolve(balance)
          })
    });
}