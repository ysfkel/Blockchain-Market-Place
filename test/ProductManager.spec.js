const truffleAssert = require('truffle-assertions');
const MarketPlace = artifacts.require('./MarketPlace');
const TOKEN_PRICE =  require('../migrations/constants').TOKEN_PRICE;

/**
 * Tests the functionality of the functions in
 * the product manager contract
 */
contract('ProducManager ', function(accounts) {
    
    let contractInstance;
    const owner = accounts[0];
    const customerAccount = accounts[1];
     const productPrice = 5110123153968011000000;
    const productPrice_in_spinel = productPrice/ TOKEN_PRICE;
     const customer = {
                name: 'JOE',
                email: 'j@yahoo.com',
               phone: '0552443663',
               account: customerAccount
            }
    const product = {
        name: 'product name',
        description: 'product description'
    }
 
    it('Product Mnager ', function(){

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
        //
       
        
        .then(function(receipt) {
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'StoreCreated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.storesSize, 1, ' logs the store size');

             const storeIndex = 0;
             return contractInstance.createProduct(
                 storeIndex,
                 product.name,
                 product.description,
                 productPrice,
                  //3000000000000000,
                  100,
                  productPrice_in_spinel,
                {
                      from: customer.account
                }
             );
         
          }).then(function(receipt) {
         
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ProductCreated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.productId, 1, ' logs the productId');
            assert.equal(receipt.logs[0].args.productIdSlot, 0 , ' logs the productIdSlot')
         
                   const storeIndex = 0;
                    const productId = 1;
                    return contractInstance.getProductVendor(
                        storeIndex,
                        productId,
                            {
                            from: customer.account
                            }
                    );  
          })
           .then(function(product) {
               assert.equal(product[2].toNumber(),productPrice, 'Product name should be '+product.name);
               
                       const storeIndex = 0;
                    const productId = 1;
               return contractInstance.editProduct(
                   storeIndex,
                   productId,
                    'updated product name',
                    'updated product description',
                     4000000000000000,
                     120,
                     productPrice_in_spinel,
                    {
                          from: customer.account 
                    }
               );
          }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ProductUpdated';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');

                    const storeIndex = 0;
                    const productId = 1; 
             return contractInstance.deleteProduct(
                storeIndex,
                productId,
                {
                     from: customer.account 
                }
             );
          })
          .then(function(receipt) {
             assert.equal(receipt.logs.length, 1, ' triggers 1 event');
            const expectedEventName = 'ProductDeleted';
            assert.equal(receipt.logs[0].event, expectedEventName, 'triggers '+expectedEventName+' event');
            assert.equal(receipt.logs[0].args.productId, 1, 'deleted product id:1');
                const storeIndex = 0;
               return contractInstance.createProduct(
                 storeIndex,
                 product.name,
                 product.description,
                 productPrice,
                  100,
                  productPrice_in_spinel,
                {
                      from: customer.account
                }
             );
          })
       
           
       
    })
   

});