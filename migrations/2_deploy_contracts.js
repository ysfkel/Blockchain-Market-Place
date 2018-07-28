var MarketPlace = artifacts.require('./MarketPlace');

module.exports = function(deployer) {
    console.log('--deployer', deployer)
     deployer.deploy(MarketPlace)
}