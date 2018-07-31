pragma solidity ^0.4.18;
import "./StoreBase.sol";

contract ProductManager is StoreBase {
    
    
    function getProduct(uint storeId, uint productId) {
        
    }
    
    function createProduct(uint storeIndex,string productName, string description, uint price) public returns(uint) {
         
          stores[msg.sender][storeIndex].products.push(Product(productName, description, price));
          return stores[msg.sender][storeIndex].products.length;
    }
    
      function editProduct(uint storeIndex, uint productIndex, string productName, string description, uint price) public  returns(bool) {
        
         stores[msg.sender][storeIndex].products[productIndex].name = productName;
         stores[msg.sender][storeIndex].products[productIndex].description = description;
         stores[msg.sender][storeIndex].products[productIndex].price = price;
         
         return true;
    }
    
     function deleteProduct(uint storeIndex, uint productIndex_to_delete) public returns(bool) {
           require(storeIndex < stores[msg.sender].length && productIndex_to_delete < stores[msg.sender][storeIndex].products.length);
           
           uint productsLength = stores[msg.sender][storeIndex].products.length;
           //copy the last product to the index of the product to remove
           stores[msg.sender][storeIndex].products[productIndex_to_delete] = stores[msg.sender][storeIndex].products[productsLength - 1];
           stores[msg.sender][storeIndex].products.length --;
          
          return true;
    } 
}

