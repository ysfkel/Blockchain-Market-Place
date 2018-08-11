var MarketPlace = artifacts.require('./MarketPlace');
const SafeMath = artifacts.require('./SafeMath.sol');

module.exports = function(deployer) {
    deployer.deploy(SafeMath)//.then(() => {
        deployer.link(SafeMath, MarketPlace);
        deployer.deploy(MarketPlace, {from:"0x627306090abab3a6e1400e9345bc60c78a8bef57"})
         
    //}) 
}