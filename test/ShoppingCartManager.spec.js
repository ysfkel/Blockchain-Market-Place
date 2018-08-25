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
    const productPrice_in_spinel = 10//productPrice/ TOKEN_PRICE;
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
            // assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            // const expectedEventName = 'CartItemUpdated';
            // assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            // assert.equal(receipt.logs[0].args.productQuantity, 4, ' logs the updated item quantity');

         
             return contractInstance.getCartPrice(
                 1,
                 {
                  from:  customerAccount
             });
          })
          .then(function(cartPrice) {
                const _cartPrice = cartPrice.toNumber();
                const price = (updated_productQuantity_cart * productPrice_in_spinel);
                console.log('===CART PRICEEEE------------', _cartPrice, price);
             
                assert.equal(_cartPrice,price, 'returns product price' );
         
               return contractInstance.checkOutTokenPayment(
                   0,{
                     from:  customerAccount
               })
          })
          .then(assert.fail).catch(function(error) {
             // console.log('==REVERT ERROR', error)
               assert(error.message.indexOf('revert') >=0, 'revert if cart amount was not sent new one');

                 return contractInstance.checkOutTokenPayment(
                     0,
                     {
                     from:  customerAccount,
                    value: updated_cartPrice
               });
          }) 
          .then(function(receipt) {
             const price = (updated_productQuantity_cart * productPrice);
             assert.equal(receipt.logs.length,2, ' triggers 1 event');
             const expectedEventName = 'PaymentByEtherCompleted';
             assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
             assert.equal(receipt.logs[0].args.amount, price , ' logs the updated item quantity');

          
              return contractInstance.getVendorBalance({
                  from: vendor.account
              });
          })
          .then(function(vendorBalance) {
              //   assert.equal(vendorBalance.toNumber(), updated_cartPrice, 'vendor balance if updated' )
                return contractInstance.getProductQuantity(
                       storeIndex,
                       productId,
                       {
                        from: vendor.account
                })
          })
               .then(function(receipt) {
         
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
            
                 return contractInstance.checkOutTokenPayment(
                     1,
                     {
                     from:  customerAccount
               });
          }) 
          .then(function(receipt) {
             assert.equal(receipt.logs.length, 2, ' triggers 1 event');
             const expectedEventName = 'PaymentByTokenCompleted';
             assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
             assert.equal(receipt.logs[0].args.amount.toNumber(), (productPrice_in_spinel * productQuantity_cart), ' logs product price');
            
              
               return contractInstance.getCustomerOrdersHistoryCount({
                   from: customerAccount
               });
          })
          .then(function(customerOrdersHistoryCount) {
                const count = customerOrdersHistoryCount.toNumber();
                assert.equal(count, 2, 'customer orders count is 1')
                return contractInstance
                .getOrderTransaction(2, 0, {
                    from: customerAccount
                });
          })
          .then(function(orderTransaction) {
            //  assert.equal(receipt.logs.length, 2, ' triggers 1 event');
            //  const expectedEventName = 'PaymentByTokenCompleted';
             assert.equal(orderTransaction[5], 1, 'paymentMethod is '+1);
             assert.equal(orderTransaction[3], vendorAccount, 'vendorAccount is '+vendorAccount);
            
             
                    return contractInstance.addItemToCart(
                        vendor.account,
                        storeIndex,
                        productId,
                        productQuantity_cart,
                            {
                            from:  customerAccount
                            })
                 // })
          })
           .then(function(receipt) {
            
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ItemInsertedToCart';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.cartSize, 1, ' logs the cartSize');

              return contractInstance.checkOutTokenPayment(
                     0,
                     {
                     from:  customerAccount,
                           value: updated_cartPrice
               });
          })
        //   .then(function(owner) {
        //      console.log('--token instanc 1', owner);
        //      return tokenSaleInstance.getOwner();
        //   })
        //    .then(function(owner) {
        //      console.log('--token instance 2', owner);
         
        //   })
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