pragma solidity ^0.4.18;
import './ApplicationUserManager.sol';

contract MarketPlace is ApplicationUserManager {
    
   
    struct Product {
       // uint id;
        string name;
        string description;
        uint price;
        uint quantity;
    }
    
   
    enum Role {
        Admin, SuperAdmin
    }

    struct StoreUser {
        Role role;
    }
    struct Store {
        string name;
        string description;
        uint balance;
        Product[] products;
        uint publicIndex;
        mapping(address => StoreUser) users;
    }
    
  

    
    mapping(string =>  Store[]) private publicStore; 
    
    mapping(address => Store[]) public userStores;
    mapping(address => uint) public userStoresCount;

     
    constructor() public {
    
        
    }
    
    function getStoreProductsCount(uint storeIndex) public constant returns(uint) {
          return userStores[msg.sender][storeIndex].products.length;
    }
    
      function getStoreProductsCountPublic(uint storeIndex) public constant returns(uint) {
          return publicStore["public"][storeIndex].products.length;
    }
    
    
     function getUserStoreProduct(uint storeIndex, uint productIndex) public constant returns(string, string, uint, uint) {
          
          require(storeIndex < userStores[msg.sender].length && productIndex < userStores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
            
          return (
                 userStores[msg.sender][storeIndex].products[productIndex].name,
                 userStores[msg.sender][storeIndex].products[productIndex].description,
                 userStores[msg.sender][storeIndex].products[productIndex].price,
                   userStores[msg.sender][storeIndex].products[productIndex].quantity
              );
        }
        
        //get product from public storeIndex  function getUserStoreProduct(uint storeIndex, uint productIndex) public constant returns(string, string, uint, uint) {
          
        function getStoreProductPublic(uint storeIndex, uint productIndex) public constant returns(string, string, uint, uint) {
          
          require(storeIndex < publicStore["public"].length && productIndex < publicStore["public"][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
            
          return (
                 publicStore["public"][storeIndex].products[productIndex].name,
                 publicStore["public"][storeIndex].products[productIndex].description,
                 publicStore["public"][storeIndex].products[productIndex].price,
                 publicStore["public"][storeIndex].products[productIndex].quantity
              );
        }
    
  
    
    function editStore(uint storeIndex, string storeName, string description) public returns(bool) {
           userStores[msg.sender][storeIndex].name = storeName;
           userStores[msg.sender][storeIndex].description = description;
           //get store publicIndex
           uint publicIndex = userStores[msg.sender][storeIndex].publicIndex;
           //update public store
           publicStore["public"][publicIndex].name = storeName;
           publicStore["public"][publicIndex].description = description;
    }
    
    function createStore(string storeName, string description) public  returns(uint){
          Store storage store;
          //Store storage store =   userStores[msg.sender][0];
          userStoresCount[msg.sender]++;
          store.name=storeName;
          store.description =description;
          store.users[msg.sender] = StoreUser(Role.SuperAdmin);
          
          //add to public store publicStoreList
          //GET THE INDEX WHERE THE STORE WILL BE STORED IN THE PUBLIC STORE publicStoreList
          uint publicIndex = publicStore["public"].length;
          store.publicIndex = publicIndex;
          
          userStores[msg.sender].push(store);
          publicStore["public"].push(store);
          return  publicStore["public"].length;
    }
    
  
    
    function deleteStore(uint storeIndex) public returns(bool) {
          require(storeIndex < userStores[msg.sender].length);
            //GET THE PUBLIC INDEX OF THE ITEM TO DELTE TO UPDATE IN THE PUBLIC STORE LIST
          uint publicIndex_item_to_delete = userStores[msg.sender][storeIndex].publicIndex;
          uint publicIndex_item_to_update = userStores[msg.sender][userStores[msg.sender].length - 1].publicIndex;
         
         uint index_of_last_public_item =  publicStore["public"].length - 1;
         
         if(index_of_last_public_item == publicIndex_item_to_update) {
             userStores[msg.sender][userStores[msg.sender].length - 1].publicIndex = publicIndex_item_to_delete;
         }
         
          //COPY THE STORE IN THE LAST INDEX INTO THE DELETE INDEX (REPLACE) - public stores
          publicStore["public"][publicIndex_item_to_delete] = publicStore["public"][publicStore["public"].length - 1];
          
          //COPY THE STORE IN THE LAST INDEX INTO THE DELETE INDEX (REPLACE)
          userStores[msg.sender][storeIndex] = userStores[msg.sender][userStores[msg.sender].length - 1];

          
          //REDUCE STORE LENGTH BY 1
          userStores[msg.sender].length --;
          publicStore["public"].length --;
          userStoresCount[msg.sender]--;
          
          return true;
    }
    
    
    function getOwnStore(uint storeIndex) public view returns(string, string, uint){
        return getStore(msg.sender, storeIndex);
    }
    
    function getPublicStore(uint storeIndex) public view returns(string, string) {
             return (
            publicStore["public"][storeIndex].name,
            publicStore["public"][storeIndex].description
        );
    }
    
     function getPublicStoreSize() public view returns(uint) {
             return (
            publicStore["public"].length
        );
    }
    
    
     function getUserStore(address user, uint storeIndex) public view returns(string, string, uint){
        return getStore(user, storeIndex);
    }
    
    function getStore(address user, uint storeIndex) private view returns (string, string, uint) {
          return (
            userStores[user][storeIndex].name,
            userStores[user][storeIndex].description,
             userStores[user][storeIndex].publicIndex
            
        );
    }
    function addProduct(uint storeIndex, string name, string description, uint price, uint quantity) public  returns(uint){
          
          userStores[msg.sender][storeIndex].products.push(Product(name, description, price, quantity));
          //get public index of product
          uint publicIndex = userStores[msg.sender][storeIndex].publicIndex;
          //add product to public store
          publicStore["public"][publicIndex].products.push(Product(name, description, price, quantity));
          
          return userStores[msg.sender][storeIndex].products.length;
    }
    
    function editProduct(uint storeIndex, uint productIndex, string productName, string description, uint price, uint quantity) public  returns(bool) {
         userStores[msg.sender][storeIndex].products[productIndex].name = productName;
         userStores[msg.sender][storeIndex].products[productIndex].description = description;
         userStores[msg.sender][storeIndex].products[productIndex].price = price;
         userStores[msg.sender][storeIndex].products[productIndex].quantity = quantity; 
         
         //get public index of product
         uint publicIndex = userStores[msg.sender][storeIndex].publicIndex;
         
         //
         publicStore["public"][publicIndex].products[productIndex].name = productName;
         publicStore["public"][publicIndex].products[productIndex].description = description;
         publicStore["public"][publicIndex].products[productIndex].price = price;
         publicStore["public"][publicIndex].products[productIndex].quantity = quantity; 
         
         return true;
    }
    
    function deleteProduct(uint storeIndex, uint productIndex_to_delete) public returns(bool) {
           require(storeIndex < userStores[msg.sender].length && productIndex_to_delete < userStores[msg.sender][storeIndex].products.length);
           
           uint productsLength = userStores[msg.sender][storeIndex].products.length;
           //copy the last product to the index of the product to remove
           userStores[msg.sender][storeIndex].products[productIndex_to_delete] = userStores[msg.sender][storeIndex].products[productsLength - 1];
           userStores[msg.sender][storeIndex].products.length --;
           
          //get public index of product
          uint publicIndex = userStores[msg.sender][storeIndex].publicIndex;
          publicStore["public"][publicIndex].products[productIndex_to_delete] = publicStore["public"][publicIndex].products[productsLength - 1];
          publicStore["public"][publicIndex].products.length --;
          
          return true;
    } 
    
   
    
}
