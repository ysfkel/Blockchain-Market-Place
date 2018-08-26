pragma solidity 0.4.24;
import "./StoreManager.sol";
import "./ProductManager.sol";
import './UserManager.sol';
import "./Ownerble.sol";
import "./ShoppingCartManager.sol";
import "./Withdrawable.sol";
import "./SpinelToken.sol";

/**
  THIS CONTRACT INHERITS ALL OTHER 
  CONTRACTS AND ACTS AD THE ENTRY POINT
 */
contract MarketPlace is Ownerble, StoreManager, ProductManager,
UserManager, ShoppingCartManager, Withdrawable{

   /**
     THE CONTRACT CONTRUTOR RECEIVES ONE ARGUMENT
     WHICH IS THE ADDRESS OF THE TOKEN CONTRACT
     THE TOKEN CONTRACT IS USED IN THE SHOPPING CART CONTRACT.
    */
    constructor(SpinelToken tokenContract ) public {
         tokenContract_shoppingCart = tokenContract;
        
    }
}

