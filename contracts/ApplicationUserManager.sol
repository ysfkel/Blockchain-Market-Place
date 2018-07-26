pragma solidity ^0.4.18;


contract ApplicationUserManager {
    
    enum AccountState {
        Pending,
        Approved
    }
    
    struct Vendor {
        string name;
        string email;
        string phone;
        AccountState state;
        address account;
        bool isVendorOrApplicant;
        int pendingListIndex;
        int approveListIndex;
    }
    
    mapping(address => Vendor) private vendors;
    AccountState accountState;
    Vendor[] private pendingVendors;
    Vendor[] private approvedVendors;
    
    
    
    
    function getPendingVendorsCount() public view returns (uint) {
          return pendingVendors.length;
    }
    
    function getApprovedVendorsCount() public view returns (uint) {
          return approvedVendors.length;
    }
    
    function getPendingVendors() public view returns (uint) {
          return pendingVendors.length;
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
           
          vendors[msg.sender] = Vendor(_name, _email, _phone, AccountState.Pending,  msg.sender, true,  int(pendingVendors.length),getNotExistsIndex());
          setPendingVendor(_name,_email,_phone);
                                         
         return true;
    }
    
    function setPendingVendor(string _name, string _email,  string _phone) private returns (uint){

         pendingVendors.push(Vendor(_name, _email, _phone, AccountState.Pending,  msg.sender, true, int(pendingVendors.length),getNotExistsIndex())) -1;
         
    }
    
    function approveVendorAccount(address account) public returns(bool) {
         require(vendors[account].isVendorOrApplicant == true);
          vendors[account].state = AccountState.Approved;
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
    
    function getNotExistsIndex() private pure returns (int) {
         return -1;
    }
             
    function getApprovedIndex_P() public view returns (int) {
          return pendingVendors[0].approveListIndex;
    }
    
    function getPendingIndex_P() public view returns (int) {
          return pendingVendors[0].pendingListIndex;
    }
    
     function getApprovedIndex_A() public view returns (int) {
          return approvedVendors[0].approveListIndex;
    }
    
    function getPendingIndex_A() public view returns (int) {
          return approvedVendors[0].pendingListIndex;
    }
    
}