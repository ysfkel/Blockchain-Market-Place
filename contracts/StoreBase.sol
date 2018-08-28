pragma solidity 0.4.24;

/**@title Storebase contains members shared across contracts */
contract StoreBase {
    
    enum Role {
        Admin, SuperAdmin
    }

    enum PaymentMethod {
        Ether,
        Token
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
        uint priceInSpinelToken;
        string imageHash;
    }
    
    struct Store {
        bytes32 name;
        bytes32 description;
        uint revenue;
        uint[] productIds;
        uint productIdIncrement;
        mapping(uint => Product) products;
    }

    struct TransactionHistory {
        uint256 productId;
        bytes32 productName;
        uint quantity;
        uint price;
        uint totalPrice;
        address vendor;
        bytes32 storeName;
        uint256 paymentMethod;
    }

    struct Order {
        TransactionHistory[] transactions;
        uint timeStamp;
        uint grandTotal;
        uint paymentMethod;
    }
    
    
    address[] internal vendorAccountsWithListedStores;
    mapping(address => VendorSlot) internal vendorSlot;
    mapping(address => Store[]) internal stores;  
   
    mapping(address => mapping(address => uint256)) public allowance;
      
    mapping(address => uint) public customerOrdersCount;
     
    mapping(address => mapping(uint => Order)) orderHistory; 

    
}
