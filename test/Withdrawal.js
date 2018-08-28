const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');
var SpinelToken  = artifacts.require('./SpinelToken.sol');

contract('Withdrawable', function(accounts) {
    
    const storeIndex = 0;
    const productId = 1;
    const productName = 'product name';
    const productDescription = 'product description';
    const productPrice = 380000000000000000; 
    const productQuantity = 100;
    let contractInstance;
    const owner = accounts[0];
    const vendorAccount = accounts[1];
    const customerAccount = accounts[3];
    const productQuantity_cart =10;
    const productPrice_in_spinel = 10
    const customer = {
                name: 'JOE',
                email: 'j@yahoo.com',
               phone: '0552443663',
               account: customerAccount
            }

              const vendor = {
                name: 'JOE',
                email: 'j@yahoo.com',
               phone: '0552443663',
               account: vendorAccount
            }

     it('initialzes the token contract', function(){
        return SpinelToken.deployed().then(function(instance){
            tokenInstance = instance;
  
        })
    })
 
    it('Approves vendor account', function(){

        return MarketPlace.deployed().then(function(instance){
            contractInstance = instance;
            return contractInstance.requestVendorAccount(
                customer.name,
                customer.email,
                customer.phone,
                {
                    from: vendor.account
                }
            );
        })

        .then(function(receipt) {
                     
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'VendorAccountRequested';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.status, true, ' logs the status of vendor account request');

            return contractInstance.approveVendorAccount(
              vendor.account,
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
                      from: vendor.account
                }
             );
            
        })
        .then(function(receipt) {
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'StoreCreated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.storesSize, 1, ' logs the store size');
            const storeIndex = 0;
             return contractInstance.createProduct(
                 storeIndex,
                 productName,
                 productDescription,
                 productPrice,
                 productQuantity,
                 productPrice_in_spinel,
                {
                      from: vendor.account
                }
             );
         
          })
        
    })

    it('Makes product purchase', () => {
                return contractInstance.addItemToCart(
                        vendor.account,
                        storeIndex,
                        productId,
                        productQuantity_cart,
                            {
                            from:  customerAccount
             } )
            .then(function(receipt) {  
             assert.equal(receipt.logs[0].args.cartSize,1 , ' there should be 1 item in the shopping cart');
             const checkoutTimeStamp = (new Date()).getTime();
                 return contractInstance.checkOutTokenPayment(
                     0,checkoutTimeStamp,
                     {
                     from:  customerAccount,
                     value: (productQuantity_cart * productPrice)
               });
          })
             .then(function(receipt) {  
                 return contractInstance.getVendorBalance(
                     {
                     from:  vendorAccount
               })
          })
            .then(function(vendorBalance) {  
             assert.equal(vendorBalance.toNumber(), (productQuantity_cart * productPrice), 'The cart Price should be added to the vendors balance');
           
                 return contractInstance.withdraw(
                     {
                     from:  vendorAccount
                 })
             })
             .then((receipt) => {
                    assert.equal(receipt.logs.length, 1, ' triggers 1 event');
              const expectedEventName = 'WithdrawalCompletedSuccessfully';
              assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
               assert.equal(receipt.logs[0].args.amount,(productQuantity_cart * productPrice), 'amount withdrwan should equal '+(productQuantity_cart * productPrice))
             return contractInstance.getVendorBalance(
                     {
                     from:  vendorAccount
                })
             })
               .then(function(balance) {  
             assert.equal(balance.toNumber(), 0, 'vendors balance should be 0 after withdrwal');
            
          })
    })

});