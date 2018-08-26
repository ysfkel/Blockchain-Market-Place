

export const getTotalSupply = ({  contract, web3 ,account}) => {
        return new Promise((resolve, reject) => {
         
                 contract.totalSupply.call({from: account}).then((totalSupplyResult) => {
                       resolve(totalSupplyResult.toNumber())
                 })
        })
    
}

export const transferAmountToTokenSaleContract = ({  contract, account, amountToSell, contractAddress}) => {
        return new Promise((resolve, reject) => {
         
                 contract.transfer(contractAddress, amountToSell, {from: account}).then((totalSupplyResult) => {
                       
                       resolve()
                 })
        })
    
}

export const getContractAddress = ({ contract, web3 ,account}) => {
     return new Promise((resolve, reject) => {
         
                 contract.getContractAddress.call().then((result) => {
                     
                       resolve(result)
                 })
        })
}


export const transferAmount = ({ contract, web3 ,account}) => {
     return new Promise((resolve, reject) => {
         
                 contract.getContractAddress.call().then((result) => {
                  
                       resolve(result)
                 })
        })
}