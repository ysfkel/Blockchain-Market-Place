const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');
const INITIAL_SUPPLY =  require('../migrations/constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('../migrations/constants').TOKEN_PRICE;
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const SpinelToken = artifacts.require('./SpinelToken');

contract('MarketPlace', function(accounts) {
    
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
    const updatedStoreName = 'store updated';
    const updatedStoreDescription= 'store description';

     const storeIndex = 0;
    const productId = 1;
    const productName = 'product name';
    const productDescription = 'product description';
    const productPrice = 380000000000000000;//1000000000000000000; //1 ether
    const productPrice_in_spinel = 10
    const productQuantity = 100;

    const productQuantity_cart =10;
    const updated_productQuantity_cart = 10;

    const cartPrice = (productPrice *  productQuantity_cart);
    const updated_cartPrice = (productPrice * updated_productQuantity_cart);

    let tokenInstance, tokenSaleInstance;
    const numberOfTokens = 1000;
    const amountToApprove = 500;
     const tokenPrice = TOKEN_PRICE; 
    const tokensAvailableForPurchase = 10000000;//750000; //70001687.0407
    let initial_supply = INITIAL_SUPPLY;//(INITIAL_SUPPLY - tokensAvailableForPurchase);

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
            //    .then(function(receipt) {
            //        //try transfering something larger than the senders balance
            //        return tokenInstance.transferFrom(
            //            fromAccount,
            //            toAccount,
            //            9999, {
            //                from: spendingAccount
            //            });
            //    })
               //
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
            
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ItemInsertedToCart';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.cartSize, 1, ' logs the cartSize');

             return contractInstance.getCartPrice(0,
                 {
                  from:  customerAccount
             });
          })
          .then(function(cartPrice) {
                assert.equal(cartPrice.toNumber(), (productQuantity_cart * productPrice), 'returns product price' )
           
              return contractInstance.updateCartItem(
                        vendor.account,
                        storeIndex,
                        productId,
                      updated_productQuantity_cart,
                            {
                            from:  customerAccount
                            }
                    ); 
         
          })
          .then(function(receipt) {
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'CartItemUpdated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.productQuantity.toNumber(), 10, ' logs the updated item quantity');

         
             return contractInstance.getCartPrice(
                 1,
                 {
                  from:  customerAccount
             });
          })
          .then(function(cartPrice) {
                const _cartPrice = cartPrice.toNumber();
                const price = (updated_productQuantity_cart * productPrice_in_spinel);
                 assert.equal(_cartPrice,price, 'returns product price' );
                 const checkoutTimeStamp = (new Date()).getTime();
               return contractInstance.checkOutTokenPayment(
                   0,checkoutTimeStamp ,{
                     from:  customerAccount,
                     value: updated_cartPrice
               })
          })
          .then(function(receipt) {
             const price = (updated_productQuantity_cart * productPrice);
             assert.equal(receipt.logs.length,2, ' triggers 1 event');
             const expectedEventName = 'PaymentByEtherCompleted';
             assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
             assert.equal(receipt.logs[0].args.amount.toNumber(), price , ' logs the updated item quantity');

          
              return contractInstance.getVendorBalance({
                  from: vendor.account
              });
          })
          .then(function(vendorBalance) {
                 assert.equal(vendorBalance.toNumber(), updated_cartPrice, 'vendor balance is updated' )
                return contractInstance.getProductQuantity(
                       storeIndex,
                       productId,
                       {
                        from: vendor.account
                })
          })
               .then(function(productQuantity) {
          
                     assert.equal(productQuantity.toNumber(), 90, 'product quantity is updated' )
                    return contractInstance.addItemToCart(
                        vendor.account,
                        storeIndex,
                        productId,
                        productQuantity_cart,
                            {
                            from:  customerAccount
                            }
                    );  
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
             const checkoutTimeStamp = (new Date()).getTime();
                 return contractInstance.checkOutTokenPayment(
                     1,checkoutTimeStamp,
                     {
                     from:  customerAccount
               });
          }) 
       
    })
   

});