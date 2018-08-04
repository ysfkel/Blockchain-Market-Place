pragma solidity ^0.4.18;

contract StoreBase {
    
    enum Role {
        Admin, SuperAdmin
    }

    struct StoreUser {
        Role role;
    }
    struct Product {
        bytes32 name;
        bytes32 description;
        uint price;
        uint productIdSlot;
    }
    
    struct Store {
        bytes32 name;
        bytes32 description;
        uint balance;
        uint[] productIds;
        uint productIdIncrement;
        mapping(uint => Product) products;
    }
    
    mapping(address => Store[]) internal stores;
    
}