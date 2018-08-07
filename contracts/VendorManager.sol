pragma solidity ^0.4.18;
import "./Ownerble.sol";
import "./UserManager.sol";
import "./Base.sol";
import "./VendorBase.sol"; 

contract VendorManager is Base, Ownerble, VendorBase {
    
    Vendor[] internal pendingVendors;
    Vendor[] internal approvedVendors;
    

    function getPendingVendorsCount() public view returns (uint) {
          if(pendingVendors.length>0) {
                return pendingVendors.length;
          }
          return 0;
         
    }
    
    function getApprovedVendorsCount() public view returns (uint) {
        if(approvedVendors.length>0) {
               return approvedVendors.length;
          }
          return 0;
    }
    
    function getPendingVendors() public view returns (uint) {
          if(pendingVendors.length>0) {
               return pendingVendors.length;
          }
          return 0;
    }
    
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
    
    
    
    function requestVendorAccount(string _name, string _email,  string _phone) public returns(bool) {
          require(vendors[msg.sender].isVendorOrApplicant == false, "REQUEST IS IN PROCESS");
           
          vendors[msg.sender] = Vendor(_name, _email, _phone, AccountState.Pending, 
          msg.sender, true,  int(pendingVendors.length),getNotExistsIndex(), AppRole.VendorAwaitingApproval, 0);
          setPendingVendor(_name,_email,_phone);
                                         
         return true;
    }
    
    function setPendingVendor(string _name, string _email,  string _phone) private returns (uint){

         pendingVendors.push(Vendor(_name, _email, _phone, AccountState.Pending,
         msg.sender, true, int(pendingVendors.length),getNotExistsIndex(),AppRole.VendorAwaitingApproval,0)) -1;
         
    }
    
    function approveVendorAccount(address account) public returns(bool) {
         require(vendors[account].isVendorOrApplicant == true);
          vendors[account].state = AccountState.Approved;
          vendors[account].role = AppRole.Vendor;
          removeAccountFromPendingList(account);
          addAccountToApprovedList(account);
          return true;
    }
    
    function removeAccountFromPendingList(address account) private returns(bool) {
          require(vendors[account].pendingListIndex > -1);
          pendingVendors[uint(vendors[account].pendingListIndex)] = pendingVendors[pendingVendors.length - 1];
          vendors[account].pendingListIndex = getNotExistsIndex();
          pendingVendors.length --;
           
          return true;
    }
    
    function addAccountToApprovedList(address account) private returns(bool) {
          vendors[account].approveListIndex = int(approvedVendors.length);
          approvedVendors.push(vendors[account]);
          return true;
    }
    
    
}