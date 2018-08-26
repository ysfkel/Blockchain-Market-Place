const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');

contract('MarketPlace', function(accounts) {
    
    let contractInstance;
    const owner = accounts[0];
    const customerAccount = accounts[1];
     const customer = {
                name: 'JOE',
                email: 'j@yahoo.com',
               phone: '0552443663',
               account: customerAccount
            }
 
    it('managers vendors', function(){

        return MarketPlace.deployed().then(function(instance){
            contractInstance = instance;
            return contractInstance.getPendingVendorsCount();
        })
        .then(function(pendingVendorsCount) {
               assert.equal(pendingVendorsCount.toNumber(), 0, 'pending vendors should equal 0')
              return contractInstance.getApprovedVendorsCount();
        })
        .then(function(approvedVendorsCount) {
              assert.equal(approvedVendorsCount.toNumber(), 0, 'approved vendors should equal 0')
              return contractInstance.requestVendorAccount(
                customer.name,
                customer.email,
                customer.phone,
                {
                    from: customer.account
                }
            );
        })

        .then(function(receipt) {
                     
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'VendorAccountRequested';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.status, true, ' logs the status of vendor account request');


              return contractInstance.getUserRole(
                  {
                      from: customer.account
                  }
              );
        })

        .then(function(userRole) {
           assert.equal(userRole.toNumber(), 4, ' user role 4');
          
            return contractInstance.getPendingVendorsCount();
            
        })
        .then(function(pendingVendorsCount) {
               assert.equal(pendingVendorsCount.toNumber(), 1, 'pending vendors should equal 1');

                
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
         .then(assert.fail).catch(function(error) {
     
              assert(error.message.indexOf('revert') >= 0, 'revert if the customer has placed a vendor redquest already');

               return contractInstance.approveVendorAccount(
                accounts[3],
                {
                    from: owner
                }
            );
        })

        //
        .then(assert.fail).catch(function(error) {
     
              assert(error.message.indexOf('revert') >= 0, 'revert if the customer has not placed a request for vendor account');

               return contractInstance.approveVendorAccount(
                customer.account,
                {
                    from: accounts[3]
                }
            );
        })
        
        //
         .then(assert.fail).catch(function(error) {
     
              assert(error.message.indexOf('revert') >= 0, 'revert if the account approving the vendor request is not the contract owner');

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

             return contractInstance.getPendingVendorsCount();
            
        })
        .then(function(pendingVendorsCount) {
               assert.equal(pendingVendorsCount.toNumber(), 0, 'pending vendors should equal 0');
              return contractInstance.getApprovedVendorsCount();
        })
        .then(function(approvedVendorsCount) {
              assert.equal(approvedVendorsCount.toNumber(), 1, 'approved vendors should equal 1');

        })
        
       
    })

});