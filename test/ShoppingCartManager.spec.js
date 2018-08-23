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
    const productPrice_in_spinel = productPrice/ TOKEN_PRICE;
    const productQuantity = 100;

    const productQuantity_cart =1;
    const updated_productQuantity_cart = 2;

    const cartPrice = (productPrice *  productQuantity_cart);
    const updated_cartPrice = (productPrice * updated_productQuantity_cart);

    let tokenInstance, tokenSaleInstance;
    const numberOfTokens = 500;
    const amountToApprove = 500;
     const tokenPrice = TOKEN_PRICE; 
    const tokensAvailableForPurchase = 10000000;//750000; //70001687.0407
    let initial_supply = (INITIAL_SUPPLY - tokensAvailableForPurchase);

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
            //
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

         }).then(function(allowance) {
             console.log('====amountToApprove', amountToApprove)
             assert.equal(allowance.toNumber(), amountToApprove, 'stores the allowance for delegated transfer');
         });
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
 
    it('ShoppingCartManager ', function(){

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
      
        //
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
        //
       
        //
        .then(function(receipt) {
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'StoreCreated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.storesSize, 1, ' logs the store size');

            //createProduct(uint storeIndex,bytes32 productName, bytes32 description, uint price, uint quantity
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
                            }
                    );  
          })
          //
          .then(function(receipt) {
            
               assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ItemInsertedToCart';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.cartSize, 1, ' logs the cartSize');

             return contractInstance.getCartPrice({
                  from:  customerAccount
             });
          })
          //
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
            assert.equal(receipt.logs[0].args.productQuantity, 4, ' logs the updated item quantity');

         
             return contractInstance.getCartPrice({
                  from:  customerAccount
             });
          }).then(function(cartPrice) {
                assert.equal(cartPrice.toNumber(), (updated_productQuantity_cart * productPrice), 'returns product price' )
         
               return contractInstance.checkOut({
                     from:  customerAccount
               })
          })
          .then(assert.fail).catch(function(error) {
              assert(error.message.indexOf('revert') >=0, 'revert if cart amount was not sent');
              return contractInstance.checkOut({
                     from:  customerAccount,
                     value: (updated_cartPrice - 100)
               })
          })
          .then(assert.fail).catch(function(error) {
                  assert(error.message.indexOf('revert') >=0, 'revert if cart amount was not sent');
          
                 return contractInstance.checkOut({
                     from:  customerAccount,
                     value: updated_cartPrice
               });
          }) 
          .then(function(receipt) {
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
             const expectedEventName = 'PaymentCompleted';
             assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
             assert.equal(receipt.logs[0].args.status, true, ' logs the updated item quantity');

          
              return contractInstance.getVendorBalance({
                  from: vendor.account
              });
          })
          .then(function(vendorBalance) {
                 assert.equal(vendorBalance.toNumber(), updated_cartPrice, 'vendor balance if updated' )
                return contractInstance.getProductQuantity(
                       storeIndex,
                       productId,
                       {
                        from: vendor.account
                })
          })
          .then(function(_productQuantity) {
            assert.equal(_productQuantity.toNumber(), (productQuantity - updated_productQuantity_cart), 'should deduct product quantity after checkout')
             return tokenSaleInstance.getBalanceOf(customerAccount,{
                 from: owner
             });
          })
               .then(function(receipt) {
         
          //  assert.equal(receipt.logs.length, 1, ' triggers 1 event');
          
         
                  
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
           .then(assert.fail).catch(function(error) {
               //   assert(error.message.indexOf('revert') >=0, 'revert if cart amount was not sent');
          
                 return contractInstance.checkOut({
                     from:  customerAccount,
                     value: updated_cartPrice
               });
          }) 
        //  .then(function() {
        //           return contractInstance.addItemToCart(
        //                 vendor.account,
        //                 storeIndex,
        //                 productId,
        //                 productQuantity_cart,
        //                     {
        //                     from:  customerAccount
        //                     }
        //             ); 
        //   })
        //   .then(function(balance) {
        //       //  console.log('---NIGGA BALANCE', balance.toNumber())

        //         return contractInstance.checkOutTokenPayment(
        //             1,
        //             {
        //                 from: customerAccount,
        //                 value: (productPrice* productQuantity_cart)
        //             }
        //         );
        //         // return contractInstance.getCartPrice(
        //         //     0,
        //         //     {
        //         //         from: customerAccount
        //         //     }
        //         // )
        //   })
        //   .then(function(r) {
        //       console.log('======price',r.toNumber())
        //   })
     
        //    .then(function(receipt) {
        //        console.log('receipt.logs[0].args.amount', receipt.logs[0].args.amount.toNumber())
        //      assert.equal(receipt.logs.length, 2, ' triggers 1 event');
        //      const expectedEventName = 'PaymentByTokenCompleted';
        //      assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
        //      assert.equal(receipt.logs[0].args.amount, true, ' logs the updated item quantity');

        //       return tokenSaleInstance.getBalanceOf(
        //          vendor.account
        //       );
        //     //   return contractInstance.getVendorBalance({
        //     //       from: vendor.account
        //     //   });
        //   })
        //   .then(function(balance) {
        //         console.log('==balance', balance.toNumber());
        //   })
        //   .then(function(balance) {
        //         console.log('---NIGGA CUSTOMER BALANCE', balance.toNumber())
        //        //token price 1000000000000000
        //         return tokenSaleInstance.getNumberOfTokensForWei(
        //               3000000000000000
        //         )
        //   })
        //   .then(function(tokens) {
        //            console.log('---====NIGGA tokens BALANCE', tokens.toNumber())
        //   })
          
           
       
    })
   

});