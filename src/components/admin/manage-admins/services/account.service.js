import { getWeb3Contract } from '../../../../services/web3.service';




export const getAdminUsersCount =(storeContract, account, callback) => {
    if(storeContract && account && callback) {
        storeContract.getAdminUsersCount.call({from:account}).then(result=>{
            callback(result.toNumber());
        });
    } else {
        throw 'insufficient method parameters';
    }
}


export const getAdminUser =(storeContract,adminAccount, userAccount) => {
    return  new Promise((resolve, reject) => {
        storeContract.getAdminUser.call(adminAccount, {from:userAccount}).then((result)=>{
                resolve(processUser(result));  
        });      
    });             
}

export const getAdminUsersList =(storeContract, account) => {
    return  new Promise((resolve, reject) => {
        getAdminUsersCount(storeContract, account, (count)=> {
            let users = [];
            let _count = 0;
            for(let i=0; i<count; i++) {
                        
                storeContract.getAdminUser.call(i, {from:account}).then((result)=>{
                    
                    users.push(processUser(result));
                    _count++;
                    if(_count == count) {
                        resolve(users);
                    }
                
                });
                
            }

        });  
  });             
}



// export const getUserAccount =(storeContract,userAccount) => {
//     return  new Promise((resolve, reject) => {
//         storeContract.getVendorByAddress.call(userAccount, {from:userAccount}).then((result)=>{
//                 resolve(processVendor(result));  
//         });      
//     });             
// }


export const processVendor =(adminResult) => {
    const name =  adminResult[0];
    const role = adminResult[1];
    const account = adminResult[2];

    return {
        name, role, account, 
    }
}