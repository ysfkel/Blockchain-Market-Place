import { getWeb3Contract } from '../../../../services/web3.service';




export const getPendingVendorsCount =(storeContract, account, callback) => {
    if(storeContract && account && callback) {
        storeContract.getPendingVendorsCount.call({from:account}).then(result=>{
            callback(result.toNumber());
        });
    } else {
        throw 'insufficient method parameters';
    }
}
export const getApprovedVendorsCount =(storeContract, account, callback) => {
    if(storeContract && account && callback) {
        storeContract.getApprovedVendorsCount.call({from:account}).then(result=>{
            callback(result.toNumber());
        });
    } else {
        throw 'insufficient method parameters';
    }
}

export const getStatusText =(status) => {
    let text = 'Not Available';
    switch(status) {
       case 0: {
         text = 'Pending';
          break;
       }
       case 1: {
        text = 'Approved';
        break;
      }
    }
   return text;
}

export const getVendor =(storeContract,vendorAccount, userAccount) => {
    return  new Promise((resolve, reject) => {
        storeContract.getVendorByAddress.call(vendorAccount, {from:userAccount}).then((result)=>{
                resolve(processVendor(result));  
        });      
    });             
}

export const getPendingVendors =(storeContract, account) => {
    return  new Promise((resolve, reject) => {
        getPendingVendorsCount(storeContract, account, (count)=> {
            let vendors = [];
            let _count = 0;
            for(let i=0; i<count; i++) {
                        
                storeContract.getPendingVendorByIndex.call(i, {from:account}).then((result)=>{
                    
                    vendors.push(processVendor(result));
                    _count++;
                    if(_count == count) {
                        resolve(vendors);
                    }
                
                });
                
            }

        });  
  });             
}

export const getApprovedVendors =(storeContract, account) => {
    return  new Promise((resolve, reject) => {
        getApprovedVendorsCount(storeContract, account, (count)=> {
            let vendors = [];
            let _count = 0;
            for(let i=0; i<count; i++) {
                        
                storeContract.getApprovedVendorByIndex.call(i, {from:account}).then((result)=>{
                    
                    vendors.push(processVendor(result));
                    _count++;
                    if(_count == count) {
                        resolve(vendors);
                    }
                
                });
                
            }

        });  
  });             
}


export const getUserAccount =(storeContract,userAccount) => {
    return  new Promise((resolve, reject) => {
        storeContract.getVendorByAddress.call(userAccount, {from:userAccount}).then((result)=>{
                resolve(processVendor(result));  
        });      
    });             
}


export const processVendor =(vendorResult) => {
    const name =  vendorResult[0];
    const email = vendorResult[1];
    const phone = vendorResult[2];
    const status = vendorResult[3].toNumber();
    const account = vendorResult[4]; 
    const statusText = getStatusText(status);

    return {
        name, email, phone, status, statusText, account, 
    }
}