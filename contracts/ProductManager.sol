pragma solidity ^0.4.18;
import "./StoreBase.sol";
import "./VendorBase.sol";

contract ProductManager is Ownerble, StoreBase , VendorBase{
   
    event ProductCreated(uint productId, uint productIdSlot);
    event ProductUpdated(uint productId);
    event ProductDeleted(uint productId);

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

      function getProductVendor(uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint, address, uint) {
          
         // require(storeIndex < stores[msg.sender].length && productIndex < stores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
          return getProduct(msg.sender, storeIndex, productId);
     }
     
      function getProductCustomer(uint accountIndex, uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint, address, uint) {
          
         // require(storeIndex < stores[msg.sender].length && productIndex < stores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
            
          return getProduct(vendorAccountsWithListedStores[accountIndex] ,storeIndex, productId);
     }
     
    function getProduct(address vendor, uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint, address, uint) {
          
         
          return (
                 stores[vendor][storeIndex].products[productId].name,
                 stores[vendor][storeIndex].products[productId].description,
                 stores[vendor][storeIndex].products[productId].price,
                 stores[vendor][storeIndex].products[productId].priceInSpinelToken,
                 stores[vendor][storeIndex].products[productId].quantity,
                 vendor,
                 productId
              );
     }
    
    //  function getProductVendor(uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint, address, uint) {
          
    //      // require(storeIndex < stores[msg.sender].length && productIndex < stores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
    //        return getProduct(msg.sender, storeIndex, productId);
    //  }
     
    //   function getProductCustomer(uint accountIndex, uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint, address, uint) {
          
    //      // require(storeIndex < stores[msg.sender].length && productIndex < stores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
            
    //       return getProduct(vendorAccountsWithListedStores[accountIndex] ,storeIndex, productId);
    //  }
     
    // function getProduct(address vendor, uint storeIndex, uint productId) public constant returns(bytes32, bytes32, uint, uint, uint, address, uint) {
          
    //      // require(storeIndex < stores[msg.sender].length && productIndex < stores[msg.sender][storeIndex].products.length, "PRODUCT INDEX DOES NOT EXIST");
    //       uint quantity =  stores[vendor][storeIndex].products[productId].quantity;
    //       return (
    //              stores[vendor][storeIndex].products[productId].name,
    //              stores[vendor][storeIndex].products[productId].description,
    //              stores[vendor][storeIndex].products[productId].price,
    //              stores[vendor][storeIndex].products[productId].productId,
    //              storeIndex,
    //              vendor,
    //              quantity
    //           );
    //  }

    function getProductQuantity(uint storeIndex, uint productId) public view returns(uint) {
          return stores[msg.sender][storeIndex].products[productId].quantity;
    } 

      function createProduct(uint storeIndex,bytes32 productName, bytes32 description, uint price, uint quantity, uint priceInSpinelToken) public returns(uint) {
         require(vendors[msg.sender].state == AccountState.Approved);
         require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));
          //INCREMENT PRODUCT ID
          uint productIdSlot = stores[msg.sender][storeIndex].productIds.length;
        
          uint productId =  ++stores[msg.sender][storeIndex].productIdIncrement;
        
        
          //SAVE PRODUCT ID TO STORE
         stores[msg.sender][storeIndex].productIds.push(productId);
            //CREATE PRODUCT
          stores[msg.sender][storeIndex].products[productId] = Product(productName, description, price, productIdSlot, productId, quantity, priceInSpinelToken);
           emit ProductCreated(productId, productIdSlot);
          return productIdSlot;
    }
    //storeIndex, productId, name, description, price, quantity
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
    
    // function createProduct(uint storeIndex,bytes32 productName, bytes32 description, uint price, uint quantity) public returns(uint) {
    //       require(vendors[msg.sender].state == AccountState.Approved);
    //       require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));

    //       //INCREMENT PRODUCT ID
    //       uint productIdSlot = stores[msg.sender][storeIndex].productIds.length;
        
    //       uint productId =  ++stores[msg.sender][storeIndex].productIdIncrement;
        
        
    //       //SAVE PRODUCT ID TO STORE
    //      stores[msg.sender][storeIndex].productIds.push(productId);
    //         //CREATE PRODUCT
    //       stores[msg.sender][storeIndex].products[productId] = Product(productName, description, price, productIdSlot, productId, quantity);
          
    //       emit ProductCreated(productId, productIdSlot);

    //       return productIdSlot;
    // }
    
    //   function editProduct(uint storeIndex, uint productId, bytes32 productName, bytes32 description, uint price, uint quantity) public  returns(bool) {
    //     require(vendors[msg.sender].state == AccountState.Approved);
    //     require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));

    //      stores[msg.sender][storeIndex].products[productId].name = productName;
    //      stores[msg.sender][storeIndex].products[productId].description = description;
    //      stores[msg.sender][storeIndex].products[productId].price = price;
    //      stores[msg.sender][storeIndex].products[productId].quantity = quantity;

    //      emit ProductUpdated(productId);

    //      return true;
    // }
    
    
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

