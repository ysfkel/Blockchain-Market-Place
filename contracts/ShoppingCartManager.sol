pragma solidity ^0.4.0;
import './UserManager.sol';
import "./Ownerble.sol";
import "./StoreBase.sol";
import './SafeMath.sol';
import "./VendorBase.sol";

contract ShoppingCartManager is Ownerble, StoreBase, VendorBase {
    

    
    function getCartItem(uint productId) public view returns(uint, bytes32, bytes32, uint, uint, uint, address){
        //get store index
        uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
        uint productQuantityToPurchase = shoppingCarts[msg.sender].products[productId].productQuantity;
        address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
        //get product details
        bytes32 productName = stores[vendorAccount][storeIndex].products[productId].name;
        bytes32 productDescription = stores[vendorAccount][storeIndex].products[productId].description;
        uint productPrice = stores[vendorAccount][storeIndex].products[productId].price;
      
        return (
            productId,
            productName,
            productDescription,
            productPrice,
            productQuantityToPurchase,
            storeIndex,
            vendorAccount
        );
      // return shoppingCarts[msg.sender].cartPrice;
    }
    
    function getCartPrice() public view returns(uint){
        return shoppingCarts[msg.sender].cartPrice;
    }
    function getCartItemsCount() public view returns(uint){
        return shoppingCarts[msg.sender].productIds.length;
    }
    
    function getCartItemsIds() public view returns(uint[]){
        return shoppingCarts[msg.sender].productIds;
    }
    function addItemToCart(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) public returns(bool){
        require(stores[vendorAccount][storeIndex].products[productId].productId > 0 && 
        shoppingCarts[msg.sender].cartItemSlot[productId].initialized == false);
        //require that the vendor account is approved
        require(vendors[vendorAccount].state == AccountState.Approved);
        //GET PRODUCT SLOT / INDEX IN THE CART PRODUCT IDS LIST
        uint productSlot = shoppingCarts[msg.sender].productIds.length;
        //ADD PRODUCT ID TO LIST OF CART PRODUCT IDS, USED TO RETRIEVE PRODUCTS FOR DISPLAY
        shoppingCarts[msg.sender].productIds.push(productId);
        //INITIALZE SLOT WHICH CONTAINS THE ID INDEX/ SLOT
        shoppingCarts[msg.sender].cartItemSlot[productId] = CartItemSlot(true, productSlot);
                 
        //add product details
         shoppingCarts[msg.sender].products[productId] = ShoppingCartItem({
            productQuantity: productQuantity,
            vendorAccount: vendorAccount,
            storeIndex: storeIndex
          });
          //update cart price 
        return updateCartPrice(vendorAccount, storeIndex, productId, productQuantity);

    }
    
    function updateCartItem(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) public returns(bool){
        require(stores[vendorAccount][storeIndex].products[productId].productId > 0 && 
        shoppingCarts[msg.sender].cartItemSlot[productId].initialized == true);
        
         shoppingCarts[msg.sender].products[productId].productQuantity = productQuantity;
         
        return updateCartPrice(vendorAccount, storeIndex, productId, productQuantity);
         
    }
    
    function updateCartPrice(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) private returns(bool) {
      
         shoppingCarts[msg.sender].cartPrice = calculateCartPrice(
           shoppingCarts[msg.sender].cartPrice,
           stores[vendorAccount][storeIndex].products[productId].price,
           productQuantity
          );
          
          return true;
    }
    
    
    
    function deleteCartItem(uint productId ) public returns(bool) {
        //get product id index
        uint productCartIndex = shoppingCarts[msg.sender].cartItemSlot[productId].slot;
        //remove the deleted product id by exchanging position with last item
        shoppingCarts[msg.sender].productIds[productCartIndex] = shoppingCarts[msg.sender].productIds[shoppingCarts[msg.sender].productIds.length - 1];
        
        //
        uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
        uint productQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
        uint currentCartPrice = shoppingCarts[msg.sender].cartPrice;
        //
        delete shoppingCarts[msg.sender].products[productId];
        delete shoppingCarts[msg.sender].cartItemSlot[productId];
        //
        uint productPrice = stores[msg.sender][storeIndex].products[productId].price;
        //UPDATE CART PRICE
        shoppingCarts[msg.sender].cartPrice = deductDeletedCartItemPriceFromCartPrice(productPrice,
        productQuantity, currentCartPrice);
        
        return true;
    }
    
    function deductDeletedCartItemPriceFromCartPrice(uint productPrice, uint purchasedQuantity, 
    uint currentCartPrice) private pure returns(uint){
            
            return SafeMath.sub(currentCartPrice, (SafeMath.mul(productPrice, purchasedQuantity )));
    }
    
    function calculateCartPrice(uint currentCartPrice, uint productPrice, uint quantity ) private pure returns(uint) {
         
         uint totalPrice = SafeMath.mul(productPrice, quantity);
         uint newCartPrice = SafeMath.add(currentCartPrice, totalPrice);
         return newCartPrice;
    }
    
    function checkOut() public payable returns(bool) {
        require(shoppingCarts[msg.sender].productIds.length > 0);
        require(msg.value >= shoppingCarts[msg.sender].cartPrice);
        uint customerBalance = msg.value;
        for(uint i = 0; i< shoppingCarts[msg.sender].productIds.length; i++) {
            //
            uint productId = shoppingCarts[msg.sender].productIds[0];
            uint purchasedQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
            uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
            address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
            require(stores[vendorAccount][storeIndex].products[productId].productId > 0);
            //check the quantity available equal to or greater than purchased quantity
            require(stores[vendorAccount][storeIndex].products[productId].quantity >= purchasedQuantity);
            //require the vendorAccount is a vendor
            require(vendors[vendorAccount].state == AccountState.Approved);
            //GET PRODUCT PRIVPRODUCT
            uint productPrice = stores[vendorAccount][storeIndex].products[productId].price;
            
            uint totalItemsPrice = SafeMath.mul(productPrice, purchasedQuantity);
             
            require(customerBalance >= totalItemsPrice);
            
            customerBalance = SafeMath.sub(customerBalance, totalItemsPrice);
            //UPDATE STORE revenue // READ ONLY
            stores[vendorAccount][storeIndex].revenue = SafeMath.add(stores[vendorAccount][storeIndex].revenue, totalItemsPrice);
            //UPDATE RETRIEVABLE BALANCE
            vendors[vendorAccount].balance = SafeMath.add(vendors[vendorAccount].balance, totalItemsPrice);
            
            //REDUCE PRODUCT quantity
            stores[vendorAccount][storeIndex].products[productId].quantity = SafeMath
            .sub(stores[vendorAccount][storeIndex].products[productId].quantity,
                purchasedQuantity
                 );
            
            return true;
            
        }
       //stores
        
    }
    
}