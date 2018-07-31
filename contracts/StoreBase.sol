pragma solidity ^0.4.18;

contract StoreBase {
    
    enum Role {
        Admin, SuperAdmin
    }

    struct StoreUser {
        Role role;
    }
    struct Product {
        string name;
        string description;
        uint price;
    }
    
    struct Store {
        string name;
        string description;
        uint balance;
        Product[] products;
    }
    
    mapping(address => Store[]) internal stores;
    
}