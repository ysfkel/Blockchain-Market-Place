pragma solidity 0.4.24;
import "./Ownerble.sol";

/**@title vendors base contract */
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

    /**
            * @dev RETURNS THE VENDORS RETRIEVABLE BALANCE
            * @return balance vendors balance - ether
            */
    function getVendorBalance() public view returns(uint) {
        require(vendors[msg.sender].state == AccountState.Approved);
        
        return vendors[msg.sender].balance;
    }
}