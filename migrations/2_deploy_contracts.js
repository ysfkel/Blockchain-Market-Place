var MarketPlace = artifacts.require('./MarketPlace.sol');
const SafeMath = artifacts.require('./SafeMath.sol');
const SpinelToken = artifacts.require('./SpinelToken');
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const INITIAL_SUPPLY =  require('./constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('./constants').TOKEN_PRICE;


const OWNER = '0x627306090abab3a6e1400e9345bc60c78a8bef57';

module.exports = function(deployer) {
     deployer.deploy(SpinelToken, INITIAL_SUPPLY)
        .then(function() {
           return deployer.deploy(SpinelTokenSale, SpinelToken.address, TOKEN_PRICE,
           {from: OWNER})
            .then(function() {

              return deployer.deploy(SafeMath)
               .then(function() {
                     deployer.link(SafeMath, MarketPlace);
                    return deployer.deploy(MarketPlace, SpinelToken.address, {from: OWNER})
                })
              }).catch(err=>console.log)

        })
       
   
}



