pragma solidity ^0.4.18;

contract StoreBase {
    
    enum Role {
        Admin, SuperAdmin
    }
    
  struct CartItemSlot{
        bool initialized;
        uint slot;
    }
    struct ShoppingCartItem {
       // uint productId;
        uint productQuantity;
        address vendorAccount;
        uint storeIndex;
        bool purchaseComplete;
    }
    
    struct ShoppingCart {
     mapping(uint => CartItemSlot) cartItemSlot;
     mapping(uint=> ShoppingCartItem) products;
     uint[] productIds;
     uint cartPrice;
    }
    
    mapping(address => ShoppingCart) shoppingCarts;

    struct StoreUser {
        Role role;
    }
    
    struct VendorSlot{
        bool initialized;
        uint slot;
    }
    
    struct Product {
        bytes32 name;
        bytes32 description;
        uint price;
        uint productIdSlot;
        uint productId;
        uint quantity;
    }
    
    struct Store {
        bytes32 name;
        bytes32 description;
        uint revenue;
        uint[] productIds;
        uint productIdIncrement;
        mapping(uint => Product) products;
    }
    
    address[] internal vendorAccountsWithListedStores;
    mapping(address => VendorSlot) internal vendorSlot;
    mapping(address => Store[]) internal stores;    
    
}
