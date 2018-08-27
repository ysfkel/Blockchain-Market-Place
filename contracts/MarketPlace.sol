pragma solidity 0.4.24;
import "./StoreManager.sol";
import "./ProductManager.sol";
import './UserManager.sol';
import "./Ownerble.sol";
import "./ShoppingCartManager.sol";
import "./Withdrawable.sol";
import "./SpinelToken.sol";


 /** @title Application entry point. */
contract MarketPlace is Ownerble, StoreManager, ProductManager,
UserManager, ShoppingCartManager, Withdrawable{

     /**
      * @dev Initialzes the smart contracts - application main entry point 
      * @param tokenContract address of token contract
      */
    constructor(SpinelToken tokenContract ) public {
         tokenContract_shoppingCart = tokenContract;
        
    }
}

