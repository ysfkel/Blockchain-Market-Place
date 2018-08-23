var SpinelToken  = artifacts.require('./SpinelToken.sol');
const truffleAssert = require('truffle-assertions');
const TOKEN_NAME = require('../migrations/constants').TOKEN_NAME;
const TOKEN_SYMBOL = require('../migrations/constants').TOKEN_SYMBOL;
const TOKEN_VERSION = require('../migrations/constants').TOKEN_VERSION;
const INITIAL_SUPPLY = require('../migrations/constants').INITIAL_SUPPLY;

const amountToApprove = 100;

contract('SpinelToken', function(accounts) {
    
    let tokenInstance;

    it('initialzes the contract with the correct values', function(){
        return SpinelToken.deployed().then(function(instance){
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function(name){
            assert.equal(name, TOKEN_NAME, 'has the correct name');
            return tokenInstance.symbol();
        }).then(function(symbol) {
            assert.equal(symbol,  TOKEN_SYMBOL, 'has the correct symbol');
            return tokenInstance.standard();
        }).then(function(standard) {
            assert.equal(standard, TOKEN_VERSION, 'has the correct standard');
        });
    })

    it('allocates total supply upon deployment', function() {
        return SpinelToken.deployed().then(function(instance){

            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function(totalSupply){
            assert.equal(totalSupply.toNumber(), INITIAL_SUPPLY, 'sets total supply to 1, 000, 000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function(adminBalance) {
            assert.equal(adminBalance.toNumber(), INITIAL_SUPPLY, 'it allcates the initial supply to the adminBalance')
        })
    });

    it('transfers token ownership', function() {
        let amountToSend = 2500;
        return SpinelToken.deployed().then(function(instance) {
             tokenInstance = instance;
             return tokenInstance.transfer.call(accounts[1], 9999999999999999999999999999999999)
        }).then(assert.fail).catch(function(error) {
              assert(error.message.indexOf('revert') >=0, 'error message must contain revert');
              return tokenInstance.transfer.call(accounts[1], amountToSend, {from: accounts[0]});
        }).then(success=>{
              assert.equal(success, true, 'it returns true');
              return tokenInstance.transfer(accounts[1], amountToSend, {from: accounts[0]} );
        }).then(function(receipt) {
         
            assert.equal(receipt.logs.length, 1, 'triggers one evennt');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the transfer event');
            assert.equal(receipt.logs[0].args._from, accounts[0], 'logs the account the tokens are transfered from');
            assert.equal(receipt.logs[0].args._to, accounts[1], 'logs the account the tokens are transfered to');
            assert.equal(receipt.logs[0].args._value, amountToSend, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then(function(balance) {
            assert.equal(balance.toNumber(), amountToSend, 'adds the amount to the receiving account');
            return tokenInstance.balanceOf(accounts[0])
        }).then(function(balance) {
             assert.equal(balance.toNumber(), (INITIAL_SUPPLY - amountToSend), `deducts the sent amount ${amountToSend} from the sending amount`)
        })
    });

    it('approves tokens for delegated transfer', function() {
      
         return SpinelToken.deployed().then(function(instance) {
              tokenInstance = instance;
              return tokenInstance.approve.call(accounts[1], amountToApprove);
         }).then(function(success) {
               assert.equal(success, true, 'it returns true');
               return tokenInstance.approve(accounts[1], amountToApprove, {from: accounts[0]});
         }).then(function(receipt) {
            assert.equal(receipt.logs.length, 1, 'triggers one event');
            assert.equal(receipt.logs[0].event, 'Approval', 'should be the Approval event');
            assert.equal(receipt.logs[0].args._owner, accounts[0], 'logs the account the tokens are authorized by');
            assert.equal(receipt.logs[0].args._spender, accounts[1], 'logs the account the tokens are authorized to');
            assert.equal(receipt.logs[0].args._value, amountToApprove , 'logs the transfer amount');
          
            return tokenInstance.allowance(accounts[0], accounts[1]);

         }).then(function(allowance) {
             assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
         });
    });
    it('handles delegated token transfers', function() {
          return SpinelToken.deployed().then(function(instance){
                tokenInstance = instance;
                fromAccount = accounts[2];
                toAccount = accounts[3];
                spendingAccount = accounts[4];
               return tokenInstance.transfer(fromAccount, amountToApprove, {
                   from: accounts[0]
               })
               .then(function(receipt) {
                    return tokenInstance.approve(spendingAccount, 10, {
                        from: fromAccount
                    });
               })
               .then(function(receipt) {
                   //try transfering something larger than the senders balance
                   return tokenInstance.transferFrom(
                       fromAccount,
                       toAccount,
                       9999, {
                           from: spendingAccount
                       });
               })
               .then(assert.fail).catch(function(error) {
                   //test that error is thrown by require
                     assert(error.message.indexOf('revert') >= 0, 
                     'cannot transfer value larger than balane');
                     
                     return tokenInstance.transferFrom(fromAccount,
                     toAccount, 20 , {from: spendingAccount});
               })
               .then(assert.fail).catch(function(error) {
                   assert(error.message.indexOf('revert') >=0,'cannot transfer value GREATER than the approved amount');
                        return tokenInstance.transferFrom.call(fromAccount,
                         toAccount, 10 , {from: spendingAccount});
               }).then(function(success) {
            
                   assert.equal(success, true, 'expected success to equal true');
                        return tokenInstance.transferFrom(fromAccount,
                         toAccount, 10 , {from: spendingAccount});
               })
               .then(function(receipt) {
                      assert.equal(receipt.logs.length, 1, 'triggers one event');
                      assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event'); 
                      assert.equal(receipt.logs[0].args._from, fromAccount, 'logs the account the tokens are transfered from'); 
                      assert.equal(receipt.logs[0].args._to, toAccount, 'logs the account the tokens are transfered to'); 
                      assert.equal(receipt.logs[0].args._value, 10, 'logs the transfer amount'); 
                      return tokenInstance.balanceOf(fromAccount);
               }).then(function(balance) {
                    assert.equal(balance.toNumber(), 90, 'deducts the transfered amount from the sending account');
                    return tokenInstance.balanceOf(toAccount);
               }).then(function(balance) {
                   assert.equal(balance.toNumber(), 10, 'adds the transferred amount to the receiving account')
                   return tokenInstance.allowance(fromAccount, spendingAccount);
               }).then(function(allowance) {
                     assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
               })

          })
    })
})