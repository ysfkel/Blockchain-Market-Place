import * as appHelper from '../../../../helpers/helpers';

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
        storeContract.getAdminUserByAddress.call(adminAccount, {from:userAccount}).then((result)=>{
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
                        
                storeContract.getAdminUserByIndex.call(i, {from:account}).then((result)=>{
                    
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

//string name, address account, uint role
export const createAdminUser =(newAccount, storeContract, account) =>  {

    return new Promise((resolve, reject) => {
     
           if(storeContract && account) {
            storeContract.createAdminUser(newAccount.name, newAccount.account, newAccount.role,{from:account}).then(result=>{
                   
            }).then((r) => {
              
                resolve(r);
            }).catch((e)=>{
        
                reject(e);
            })
        } else {
              console.log('insufficient method parameters')
              reject('insufficient method parameters');
        }
    })
}


export const processUser =(adminResult) => {
    const roleNumber = adminResult[1].toNumber();
    const name =  adminResult[0];
    const role = roleNumber;
    const roleText = appHelper.getUserRoleText(roleNumber);// adminResult[1];
    const account = adminResult[2];

    return {
        account, name, role, roleText 
    }
}