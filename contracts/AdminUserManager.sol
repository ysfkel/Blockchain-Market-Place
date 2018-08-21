pragma solidity ^0.4.18;
import "./Ownerble.sol";

contract AdminUserManager is Ownerble{
    
    constructor() public {
       createContractOwner("Owner" ,msg.sender, uint(AppRole.Owner));
    }
    
    mapping(address => Administrator) internal adminstratorAccounts;
    Administrator[] private adminstratorAccountsList;
    
       
    struct Administrator {
         string name;
         AppRole role;
         address account;
         bool isAdmin;
     }

     event UserCreated(string name);
     
     function createContractOwner(string name, address account, uint role) private ownerOnly returns(bool){
      require(AppRole(role) == AppRole.Owner, "THE SPECIFIED ADMIN ROLE DOES NOT EXIST");
        
        return createUser(name, account, role);
    }
    
    
     
    function createAdminUser(string name, address account, uint role) public ownerOnly returns(bool){
      require(AppRole(role) == AppRole.SuperAdmin || AppRole(role) == AppRole.Admin,
      "THE SPECIFIED ADMIN ROLE DOES NOT EXIST");
       
        return createUser(name, account, role);
    }
    
    function createUser(string name, address account, uint role) private  ownerOnly returns(bool) {
          
         adminstratorAccounts[account] = Administrator(
          name,
          AppRole(role),
            account,
          true
         );
        
          adminstratorAccountsList.push(Administrator(
          name,
          AppRole(role),
            account,
          true
        ));
        
        emit UserCreated(name);
        return true;
    }
    
    function getAdminUsersCount() public ownerOnly view returns (uint) {
        
          if(adminstratorAccountsList.length > 0) {
               return adminstratorAccountsList.length;
          }
          return 0;
    }
    
     function getAdminUserByAddress(address account) public ownerOnly view returns(string, uint, address) {
        require(adminstratorAccounts[account].isAdmin);
        
        return(
            adminstratorAccounts[account].name,
            uint(adminstratorAccounts[account].role),
            adminstratorAccounts[account].account
        );
    }
    
    function getAdminUserByIndex(uint index) public ownerOnly view returns(string, uint, address) {
        require(index < adminstratorAccountsList.length);
        
        return(
            adminstratorAccountsList[index].name,
            uint(adminstratorAccountsList[index].role),
            adminstratorAccountsList[index].account
        );
    }
    
}