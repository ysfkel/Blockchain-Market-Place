pragma solidity 0.4.24;
import "./Ownerble.sol";
/** @title Admin User Manager. */
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
     
      /**
      * @dev CREATES THE CONTRACT OWNER - ADDRESS THAT DEPLOYS THE CONTRACT
      * @param name of contract owner
      * @param address of contract owner
      * @param role of contract owner
      * @return name of contract owner 
      * @return address of contract owner
      * @return role of contract owner 
      */
     function createContractOwner(string name, address account, uint role) private ownerOnly returns(bool){
      require(AppRole(role) == AppRole.Owner, "THE SPECIFIED ADMIN ROLE DOES NOT EXIST");
        
        return createUser(name, account, role);
    }
    
     /**
      * @dev ALLOWS THE CONTRACT OWNER TO CREATE AN ADMIN USER
      * @param name of admin 
      * @param address of admin 
      * @return role of admin  
      * @return name of admin  
      * @return address of admin
      * @return role of admin     
      */
    function createAdminUser(string name, address account, uint role) public ownerOnly returns(bool){
      require(AppRole(role) == AppRole.SuperAdmin || AppRole(role) == AppRole.Admin,
      "THE SPECIFIED ADMIN ROLE DOES NOT EXIST");
       
        return createUser(name, account, role);
    }

    /**
      * @dev ALLOWS THE CONTRACT OWNER TO CREATE AN ADMIN USER
      * @param name of admin 
      * @param address of admin 
      * @return role of admin  
      * @return name of admin  
      * @return address of admin
      * @return role of admin     
      */
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
    
     /**
      * @dev  RETURNS THE NUMBER OF ADMIN USERS
      * @return size of number of admins array
      */
    function getAdminUsersCount() public ownerOnly view returns (uint) {
        
          if(adminstratorAccountsList.length > 0) {
               return adminstratorAccountsList.length;
          }
          return 0;
    }
    
   
     /**
      * @dev   RETURNS THE LIST OF ADMIN USERS 
      * @param index of admin user
      * @return name of admin user 
      * @return role of admin user 
      * @return address of admin user 
      */
     function getAdminUserByAddress(address account) public ownerOnly view returns(string, uint, address) {
        require(adminstratorAccounts[account].isAdmin);
        
        return(
            adminstratorAccounts[account].name,
            uint(adminstratorAccounts[account].role),
            adminstratorAccounts[account].account
        );
    }
    
     /**
      * @dev   RETURNS THE LIST OF ADMIN USERS 
      * @param index of admin user
      * @return name of admin user 
      * @return role of admin user 
      * @return address of admin user 
      */
    function getAdminUserByIndex(uint index) public ownerOnly view returns(string, uint, address) {
        require(index < adminstratorAccountsList.length);
        
        return(
            adminstratorAccountsList[index].name,
            uint(adminstratorAccountsList[index].role),
            adminstratorAccountsList[index].account
        );
    }
    
}