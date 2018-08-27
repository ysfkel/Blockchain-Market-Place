pragma solidity 0.4.24;
import "./Ownerble.sol";
import "./VendorManager.sol";
import "./AdminUserManager.sol";

/**@title managers users inherits Ownerble, AdminUserManager, VendorManager */
contract UserManager is Ownerble, AdminUserManager, VendorManager {
    
    /**
            * @dev  RETURNS USER ROLE
            * @return uint user role 
            */
    function getUserRole() public view returns(uint) {
        
        if(vendors[msg.sender].isVendorOrApplicant == true) {
            return uint(AppRole(vendors[msg.sender].role));
        }
        else if(adminstratorAccounts[msg.sender].isAdmin == true) {
             return uint(AppRole(adminstratorAccounts[msg.sender].role));
        }else {
            return uint(AppRole.Customer);
        }
    }
    
    
}