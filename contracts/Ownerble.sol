pragma solidity 0.4.24;

contract Ownerble {
    
    constructor() internal{
         createOwner();
    }
    
    enum AccountState {
        Pending,
        Approved
    }
    enum AppRole {
        Owner, SuperAdmin, Admin,
        Vendor, VendorAwaitingApproval, Customer
    }
    
    address private  owner;
    
     function createOwner() private {
          owner = msg.sender;
     }
    
    modifier ownerOnly() {
        require(msg.sender == owner);
        _;
    }
}