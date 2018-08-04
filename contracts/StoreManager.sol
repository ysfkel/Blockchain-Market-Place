pragma solidity ^0.4.18;
import './UserManager.sol';
import "./Ownerble.sol";
import "./StoreBase.sol";

contract StoreManager is Ownerble, StoreBase {//is Ownerble, UserManager {
    
   
    struct VendorSlot{
        bool initialized;
        uint slot;
    }
    
    address[] private vendorAccountsWithListedStores;
    mapping(address => VendorSlot) private vendorSlot;
     
    constructor() public {
    
    }
    
        
     function createStore(bytes32 storeName, bytes32 description) public  returns(uint){
        
          Store memory store;
          store.name = storeName;
          store.description = description;
          
          stores[msg.sender].push(store);
          
          if(vendorSlot[msg.sender].initialized==false) {
              vendorSlot[msg.sender] = VendorSlot(true,
              vendorAccountsWithListedStores.length);
              vendorAccountsWithListedStores.push(msg.sender);
          }
 
          return  stores[msg.sender].length;
    }
    
    function editStore(uint storeIndex, bytes32 storeName, bytes32 description) public returns(bool) {
          stores[msg.sender][storeIndex].name = storeName;
          stores[msg.sender][storeIndex].description = description;
    }
    
       function deleteStore(uint storeIndex) public returns(bool) {
          require(storeIndex < stores[msg.sender].length);
          
          //COPY THE STORE IN THE LAST INDEX INTO THE DELETE INDEX (REPLACE)
          stores[msg.sender][storeIndex] = stores[msg.sender][stores[msg.sender].length - 1];
          //REDUCE STORE LENGTH BY 1
          stores[msg.sender].length --;
          
          if(stores[msg.sender].length==0) {
               vendorAccountsWithListedStores[vendorSlot[msg.sender].slot] = vendorAccountsWithListedStores[vendorAccountsWithListedStores.length - 1];
               vendorAccountsWithListedStores.length--;
               delete vendorSlot[msg.sender];
          }
          
          return true;
    }
    
    //    mapping(address => Store[]) internal stores;
    function getStorePrivate(uint storeIndex) public view returns(bytes32, bytes32){
        return getStore(msg.sender, storeIndex);
    }
    
    function getStorePublic(uint accountIndex, uint storeIndex) public view returns(bytes32, bytes32){
        //check if the account is in accounts with listed store and the account has a store 
        require(accountIndex < vendorAccountsWithListedStores.length && stores[vendorAccountsWithListedStores[accountIndex]].length > 0);
        
        return getStore(vendorAccountsWithListedStores[accountIndex], storeIndex);
    }
    
    function getStore(address user, uint storeIndex) private view returns (bytes32, bytes32) {
          return (
            stores[user][storeIndex].name,
            stores[user][storeIndex].description
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
