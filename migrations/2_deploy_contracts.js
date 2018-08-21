var MarketPlace = artifacts.require('./MarketPlace.sol');
const SafeMath = artifacts.require('./SafeMath.sol');
const SpinelToken = artifacts.require('./SpinelToken');
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const INITIAL_SUPPLY =  require('./constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('./constants').TOKEN_PRICE;


const owner = '0x627306090abab3a6e1400e9345bc60c78a8bef57';

module.exports = function(deployer) {
     deployer.deploy(SpinelToken, INITIAL_SUPPLY, {from: owner})
        .then(function() {
          //  console.log('===--TOKEN_PRICE', TOKEN_PRICE, SpinelToken.address)
           return deployer.deploy(SpinelTokenSale, SpinelToken.address, TOKEN_PRICE, {from: owner})
            .then(function() {
              return deployer.deploy(SafeMath)//.then(() => {
               .then(function() {
                  // console.log('--======---===SpinelTokenSale.address', SpinelTokenSale.address)
                     deployer.link(SafeMath, MarketPlace);
                    return deployer.deploy(MarketPlace, SpinelTokenSale.address, {from: owner})
                })
              }).catch(err=>console.log)

        })
       
   
}




// module.exports = function(deployer) {
//         deployer.deploy(SafeMath)//.then(() => {
//         deployer.link(SafeMath, MarketPlace);
//         deployer.deploy(MarketPlace, {from:"0x627306090abab3a6e1400e9345bc60c78a8bef57"})
         
//     //}) 
// }