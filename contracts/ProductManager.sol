pragma solidity ^0.4.18;
import "./StoreBase.sol";

contract ProductManager is StoreBase {
   
    
    function getProductsIds(uint storeIndex) public view returns(uint[]) {
        return (
          stores[msg.sender][storeIndex].productIds    
        );
    }
    
    function getProductsCount(uint storeIndex) public view returns(uint) {
        return (
          stores[msg.sender][storeIndex].productIds.length    
        );
    }
    function getProduct(uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint) {
          
         // require(storeIndex < stores[msg.sender].length && productIndex < stores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
            
          return (
                 stores[msg.sender][storeIndex].products[productId].name,
                 stores[msg.sender][storeIndex].products[productId].description,
                 stores[msg.sender][storeIndex].products[productId].price,
                 productId,
                 storeIndex
                 
              );
        }
        
    
    function createProduct(uint storeIndex,bytes32 productName, bytes32 description, uint price) public returns(uint) {
         
          //INCREMENT PRODUCT ID
          uint productIdSlot = stores[msg.sender][storeIndex].productIds.length;
        
          uint productId =  ++stores[msg.sender][storeIndex].productIdIncrement;
        
        
          //SAVE PRODUCT ID TO STORE
         stores[msg.sender][storeIndex].productIds.push(productId);
            //CREATE PRODUCT
          stores[msg.sender][storeIndex].products[productId] = Product(productName, description, price, productIdSlot);
          
          return productIdSlot;
    }
    
      function editProduct(uint storeIndex, uint productId, bytes32 productName, bytes32 description, uint price) public  returns(bool) {
        
         stores[msg.sender][storeIndex].products[productId].name = productName;
         stores[msg.sender][storeIndex].products[productId].description = description;
         stores[msg.sender][storeIndex].products[productId].price = price;
         
         return true;
    }
    
    
     function deleteProduct(uint storeIndex, uint productId) public returns(bool) {
          //require(storeIndex < stores[msg.sender].length && productIndex_to_delete < stores[msg.sender][storeIndex].products.length);

          //DELETE PRODUCT
          uint productIdIndex = stores[msg.sender][storeIndex].products[productId].productIdSlot;
          
          delete stores[msg.sender][storeIndex].products[productId];
          
          //GET PRODUCT IDS LIST  LENGTH 
           uint productsLength = stores[msg.sender][storeIndex].productIds.length;
          //copy the last product to the index of the product to remove
          stores[msg.sender][storeIndex].productIds[productIdIndex] = stores[msg.sender][storeIndex].productIds[productsLength - 1];
          stores[msg.sender][storeIndex].productIds.length --;
          
          return true;
    } 
}

