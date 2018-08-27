const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');

contract('Withdrawable', function(accounts) {
    
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

            return contractInstance.approveVendorAccount(
              customer.account,
                {
                    from: owner
                }
            );
        })
        
        //

        
       
    })

});