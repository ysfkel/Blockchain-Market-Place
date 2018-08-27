const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');
const INITIAL_SUPPLY =  require('../migrations/constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('../migrations/constants').TOKEN_PRICE;
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const SpinelToken = artifacts.require('./SpinelToken');

/**
 * Tests if an order is archived by the OrderHistory Contract 
 * after the customer checks out by completing the purcahse journey
 * i.e shopping and making payment.
 */
contract('Order History', function(accounts) {
    
    let contractInstance;
    const owner = accounts[0];
    const vendorAccount = accounts[1];
    const customerAccount = accounts[3];
     const vendor = {
                name: 'JOE',
                email: 'j@yahoo.com',
               phone: '0552443663',
               account: vendorAccount
            }
    
            const PaymentMethod ={
                Ether: 0,
                Token:1
            }

     const storeIndex = 0;
    const productId = 1;
    const productName = 'product name';
    const productDescription = 'product description';
    const productPrice = 380000000000000000;
    const productPrice_in_spinel = 11;
    const productQuantity = 100;

    const productQuantity_cart =2;

    let tokenInstance, tokenSaleInstance;
    const numberOfTokens = 100;
    const amountToApprove = 500;
     const tokenPrice = TOKEN_PRICE; 
    const tokensAvailableForPurchase = 10000000;
    const checkoutTimeStamp = (new Date()).getTime();

      it('buys tokens for custtomer', function() {
        
           const purchasedtokensCostInWei = (numberOfTokens * tokenPrice);

             return SpinelToken.deployed()
             .then(function(instance) {
                
                tokenInstance = instance;
             
                return SpinelTokenSale.deployed();
             })
             .then(function(instance) {
                tokenSaleInstance = instance;
                return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailableForPurchase, {from: owner});

             })
             .then(function(receipt) {
                return tokenSaleInstance.buyTokens(numberOfTokens, {from: customerAccount,value: purchasedtokensCostInWei });
               
            })
            .then(function(receipt) {
                    return tokenInstance.approve(owner, amountToApprove, {
                        from: customerAccount
                    });
            })
            .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval event');
            assert.equal(receipt.logs[0].args._owner, customerAccount, 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, owner, 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, amountToApprove , 'logs the transfer amount');
          
            return tokenInstance.allowance(customerAccount,owner);

         })
         .then(function(allowance) {
            
             assert.equal(allowance.toNumber(), amountToApprove, 'stores the allowance for delegated transfer');
         })
     });
 
    it('Handles customer shopping', function(){

        return MarketPlace.deployed().then(function(instance){
            contractInstance = instance;
            return contractInstance.requestVendorAccount(
                vendor.name,
                vendor.email,
                vendor.phone,
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
                });
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
          .then(function(receipt) {
         
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ProductCreated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.productId, 1, ' logs the productId');
            assert.equal(receipt.logs[0].args.productIdSlot, 0 , ' logs the productIdSlot')
         
                  
                    return contractInstance.addItemToCart(
                        vendor.account,
                        storeIndex,
                        productId,
                        productQuantity_cart,
                            {
                            from:  customerAccount
                            });  
          })
          .then(function(receipt) {
                    return tokenInstance.approve(
                        contractInstance.address,
                        amountToApprove, {
                        from: customerAccount
                    });
            })
            .then(function(receipt) {  
                assert.equal(receipt.logs.length, 1, ' triggers 1 event');
                const expectedEventName = 'Approval';
                assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
                assert.equal(receipt.logs[0].args._spender, contractInstance.address, ' logs _spender');
                assert.equal(receipt.logs[0].args._value, amountToApprove, ' logs the amountToApprove');
                
                    return contractInstance.checkOutTokenPayment(
                        PaymentMethod.Token,checkoutTimeStamp,
                        {
                        from:  customerAccount
                });
            }); 
       
    })

    it('Archives order in order history',() => {
         const orderId=1;
                return contractInstance.getOrderHistory(
                    orderId,
                        {
                        from:  customerAccount
                })
                .then((order) => {
                    assert.equal(order[0].toNumber(), checkoutTimeStamp, 'creates transaction history with the correct timestamp');;
                    return contractInstance.getCustomerOrdersHistoryCount(
                            {
                            from:  customerAccount
                      })
                })
                .then((orderCount) => {
                    assert.equal(orderCount.toNumber(), 1, 'returns order count as 1');
                    const orderId=1;
                     return contractInstance.getOrderTransaction(orderId, 0, {
                        from:  customerAccount
                     })
                })
                .then((transaction) => {
                    assert.equal(transaction[1],productQuantity_cart , 'returns purchased product quantity as '+productQuantity_cart);
                    assert.equal(transaction[2].toNumber(), productPrice_in_spinel , 'returns product price ');
                    assert.equal(transaction[5],PaymentMethod.Token , 'returns as  Token');

                    
                })
    }); 
    
   

});