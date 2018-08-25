var MarketPlace = artifacts.require('./MarketPlace.sol');
const SafeMath = artifacts.require('./SafeMath.sol');
const SpinelToken = artifacts.require('./SpinelToken');
const SpinelTokenSale = artifacts.require('./SpinelTokenSale');
const INITIAL_SUPPLY =  require('./constants').INITIAL_SUPPLY;
const TOKEN_PRICE =  require('./constants').TOKEN_PRICE;


const owner = '0x627306090abab3a6e1400e9345bc60c78a8bef57';

console.log('--INITIAL_SUPPLY', INITIAL_SUPPLY, 'price', TOKEN_PRICE)
module.exports = function(deployer) {
     deployer.deploy(SpinelToken, INITIAL_SUPPLY)
        .then(function() {
           return deployer.deploy(SpinelTokenSale, SpinelToken.address, TOKEN_PRICE,
           {from: owner})
            .then(function() {
              console.log('--TC ADDRESS', SpinelToken.address)
              console.log('--TCS ADDRESS', SpinelTokenSale.address)
              return deployer.deploy(SafeMath)//.then(() => {
               .then(function() {
                     deployer.link(SafeMath, MarketPlace);
                    return deployer.deploy(MarketPlace, SpinelToken.address, {from: owner})
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