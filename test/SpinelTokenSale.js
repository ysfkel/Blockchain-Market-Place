const truffleAssert = require('truffle-assertions');
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const SpinelToken = artifacts.require('./SpinelToken');
const INITIAL_SUPPLY =  require('../migrations/constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('../migrations/constants').TOKEN_PRICE;

contract('SpinelTokenSale', function(accounts) {
    let tokenSaleInstance;
    let tokenInstance;
    const tokensAvailableForPurchase = 10000;//750000;
    let initial_supply = (INITIAL_SUPPLY - tokensAvailableForPurchase);

    const tokenPrice = TOKEN_PRICE;  //in wei - smallest unit of ether
    const buyer = accounts[1];
    const admin = accounts[0];
    const numberOfTokens = 2;

    it('it initializes the contract with the correct values', function() {
           return SpinelTokenSale.deployed().then(function(instance) {
           
                tokenSaleInstance = instance;
               return tokenSaleInstance.address;
           })
           .then(function(address) {
                 assert.notEqual(address, 0x0, 'has contract address');
                 return tokenSaleInstance.tokenContract();
           })
           .then(function(address) {
                 assert.notEqual(address, 0x0, 'has a contract address');
                 return tokenSaleInstance.tokenPrice();
           }).then(function(price) {
                assert.equal(price, tokenPrice, 'Token price is correct');
           })
    });

    it('facilitates buying tokens', function() {
        
           const purchasedtokensCostInWei = (numberOfTokens * tokenPrice);

             return SpinelToken.deployed()
             .then(function(instance) {
                
                tokenInstance = instance;
                return SpinelTokenSale.deployed();
             })
             .then(function(instance) {
                tokenSaleInstance = instance;
                return tokenInstance.transfer(tokenSaleInstance.address,tokensAvailableForPurchase, {from: admin});

             })
             .then(function(receipt) {
                return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer,value: purchasedtokensCostInWei });
               
               })
               .then(function(receipt) {

                   assert.equal(receipt.logs.length, 1, 'triggers one event');
                   assert.equal(receipt.logs[0].event, 'Sell', 'should be the "Sell" event');
                   assert.equal(receipt.logs[0].args._buyer, buyer, 'logs the account that purchased the tokens');
                   assert.equal(receipt.logs[0].args._numberOfTokens, numberOfTokens, 'logs the number of tokens purchased');
                  
                   return tokenSaleInstance.tokensSold();

               })
             .then(function(amount) {
                   assert.equal(amount.toNumber(), numberOfTokens, 'increments the number of tokens sold');
                   return tokenInstance.balanceOf(tokenSaleInstance.address);
                })
                
                 .then(function(balance) {
                   assert.equal(balance.toNumber(), tokensAvailableForPurchase - numberOfTokens, 'deducts from available tokens');
                     return tokenInstance.balanceOf(buyer);
                 }).then(function(balance) {
                    assert.equal(balance.toNumber(), numberOfTokens, 'adds to  buyers tokens');
                    const purchasedtokensCostInWei_under_pay = 1;
                   return tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer,value: purchasedtokensCostInWei_under_pay});
               })
               .then(assert.fail).catch(function(error) {
                     assert(error.message.indexOf('revert') >= 0, 'msg.value (in wei), must be sufficient to pay for the amunt of tokens being requested')
                      const numberOfTokensToBuy = 20000;
                     return tokenSaleInstance.buyTokens(numberOfTokensToBuy,{from: buyer, value: numberOfTokensToBuy * tokenPrice });
               })
               .then(assert.fail).catch(function(error) {
                     assert(error.message.indexOf('revert') >= 0, 'cannot purchase more tokens than available');
                     const amountToConvertToWei = 4000000000000000;

               });
          
           
    })

   

    it('ends token sale', function() {
           return SpinelToken.deployed()
           .then(function(instance) {
              tokenInstance = instance;
              return SpinelTokenSale.deployed();
           })
           .then(function(instance) {
              tokenSaleInstance = instance;
              /** try end token sale from account other than admin */
              return tokenSaleInstance.endSale({from: buyer});
           })
          .then(assert.fail)
           .catch(function(error) {
            // .then(function(){
                 assert(error.message.indexOf('revert') >=0, 'must be admin to end sale');
                  return tokenSaleInstance.endSale({from: admin});
           })
           .then(function(receipt) {
                return tokenInstance.balanceOf(admin);   
           })
           .then(function(balance) {    
                 const tokensNotSold = ( initial_supply + (tokensAvailableForPurchase - numberOfTokens));
                 assert.equal(balance.toNumber(),tokensNotSold, 'returns all unsold dapp tokens to admin');
              
           })
           
    });
    
})