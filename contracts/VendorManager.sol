pragma solidity 0.4.24;
import "./Ownerble.sol";
import "./UserManager.sol";
import "./Base.sol";
import "./VendorBase.sol"; 

/**@title USED BY THE APP OWNER TO MANAGE VENDORS */
contract VendorManager is Base, Ownerble, VendorBase {
    
    Vendor[] internal pendingVendors;
    Vendor[] internal approvedVendors;
    
    event  VendorAccountRequested(bool status);
    event  VendorAccountApproved(bool status);

     /**
            * @dev RETURNS THE LSIT OF USERS THAT HAVE PLACED A REQUEST FOR A VENDOR ACCOUNT
            * @return uint number of pending vendors 
            */
    function getPendingVendorsCount() public view returns (uint) {
          if(pendingVendors.length>0) {
                return pendingVendors.length;
          }
          return 0;
         
    }

       /**
            * @dev RETURNS THE LIST OF APPROVED VENDORS
            * @return uint number of approved vendors 
            */
    function getApprovedVendorsCount() public view returns (uint) {
        if(approvedVendors.length>0) {
               return approvedVendors.length;
          }
          return 0;
    }
    
     /**
            * @dev RETURNS THE NUMBER OF PENDING VENDORS
            * @return uint number of approved vendors 
            */
    function getPendingVendors() public view returns (uint) {
          if(pendingVendors.length>0) {
               return pendingVendors.length;
          }
          return 0;
    }
    
     /**
            * @dev RETURNS APPROVED VENDOR
            * @param index array index of vendor
            * @return name name of vendor
            * @return email email of vendor
            * @return phone phone number of vendor
            * @return state vendor status - approved / pending 
            * @return account vendor address
            */
    function getApprovedVendorByIndex(uint index) public view returns (string, string, string, uint, address) {
         require(index < approvedVendors.length, "Invalid index");
          return(
              approvedVendors[index].name,
              approvedVendors[index].email,
              approvedVendors[index].phone,
              uint(approvedVendors[index].state),
              approvedVendors[index].account
          );
    }

     /**
            * @dev RETURNS PENDING VENDOR
            * @param index array index of vendor
            * @return name name of vendor
            * @return email email of vendor
            * @return phone phone number of vendor
            * @return state vendor status - approved / pending 
            * @return account vendor address
            */
     function getPendingVendorByIndex(uint index) public view returns (string, string, string, uint, address) {
         require(index < pendingVendors.length, "Invalid index");
          return(
              pendingVendors[index].name,
              pendingVendors[index].email,
              pendingVendors[index].phone,
              uint(pendingVendors[index].state),
              pendingVendors[index].account
          );
    }
    
     /**
            * @dev RETURNS APPROVED VENDOR
            * @param index array index of vendor
            * @return name name of vendor
            * @return email email of vendor
            * @return phone phone number of vendor
            * @return state vendor status - approved / pending 
            * @return account vendor address
            */
     function getVendorByAddress(address account) public view returns (string, string, string, uint, address) {
         require(vendors[account].isVendorOrApplicant);
          return(
              vendors[account].name,
              vendors[account].email,
              vendors[account].phone,
              uint(vendors[account].state),
              vendors[account].account
          );
    }
    
    
    /**
      ALLOWS USERS TO PLACE REQUEST FOR A VENDOR ACCOUNT
     */
    function requestVendorAccount(string _name, string _email,  string _phone) public returns(bool) {
         //REVERT IF THE USER HAS ALREADY PLACED A REQUEST FOR A VENDOR ACCOUNT
          require(vendors[msg.sender].isVendorOrApplicant == false, "REQUEST IS IN PROCESS");
           
           //ADD THE USER TO THE LIST OF  VENDORS AS PENDING
          vendors[msg.sender] = Vendor(_name, _email, _phone, AccountState.Pending, 
          msg.sender, true,  int(pendingVendors.length),getNotExistsIndex(), AppRole.VendorAwaitingApproval, 0);
         
          setPendingVendor(_name,_email,_phone);

          emit VendorAccountRequested(true);
                                         
         return true;
    }
    
    function setPendingVendor(string _name, string _email,  string _phone) private returns (uint){

         pendingVendors.push(Vendor(_name, _email, _phone, AccountState.Pending,
         msg.sender, true, int(pendingVendors.length),getNotExistsIndex(),AppRole.VendorAwaitingApproval,0)) -1;
         
    }
    
    /**
      APPROVE A USER TO BECOME A VENDOR
     */
    function approveVendorAccount(address account) public ownerOnly returns(bool) {
         require(vendors[account].isVendorOrApplicant == true);
          vendors[account].state = AccountState.Approved;
          vendors[account].role = AppRole.Vendor;
          removeAccountFromPendingList(account);
          addAccountToApprovedList(account);

          emit VendorAccountApproved(true);

          return true;
    }
    
    /**
      REMOVES APPROVED VENDOR FROM PENDING VENDORS LIST
     */
    function removeAccountFromPendingList(address account) private returns(bool) {
          require(vendors[account].pendingListIndex > -1);
          pendingVendors[uint(vendors[account].pendingListIndex)] = pendingVendors[pendingVendors.length - 1];
          vendors[account].pendingListIndex = getNotExistsIndex();
          pendingVendors.length --;
           
      

          return true;
    }
    
    /**
      ADDS APPROVED VENDOR TO APPROVED VENDORS LIST
     */
    function addAccountToApprovedList(address account) private returns(bool) {
          vendors[account].approveListIndex = int(approvedVendors.length);
          approvedVendors.push(vendors[account]);
          return true;
    }
    
    
}