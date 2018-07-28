

export const getUserRole =(storeContract,userAccount) => {
    return  new Promise((resolve, reject) => {
        storeContract.getUserRole.call({from:userAccount}).then((result)=>{
                console.log('role result', result);
                resolve(result.toNumber());  
        });      
    });             
}