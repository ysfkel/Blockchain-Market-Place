var MarketPlace = artifacts.require('./MarketPlace');

module.exports = function(deployer) {
    console.log('--deployer', deployer)
     deployer.deploy(MarketPlace, {from:"0x627306090abab3a6e1400e9345bc60c78a8bef57"})
}