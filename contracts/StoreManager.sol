pragma solidity 0.4.24;
import './UserManager.sol';
import "./Ownerble.sol";
import "./StoreBase.sol";
import "./VendorBase.sol";

/**@title StoreManager - manages vendors stores */
contract StoreManager is Ownerble, StoreBase, VendorBase {//is Ownerble, UserManager {
    
    event StoreCreated(uint256 storesSize);
    event StoreUpdated(bytes32 storeName, bytes32 description);
    event StoreDeleteted(uint256 storesSize);

    constructor() public {
    
    }
        

            /**
            * @dev  CREATES A NEW STORE FOR A VENDOR
            * @param storeName store name
            * @param description store description
            * @return uint count of stores
            */
     function createStore(bytes32 storeName, bytes32 description) public  returns(uint){
         require(vendors[msg.sender].state == AccountState.Approved);
          Store memory store;
          store.name = storeName;
          store.description = description;
          
          //ADDS STORE TO STORES LIST
          stores[msg.sender].push(store);
          //ADDS THE VENDOR TO THE LIST OF VENORS THAT HAVE ACTIVE STORES
          if(vendorSlot[msg.sender].initialized==false) {
              vendorSlot[msg.sender] = VendorSlot(true,
              vendorAccountsWithListedStores.length);
              vendorAccountsWithListedStores.push(msg.sender);
          }

          // EMITS STORE CREATED
          emit StoreCreated(stores[msg.sender].length);
 
          return  stores[msg.sender].length;
    }
    

     /**
            * @dev  UPDATEES A STORE
            * @param storeIndex array index of store
            * @param storeName store name
            * @param description store description
            * @return bool true if success 
            */
    function editStore(uint storeIndex, bytes32 storeName, bytes32 description) public returns(bool) {
       require(vendors[msg.sender].state == AccountState.Approved);
        require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));
         
          stores[msg.sender][storeIndex].name = storeName;
          stores[msg.sender][storeIndex].description = description;

          emit StoreUpdated(storeName, description);
    }
    
     /**
            * @dev DELETES A STORE
            * @param storeIndex array index of store
            * @return bool true if success 
            */
       function deleteStore(uint storeIndex) public returns(bool) {
          require(vendors[msg.sender].state == AccountState.Approved);
          
          require(stores[msg.sender].length> 0 && (storeIndex < stores[msg.sender].length));
          
          //COPY THE STORE IN THE LAST INDEX INTO THE DELETE INDEX (REPLACE)
          stores[msg.sender][storeIndex] = stores[msg.sender][stores[msg.sender].length - 1];
          //REDUCE STORE LENGTH BY 1
          stores[msg.sender].length --;
          
          //IF THE VEDOR HAS NO STORE, REMOVE VENDOR
          // FROM VENDORS LIST WITH ACTIVE STORES
          if(stores[msg.sender].length==0) {
               vendorAccountsWithListedStores[vendorSlot[msg.sender].slot] = vendorAccountsWithListedStores[vendorAccountsWithListedStores.length - 1];
               vendorAccountsWithListedStores.length--;
               delete vendorSlot[msg.sender];
          }

          emit StoreDeleteted(stores[msg.sender].length);
          
          return true;
    }
    

    /**
            * @dev RETURNS THE VENDORS STORE DETAILS
            * @param storeIndex array index of store
            * @return name name of store
            * @return description description of store
            * @return revenue revenue of store
            * @return storeIndex array index of store
            */
    function getStorePrivate(uint storeIndex) public view returns(bytes32, bytes32, uint, uint){
          uint revenue =  stores[msg.sender][storeIndex].revenue;
          return (
            stores[msg.sender][storeIndex].name,
            stores[msg.sender][storeIndex].description,
            revenue,
             storeIndex
         );

    }

     /**
            * @dev RETURNS STORE DETAILS
            * @param accountIndex array index of vendor account
            * @param storeIndex array index of store
            * @return name name of store
            * @return description description of store
            * @return storeIndex array index of store
            * @return accountIndex array index of vendor account
            */
    function getStorePublic(uint accountIndex, uint storeIndex) public view returns(bytes32, bytes32, uint, uint){
        //check if the account is in accounts with listed store and the account has a store 
        require(accountIndex < vendorAccountsWithListedStores.length && stores[vendorAccountsWithListedStores[accountIndex]].length > 0);

          return getStore(accountIndex, storeIndex);
    }
    

    /**
            * @dev RETURNS STORE DETAILS
            * @param accountIndex array index of vendor account
            * @param storeIndex array index of store
            * @return name name of store
            * @return description description of store
            * @return storeIndex array index of store
            * @return accountIndex array index of vendor account
            */
    function getStore(uint accountIndex, uint storeIndex) private view returns (bytes32, bytes32, uint, uint) {
          address user = vendorAccountsWithListedStores[accountIndex];
          
          return (
            stores[user][storeIndex].name,
            stores[user][storeIndex].description,
            storeIndex,
            accountIndex
         );
    }
    
    /**
            * @dev RETURNS THE NUMBER OF  VENDORS WITH ACTIVE STORES
            * @return number  of vendors with active stores
            */
    function getVendorAccountsWithListedStoresCount() public view returns(uint) {
          return vendorAccountsWithListedStores.length;
    }
    
 
    /**
            * @dev RETURNS THE NUMBER OF STORES FOR A PARTICULAR VENDOR
            * @return number of  stores
            */
    function getUserStoreCount() public view returns(uint) {
           return stores[msg.sender].length;
    }
    
       /**
            * @dev RETURNS THE NUMBER OF STORES FOR A PARTICULAR VENDOR
            * @param accountIndex array index of vendor account
            * @return number of  stores
            */
    function getVendorStoreCountPublic(uint accountIndex) public view returns(uint, uint) {
          
          
           return (
                   accountIndex,
                   stores[vendorAccountsWithListedStores[accountIndex]].length
               );
    }
    

}
