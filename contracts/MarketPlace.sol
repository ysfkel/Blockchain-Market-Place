pragma solidity ^0.4.18;
import "./StoreManager.sol";
import "./ProductManager.sol";
import './UserManager.sol';
import "./Ownerble.sol";
import "./ShoppingCartManager.sol";
import "./Withdrawable.sol";

contract MarketPlace is Ownerble, StoreManager, ProductManager,
UserManager, ShoppingCartManager, Withdrawable {
    
    
}

