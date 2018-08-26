pragma solidity 0.4.24;
import "./StoreBase.sol";
import "./VendorBase.sol";

contract ProductManager is Ownerble, StoreBase , VendorBase{
   
    event ProductCreated(uint productId, uint productIdSlot);
    event ProductUpdated(uint productId);
    event ProductDeleted(uint productId);
    event ImageUpdated(string imageHash, uint256 storeIndex, uint256 productId);

    function getProductsIdsVendor(uint storeIndex) public view returns(uint[]) {
        return getProductsIds(msg.sender, storeIndex);
    }
    
     function getProductsIdsCustomer(uint accountIndex, uint storeIndex) public view returns(uint[]) {
        return (
          stores[vendorAccountsWithListedStores[accountIndex]][storeIndex].productIds    
        );
    }
    
     function getProductsIds(address account, uint storeIndex) public view returns(uint[]) {
        return (
          stores[account][storeIndex].productIds    
        );
    }
    
    function getProductsCount(uint storeIndex) public view returns(uint) {
        return (
          stores[msg.sender][storeIndex].productIds.length    
        );
    }

      function getProductVendor(uint storeIndex, uint productId) public constant 
      returns(bytes32,bytes32, uint, uint, uint , string, address, uint) {
               //return getProduct(msg.sender, storeIndex, productId);
              // string memory imageHash =  stores[msg.sender][storeIndex].products[productId].imageHash;
              //  uint productId = stores[msg.sender][storeIndex].products[productId].productId;
               return (
                 stores[msg.sender][storeIndex].products[productId].name,
                 stores[msg.sender][storeIndex].products[productId].description,
                 stores[msg.sender][storeIndex].products[productId].price,
                 stores[msg.sender][storeIndex].products[productId].priceInSpinelToken,
                 stores[msg.sender][storeIndex].products[productId].quantity,
                 stores[msg.sender][storeIndex].products[productId].imageHash,
                 msg.sender,
                 productId
                 
                // productId,
                 
              );
     }
     
      function getProductCustomer(uint accountIndex, uint storeIndex, uint productId) public constant returns(bytes32,
       bytes32, uint, uint,  string, address, uint) {
          
         // return getProduct(vendorAccountsWithListedStores[accountIndex] ,storeIndex, productId);
          address vendor = vendorAccountsWithListedStores[accountIndex];// ,storeIndex, productId
         // uint productId = stores[vendor][storeIndex].products[productId].productId;
          //string memory imageHash =  ;
          return (
                 stores[vendor][storeIndex].products[productId].name,
                 stores[vendor][storeIndex].products[productId].description,
                 stores[vendor][storeIndex].products[productId].price,
                 stores[vendor][storeIndex].products[productId].priceInSpinelToken,
                // stores[vendor][storeIndex].products[productId].quantity,
                 stores[vendor][storeIndex].products[productId].imageHash,
                 vendor,
                 productId
              );
     }
     
  

    function getProductQuantity(uint storeIndex, uint productId) public view returns(uint) {
          return stores[msg.sender][storeIndex].products[productId].quantity;
    } 

     function updateProductImage(string imageHash, uint256 storeIndex, uint256 productId ) public returns(bool) {
        require(vendors[msg.sender].state == AccountState.Approved);
          stores[msg.sender][storeIndex].products[productId].imageHash = imageHash;
          emit ImageUpdated(imageHash, storeIndex, productId);
     }
    
    function createProduct(uint storeIndex,bytes32 productName, bytes32 description, 
       uint price, uint quantity, uint priceInSpinelToken) public returns(uint) {
         require(vendors[msg.sender].state == AccountState.Approved);
         require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));
          //INCREMENT PRODUCT ID
          uint productIdSlot = stores[msg.sender][storeIndex].productIds.length;
        
          uint productId =  ++stores[msg.sender][storeIndex].productIdIncrement;
        
        
          //SAVE PRODUCT ID TO STORE
         stores[msg.sender][storeIndex].productIds.push(productId);
            //CREATE PRODUCT
          stores[msg.sender][storeIndex].products[productId] = Product(productName,
           description, price, productIdSlot, productId, quantity,
            priceInSpinelToken, "");
           emit ProductCreated(productId, productIdSlot);
          return productIdSlot;
    }

      function editProduct(uint storeIndex, uint productId, bytes32 productName, bytes32 description, uint price, uint quantity, uint priceInSpinelToken) public  returns(bool) {
         require(vendors[msg.sender].state == AccountState.Approved);
         require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));
         stores[msg.sender][storeIndex].products[productId].name = productName;
         stores[msg.sender][storeIndex].products[productId].description = description;
         stores[msg.sender][storeIndex].products[productId].price = price;
         stores[msg.sender][storeIndex].products[productId].quantity = quantity;
         stores[msg.sender][storeIndex].products[productId].priceInSpinelToken = priceInSpinelToken;
         emit ProductUpdated(productId);
         return true;
    }
    
   
    
    
     function deleteProduct(uint storeIndex, uint productId) public returns(bool) {
          require(vendors[msg.sender].state == AccountState.Approved);
          require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));

          //DELETE PRODUCT
          uint productIdIndex = stores[msg.sender][storeIndex].products[productId].productIdSlot;
          
          delete stores[msg.sender][storeIndex].products[productId];
          
          //GET PRODUCT IDS LIST  LENGTH 
           uint productsLength = stores[msg.sender][storeIndex].productIds.length;
          //copy the last product to the index of the product to remove
          stores[msg.sender][storeIndex].productIds[productIdIndex] = stores[msg.sender][storeIndex].productIds[productsLength - 1];
          stores[msg.sender][storeIndex].productIds.length --;

          emit ProductDeleted(productId);
          
          return true;
    } 
}

