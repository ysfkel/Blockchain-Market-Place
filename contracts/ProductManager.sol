pragma solidity 0.4.24;
import "./StoreBase.sol";
import "./VendorBase.sol";

 /** @title product manager contract -  used by store owners for managing products . */
contract ProductManager is Ownerble, StoreBase , VendorBase{
   
     /**
      * @dev EMITS A PRODUCT GETS CREATED EVENT
      * @param productId Id of product
      * @param productIdSlot Index of product
      */
    event ProductCreated(uint productId, uint productIdSlot);
    /**
     
    */
     /**
      * @dev EMITS A PRODUCT GETS UPDATED EVENT
      * @param productId Id of product
      */
    event ProductUpdated(uint productId);

    /**
      * @dev EMITS  A PRODUCT GETS DELETED EVENT
      * @param productId Id of product 
      */
    event ProductDeleted(uint productId);
    
      /**
      * @dev EMITS  A PRODUCT IMAGE UPDATED  EVENT
      * @param imageHash image hash 
      * @param storeIndex array index of store 
      * @param productId array index of prodct
      */
    event ImageUpdated(string imageHash, uint256 storeIndex, uint256 productId);

    
     /**
      * @dev RETURNS PRODUCT ID ARRAY
      * @param storeIndex index of store in array
      * @return uint[] array of product ids
      */
    function getProductsIdsVendor(uint storeIndex) public view returns(uint[]) {
        return getProductsIds(msg.sender, storeIndex);
    }
    
    
       /**
      * @dev RETURNS PRODUCT ID ARRAY
      * @param accountIndex array index of vendor account
      * @return uint[] array of product ids
      */
     function getProductsIdsCustomer(uint accountIndex, uint storeIndex) public view returns(uint[]) {
        return (
          stores[vendorAccountsWithListedStores[accountIndex]][storeIndex].productIds    
        );
    }
    
      /**
      * @dev RETURNS PRODUCT ID ARRAY
      * @param accountIndex array index of vendor account
      * @return uint[] array of product ids
      */
     function getProductsIds(address account, uint storeIndex) public view returns(uint[]) {
        return (
          stores[account][storeIndex].productIds    
        );
    }
    
    
      /**
      * @dev RETURNS NUMBER OF PRODUCTS FOR A VENDOR STORE
      * @param storeIndex array index of store
      * @return uint count of products 
      */
    function getProductsCount(uint storeIndex) public view returns(uint) {
        return (
          stores[msg.sender][storeIndex].productIds.length    
        );
    }


      /**
      * @dev RETURNS THE VENDORS PRODUCTS FOR A SPECIFIED STORE
      * @param storeIndex array index of store 
      * @param productId id of product
      * @return name name of product  
      * @return description description of product  
      * @return price price of product in ether 
      * @return princeInSpinelToken product price in tokens
      * @return quantity quantity of product 
      * @return imageHash image hash  
      * @return msg.sender vendors address  
      * @return productId Id or product 
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
      * @dev RETURNS THE VENDORS PRODUCTS FOR A SPECIFIED STORE
      * @param accountIndex array index of vendor account
      * @param storeIndex array index of store
      * @param productId product ID
      * @return name name of product  
      * @return description description of product  
      * @return price price of product in ether 
      * @return princeInSpinelToken product price in tokens
      * @return quantity quantity of product 
      * @return imageHash image hash  
      * @return msg.sender vendors address  
      * @return productId Id or product 
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
      * @dev RETURNS THE QUANTITY OF PRODUCTS IN SPECIFIED STORE
      * @param storeIndex array index of store index of vendor account
      * @param productId array index of product
      * @return uint quantity of products in store  
     */
    function getProductQuantity(uint storeIndex, uint productId) public view returns(uint) {
          return stores[msg.sender][storeIndex].products[productId].quantity;
    } 

     /** 
      * @dev UPDATES PRODUCT IMAGE
      * @param imageHash image hash
      * @param storeIndex array index of store index of vendor account
      * @param productId array index of product 
     */
     function updateProductImage(string imageHash, uint256 storeIndex, uint256 productId ) public returns(bool) {
        require(vendors[msg.sender].state == AccountState.Approved);
          stores[msg.sender][storeIndex].products[productId].imageHash = imageHash;
          emit ImageUpdated(imageHash, storeIndex, productId);
     }
    
     /** 
      * @dev CREATES A NEW PRODUCT
      * @param productName product name
      * @param description product description
      * @param price product price
      * @param quantity product quantity
      * @param product price in spinel token
      * @return productIdSlot array index of product id 
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
      * @dev UPDATES THE SPEFICIED PRODUCT
      * @param storeIndex array index of store
      * @param productId array index of product
      * @param productName product name
      * @param description product description
      * @param price product price
      * @param quantity product quantity
      * @param product price in spinel token
      * @return bool true if success 
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
      * @dev DELETES THE SPEFICIED PRODUCT
      * @param storeIndex array index of store
      * @param productId array index of product
      * @return bool true if success 
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

