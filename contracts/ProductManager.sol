pragma solidity 0.4.24;
import "./StoreBase.sol";
import "./VendorBase.sol";

/**
  THIS CONTRACT IS USED BY STORE OWNERS TO MANAGE  STORE PRODUCTS
 */
contract ProductManager is Ownerble, StoreBase , VendorBase{
   
   /**
     EVENT TRIGGERED WHEN A PRODUCT GETS CREATED
    */
    event ProductCreated(uint productId, uint productIdSlot);
    /**
     EVENT TRIGGERED WHEN A PRODUCT GETS UPDATED
    */
    event ProductUpdated(uint productId);
    /**
     EVENT TRIGGERED WHEN A PRODUCT GETS DELETED
    */
    event ProductDeleted(uint productId);
    /**
     EVENT TRIGGERED WHEN A PRODUCT IMAGE HASH IS  UPDATED
    */
    event ImageUpdated(string imageHash, uint256 storeIndex, uint256 productId);

    /**
     EVENT TRIGGERED WHEN A PRODUCT GETS CREATED
    */
    function getProductsIdsVendor(uint storeIndex) public view returns(uint[]) {
        return getProductsIds(msg.sender, storeIndex);
    }
    
    /**
      RETURNS THE IDS OF PRODUCTS IN A SPECIFIED VENDORS STORE
     */
     function getProductsIdsCustomer(uint accountIndex, uint storeIndex) public view returns(uint[]) {
        return (
          stores[vendorAccountsWithListedStores[accountIndex]][storeIndex].productIds    
        );
    }
    
    /**
      RETURNS THE IDS OF PRODUCTS IN A SPECIFIED VENDORS STORE
     */
     function getProductsIds(address account, uint storeIndex) public view returns(uint[]) {
        return (
          stores[account][storeIndex].productIds    
        );
    }
    
    /**
      RETURNS NUMBER OF PRODUCTS  FOR A VENDOR STORE
     */
    function getProductsCount(uint storeIndex) public view returns(uint) {
        return (
          stores[msg.sender][storeIndex].productIds.length    
        );
    }

    /**
      RETURNS THE VENDORS PRODUCTS FOR A SPECIFIED STORE
     */
    function getProductVendor(uint storeIndex, uint productId) public constant 
       returns(bytes32,bytes32, uint, uint, uint , string, address, uint) {
               return (
                 stores[msg.sender][storeIndex].products[productId].name,
                 stores[msg.sender][storeIndex].products[productId].description,
                 stores[msg.sender][storeIndex].products[productId].price,
                 stores[msg.sender][storeIndex].products[productId].priceInSpinelToken,
                 stores[msg.sender][storeIndex].products[productId].quantity,
                 stores[msg.sender][storeIndex].products[productId].imageHash,
                 msg.sender,
                 productId
              );
     }
     
     /**
      RETURNS THE VENDORS PRODUCTS FOR A SPECIFIED STORE
     */
      function getProductCustomer(uint accountIndex, uint storeIndex, uint productId) public constant returns(bytes32,
       bytes32, uint, uint,  string, address, uint) {
          address vendor = vendorAccountsWithListedStores[accountIndex];
        
          return (
                 stores[vendor][storeIndex].products[productId].name,
                 stores[vendor][storeIndex].products[productId].description,
                 stores[vendor][storeIndex].products[productId].price,
                 stores[vendor][storeIndex].products[productId].priceInSpinelToken,
                 stores[vendor][storeIndex].products[productId].imageHash,
                 vendor,
                 productId
              );
     }
     
  

   /**
      RETURNS THE QUANTITY OF PRODUCTS IN SPECIFIED STORE
     */
    function getProductQuantity(uint storeIndex, uint productId) public view returns(uint) {
          return stores[msg.sender][storeIndex].products[productId].quantity;
    } 


      /**
       UPDATES PRODUCT IMAGE
     */
     function updateProductImage(string imageHash, uint256 storeIndex, uint256 productId ) public returns(bool) {
        require(vendors[msg.sender].state == AccountState.Approved);
          stores[msg.sender][storeIndex].products[productId].imageHash = imageHash;
          emit ImageUpdated(imageHash, storeIndex, productId);
     }
    
    /**
      CREATE A NEW PRODUCT
     */
    function createProduct(uint storeIndex,bytes32 productName, bytes32 description, 
       uint price, uint quantity, uint priceInSpinelToken) public returns(uint) {
         require(vendors[msg.sender].state == AccountState.Approved);
         require(stores[msg.sender].length > 0 && (storeIndex < stores[msg.sender].length));
          //GET THE LOCATION / INDEX OF THE PRODUCT IN THE PRODUCTS IDS ARRAY
          uint productIdSlot = stores[msg.sender][storeIndex].productIds.length;
        
          //GENERATE THE PRODUCT ID BY INCREMENTING THE PRODUCT COUNT
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

     /**
       UPDATES THE SPEFICIED PRODUCT
     */
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
    
     /**
       DELETES THE SPEFICIED PRODUCT
     */
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

