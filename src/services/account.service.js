

export const getUserRole =(storeContract,userAccount) => {
    return  new Promise((resolve, reject) => {
        storeContract.getUserRole.call({from:userAccount}).then((result)=>{
          
                resolve(result.toNumber());  
        }).catch(e=>console.log('e',e));      
    });             
}