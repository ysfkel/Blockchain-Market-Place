const truffleAssert = require('truffle-assertions');
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const SpinelToken = artifacts.require('./SpinelToken');
const MarketPlace = artifacts.require('./MarketPlace');
const INITIAL_SUPPLY =  require('../migrations/constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('../migrations/constants').TOKEN_PRICE;

contract('MarketPlace', function(accounts) {
    
    let contractInstance;

    it('initialzes the contract with the correct values', function(){
        return MarketPlace.deployed().then(function(instance){
            contractInstance = instance;
             console.log('--contractInstance', contractInstance)
        })
    })

});