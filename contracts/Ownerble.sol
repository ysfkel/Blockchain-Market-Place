pragma solidity ^0.4.18;

contract Ownerble {
    
    constructor() internal{
         createOwner();
         createSuperAdmin(msg.sender);
         
    }
    
    address private  owner;
    
    enum AppRole {
        SuperAdmin, Admin,
        Vendor, VendorAwaitingApproval, Customer
    }
    struct Administrator {
         AppRole role;
         address account;
         bool isAdmin;
     }
     
     function createOwner() private {
          owner = msg.sender;
     }
     function createSuperAdmin(address account) internal ownerOnly {
        
        administrators[msg.sender] = Administrator(
           AppRole.SuperAdmin,
            account,
           true
        );
    }
    
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
    
    mapping(address => Administrator) administrators;
}