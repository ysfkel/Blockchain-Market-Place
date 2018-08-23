const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');

contract('MarketPlace', function(accounts) {
    
    let contractInstance;
    const owner = accounts[0];
    const customerAccount = accounts[1];
    const nonVendorAccount = accounts[3];
     const customer = {
                name: 'JOE',
                email: 'j@yahoo.com',
               phone: '0552443663',
               account: customerAccount
            }
    const updatedStoreName = 'store updated';
    const updatedStoreDescription= 'store description';
 
    it('Store Mnager ', function(){

        return MarketPlace.deployed().then(function(instance){
            contractInstance = instance;
            return contractInstance.requestVendorAccount(
                customer.name,
                customer.email,
                customer.phone,
                {
                    from: customer.account
                }
            );
        })
        //
       .then(function(receipt) {
     
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'VendorAccountRequested';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.status, true, ' logs the status of vendor account request');

               return contractInstance.createStore(
                 'store name',
                 'store description',
                {
                      from: customer.account
                }
             );
        })
        .then(assert.fail).catch(function(error) {
              assert(error.message.indexOf('revert') >=0, 'revert if the customer creating a store is in pending state but not approved')
             
              return contractInstance.createStore(
                 'store name',
                 'store description',
                {
                      from: nonVendorAccount
                }
             );
        })
         
        //
         .then(assert.fail).catch(function(error) {
     
            assert(error.message.indexOf('revert') >=0, 'revert if the customer creating a store is neither approved nor in pending state ')
             
             
               return contractInstance.approveVendorAccount(
                customer.account,
                {
                    from: owner
                }
            );
        })
         .then(function(receipt) {

            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'VendorAccountApproved';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.status, true, ' logs the status of vendor account request');

             return contractInstance.createStore(
                 'store name',
                 'store description',
                {
                      from: customer.account
                }
             );
            
        })
        .then(function(receipt) {
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'StoreCreated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.storesSize, 1, ' logs the store size');
            const storeIndex = 0;
              return contractInstance.editStore(
                 storeIndex ,
                 updatedStoreName,
                 updatedStoreDescription,
                {
                      from: customer.account
                });
          })
         .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'StoreUpdated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');

                return contractInstance.getVendorStoreCountPublic(
                 0);
         })
           .then(function(storesCount) {
             
               assert.equal(storesCount[1].toNumber(), 1, 'gets the vendors stores count');
           
              const storeIndex = 0;
             return contractInstance.editStore(
                 storeIndex ,
                 updatedStoreName,
                 updatedStoreDescription,
                {
                      from: nonVendorAccount
                });
            
        })
          .then(assert.fail).catch(function(error) {
     
            assert(error.message.indexOf('revert') >=0, 'revert if the customer editing the store is not approved vendor ')
             
             
            const storeIndex = 90;
             return contractInstance.editStore(
                 storeIndex ,
                 updatedStoreName,
                 updatedStoreDescription,
                {
                         from: customer.account
                });
          
        })
         .then(assert.fail).catch(function(error) {
     
            assert(error.message.indexOf('revert') >=0, 'revert if store does not exist ')
             
             
            const storeIndex = 0;
             return contractInstance.deleteStore(
                 storeIndex ,
                {
                      from: nonVendorAccount
                });
        })
        .then(assert.fail).catch(function(error) {
     
            assert(error.message.indexOf('revert') >=0, 'revert non approved user attempts to delete store ')
             
             
            const storeIndex = 90;
             return contractInstance.deleteStore(
                 storeIndex ,
                {
                     from: customer.account
                });
        })
         .then(assert.fail).catch(function(error) {
     
            assert(error.message.indexOf('revert') >=0, 'revert  if store to delete does not exist ')
             
             
            const storeIndex = 0;
             return contractInstance.deleteStore(
                 storeIndex ,
                {
                      from: customer.account
                });
        })
       .then(function(receipt) {

            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'StoreDeleteted';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.storesSize, 0, ' logs the number of vendors stores');

            return contractInstance.getUserStoreCount();
           
            
        })
         .then(function(storesCount) {

            assert.equal(storesCount.toNumber(), 0, 'returns correct number of the vendors stores');
           
           // return contractInstance.getUserStoreCount();
           
            
        })
    })

});