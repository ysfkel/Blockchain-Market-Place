pragma solidity ^0.4.0;
import "./Ownerble.sol";

contract VendorBase is Ownerble {
    
    mapping(address => Vendor) internal vendors;

     struct Vendor {
        string name;
        string email;
        string phone;
        AccountState state;
        address account;
        bool isVendorOrApplicant;
        int pendingListIndex;
        int approveListIndex;
        AppRole role;
        uint balance;
    }
}