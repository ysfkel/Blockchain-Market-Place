pragma solidity ^0.4.18;
import './UserManager.sol';
import "./Ownerble.sol";
import "./StoreBase.sol";
import "./VendorBase.sol";

contract StoreManager is Ownerble, StoreBase, VendorBase {//is Ownerble, UserManager {
    
    event StoreCreated(uint256 storesSize);
    event StoreUpdated(bytes32 storeName, bytes32 description);
    event StoreDeleteted(uint256 storesSize);

    constructor() public {
    
    }
        
     function createStore(bytes32 storeName, bytes32 description) public  returns(uint){
         //      vendors[account].state = AccountState.Approved;
         require(vendors[msg.sender].state == AccountState.Approved);
          Store memory store;
          store.name = storeName;
          store.description = description;
          
          stores[msg.sender].push(store);
          
          if(vendorSlot[msg.sender].initialized==false) {
              vendorSlot[msg.sender] = VendorSlot(true,
              vendorAccountsWithListedStores.length);
              vendorAccountsWithListedStores.push(msg.sender);
          }

          emit StoreCreated(stores[msg.sender].length);
 
          return  stores[msg.sender].length;
    }
    
    function editStore(uint storeIndex, bytes32 storeName, bytes32 description) public returns(bool) {
      require(vendors[msg.sender].state == AccountState.Approved);
        require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));

          stores[msg.sender][storeIndex].name = storeName;
          stores[msg.sender][storeIndex].description = description;

          emit StoreUpdated(storeName, description);
    }
    
       function deleteStore(uint storeIndex) public returns(bool) {
          require(vendors[msg.sender].state == AccountState.Approved);
          require(stores[msg.sender].length> 0 && (storeIndex < stores[msg.sender].length));
          
          //COPY THE STORE IN THE LAST INDEX INTO THE DELETE INDEX (REPLACE)
          stores[msg.sender][storeIndex] = stores[msg.sender][stores[msg.sender].length - 1];
          //REDUCE STORE LENGTH BY 1
          stores[msg.sender].length --;
          
          if(stores[msg.sender].length==0) {
               vendorAccountsWithListedStores[vendorSlot[msg.sender].slot] = vendorAccountsWithListedStores[vendorAccountsWithListedStores.length - 1];
               vendorAccountsWithListedStores.length--;
               delete vendorSlot[msg.sender];
          }

          emit StoreDeleteted(stores[msg.sender].length);
          
          return true;
    }
    
    //    mapping(address => Store[]) internal stores;
    function getStorePrivate(uint storeIndex) public view returns(bytes32, bytes32, uint, uint){
          uint revenue =  stores[msg.sender][storeIndex].revenue;
          return (
            stores[msg.sender][storeIndex].name,
            stores[msg.sender][storeIndex].description,
            revenue,
             storeIndex
         );
        //return getStore(vendorSlot[msg.sender].slot, storeIndex);

    }
    
    function getStorePublic(uint accountIndex, uint storeIndex) public view returns(bytes32, bytes32, uint, uint){
        //check if the account is in accounts with listed store and the account has a store 
        require(accountIndex < vendorAccountsWithListedStores.length && stores[vendorAccountsWithListedStores[accountIndex]].length > 0);

          return getStore(accountIndex, storeIndex);
    }
    
    function getStore(uint accountIndex, uint storeIndex) private view returns (bytes32, bytes32, uint, uint) {
          address user = vendorAccountsWithListedStores[accountIndex];
          
          return (
            stores[user][storeIndex].name,
            stores[user][storeIndex].description,
            storeIndex,
            accountIndex
         );
    }
    
    function getVendorAccountsWithListedStoresCount() public view returns(uint) {
          return vendorAccountsWithListedStores.length;
    }
    
    function getUserStoreCount() public view returns(uint) {
           return stores[msg.sender].length;
    }
    
    function getVendorStoreCountPublic(uint accountIndex) public view returns(uint, uint) {
          
          
           return (
                   accountIndex,
                   stores[vendorAccountsWithListedStores[accountIndex]].length
               );
    }
    

}
