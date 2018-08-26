pragma solidity 0.4.24;
import './UserManager.sol';
import "./Ownerble.sol";
import "./StoreBase.sol";
import './SafeMath.sol';
import "./VendorBase.sol";
import "./SpinelTokenSale.sol";
import "./SpinelToken.sol";
import "./OrderHistory.sol";

contract ShoppingCartManager is Ownerble, StoreBase,
 VendorBase, OrderHistory{
    
   // SpinelTokenSale internal tokenSaleContract_shoppingCart;
    SpinelToken internal tokenContract_shoppingCart;

    event ItemInsertedToCart(uint cartSize);
    event CartItemUpdated(uint productQuantity);
    event CartItemDeleted(uint cartSize);
    event PaymentCompleted(bool status);
    event PaymentByTokenCompleted(uint256 amount);
    event PaymentByEtherCompleted(uint256 amount);

    function getCartItem(uint productId) public view returns(uint, bytes32, uint, uint, uint, uint, address){
        //get store index
        uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
        uint productQuantityToPurchase = shoppingCarts[msg.sender].products[productId].productQuantity;
        address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
        uint priceInSpinelToken = stores[vendorAccount][storeIndex].products[productId].priceInSpinelToken;
        //get product details
       // bytes32 memory productName = stores[vendorAccount][storeIndex].products[productId].name;
       // bytes32 memory productDescription = stores[vendorAccount][storeIndex].products[productId].description;
        //uint productPrice = stores[vendorAccount][storeIndex].products[productId].price;
      
        return (
            productId,
            stores[vendorAccount][storeIndex].products[productId].name,//productName
            stores[vendorAccount][storeIndex].products[productId].price,//productPrice,
            priceInSpinelToken,
            productQuantityToPurchase,
            storeIndex,
            vendorAccount
        );
      // return shoppingCarts[msg.sender].cartPrice;
    }
    
 
    function getCartPrice(uint256 paymentMethod) public view returns(uint256){
        require(PaymentMethod(paymentMethod) == PaymentMethod.Token ||
         PaymentMethod(paymentMethod) == PaymentMethod.Ether);
        uint256 cartPrice = 0;
      
        for(uint i; i < shoppingCarts[msg.sender].productIds.length; i++) {
           if(shoppingCarts[msg.sender].products[productId].purchaseComplete == false) {
             uint productId = shoppingCarts[msg.sender].productIds[i];
             ShoppingCartItem memory item = shoppingCarts[msg.sender].products[productId];
            uint productPrice;
             if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
                   productPrice = stores[item.vendorAccount][item.storeIndex].products[productId].priceInSpinelToken;
             } else {
                 productPrice = stores[item.vendorAccount][item.storeIndex].products[productId].price;
             }
            // uint productPrice = stores[item.vendorAccount][item.storeIndex].products[productId].price;
             uint productQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
             
             cartPrice = SafeMath.add(cartPrice, SafeMath.mul(productPrice, productQuantity));
           }
        }
        
        return cartPrice;
    }

    // function getCartPriceInTokenValue() public view returns(uint256) {
    //       return tokenSaleContract_shoppingCart.toSpinel(getCartPrice());
    // }
    
    function getCartItemsCount() public view returns(uint){
        return shoppingCarts[msg.sender].productIds.length;
    }
    
    function getCartItemsIds() public view returns(uint[]){
        return shoppingCarts[msg.sender].productIds;
    }
    function addItemToCart(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) public returns(bool){
        
       // delete shoppingCarts[msg.sender].cartItemSlot[productId];
        //check if quantity in the store is equql or greater than purchased quantity
        require(stores[vendorAccount][storeIndex].products[productId].quantity >= productQuantity);
        require(stores[vendorAccount][storeIndex].products[productId].productId >0);
        // require(stores[vendorAccount][storeIndex].products[productId].productId > 0 && 
        // shoppingCarts[msg.sender].cartItemSlot[productId].initialized == false);
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
            storeIndex: storeIndex,
            purchaseComplete: false
          });

          emit ItemInsertedToCart( shoppingCarts[msg.sender].productIds.length);
          //update cart price 
        return  true;

    }
    
    function updateCartItem(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) public returns(bool){
        //check if quantity in the store is equql or greater than purchased quantity
        require(stores[vendorAccount][storeIndex].products[productId].quantity >= productQuantity);
        
        // require(stores[vendorAccount][storeIndex].products[productId].productId > 0 && 
        // shoppingCarts[msg.sender].cartItemSlot[productId].initialized == true);

           require(stores[vendorAccount][storeIndex].products[productId].productId > 0 );

           

         shoppingCarts[msg.sender].products[productId].productQuantity = productQuantity;

        emit CartItemUpdated(shoppingCarts[msg.sender].products[productId].productQuantity);

         return true;
         
    }
    
   
    
    function deleteCartItem(uint productId ) public returns(bool) {
        //get product id index
        uint productCartIndex = shoppingCarts[msg.sender].cartItemSlot[productId].slot;
        //remove the deleted product id by exchanging position with last item
        shoppingCarts[msg.sender].productIds[productCartIndex] = shoppingCarts[msg.sender].productIds[shoppingCarts[msg.sender].productIds.length - 1];
         shoppingCarts[msg.sender].productIds.length --;
     
        delete shoppingCarts[msg.sender].products[productId];
        delete shoppingCarts[msg.sender].cartItemSlot[productId];

        emit CartItemDeleted(shoppingCarts[msg.sender].productIds.length);
        
        return true;
    }
    
    function deductDeletedCartItemPriceFromCartPrice(uint productPrice, uint purchasedQuantity, 
    uint currentCartPrice) private pure returns(uint){
            
            return SafeMath.sub(currentCartPrice, (SafeMath.mul(productPrice, purchasedQuantity )));
    }

    // function getCartPriceByPaymentMethod(uint256 paymentMethod)  public view returns(uint256) {

    //     if(PaymentMethod(paymentMethod) == PaymentMethod.Token){
    //         return getCartPriceInTokenValue();
    //     } else {
    //         return getCartPrice();
    //     }
    // }

   

    function isCustomerBalanceSufficient(uint256 paymentMethod, uint customerBalanceInWei) public view returns(bool) {
        if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
            return tokenContract_shoppingCart.balanceOf(msg.sender) >= 
            getCartPrice(paymentMethod);//getCartPriceInTokenValue();
        } else {
            return customerBalanceInWei >= getCartPrice(paymentMethod);
        }
    }

    function getItemsPrice(uint256 paymentMethod,  address vendorAccount, uint256 storeIndex, uint productId) public view returns(uint256) {


        if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
               return stores[vendorAccount][storeIndex].products[productId].priceInSpinelToken;
        } else {
            return stores[vendorAccount][storeIndex].products[productId].price;
        }
    }

  

    function getTotalItemsPrice(uint256 productPrice, uint256 purchasedQuantity) public pure returns(uint256) {

        uint256 totalItemsPrice = SafeMath.mul(productPrice, purchasedQuantity);

        return totalItemsPrice;
    }

    function getcustomerBalance(uint256 paymentMethod, uint256 customerBalance) public view returns(uint256){
         if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
               return tokenContract_shoppingCart.balanceOf(msg.sender);
        } else {
            return customerBalance;
        }
    }

    function payVendor(uint256 paymentMethod, address customerAccount, address vendorAccount, uint256 storeIndex,
     uint256 totalItemsPrice )
      public  returns(bool) {
        if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
             tokenContract_shoppingCart.transferFrom(customerAccount, vendorAccount, totalItemsPrice);
             emit PaymentByTokenCompleted(totalItemsPrice);
        } else {
         
          stores[vendorAccount][storeIndex].revenue = SafeMath.add(stores[vendorAccount][storeIndex].revenue, totalItemsPrice);
                    //UPDATE RETRIEVABLE BALANCE
          vendors[vendorAccount].balance = SafeMath.add(vendors[vendorAccount].balance, totalItemsPrice);
          emit PaymentByEtherCompleted(totalItemsPrice);
        }

         
                   
    }

function _createOrderHistory(
 address vendorAccount,
 uint256 productId,
 uint price,
 uint256 storeIndex, 
 uint256 quantity,
 uint256 paymentMethod

) private returns(bool) {
    uint256 currentOrderHistoryCount = getCustomerOrdersHistoryCount();
    uint256 orderId = ++currentOrderHistoryCount;
    uint totalItemsPrice = getTotalItemsPrice(price, quantity);
                

    addTransaction(
        orderId, 
        productId,
        price,
        quantity,
        totalItemsPrice,
        vendorAccount,
        storeIndex,
        paymentMethod
    );
}

 function checkOutTokenPayment(uint256 paymentMethod) public payable returns(bool){
        require(shoppingCarts[msg.sender].productIds.length > 0);
        require(isCustomerBalanceSufficient(paymentMethod, msg.value));
        // uint256 currentOrderHistoryCount = getCustomerOrdersHistoryCount();
        // uint256 orderId = ++currentOrderHistoryCount;

        uint customerBalance = getcustomerBalance(paymentMethod, msg.value);
        for(uint i = 0; i< shoppingCarts[msg.sender].productIds.length; i++) {
            //
           uint productId = shoppingCarts[msg.sender].productIds[0];
            if(shoppingCarts[msg.sender].products[productId].purchaseComplete ==false) {
            
                    uint purchasedQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
                    uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
                    address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
                    //check if product exists
                    require(stores[vendorAccount][storeIndex].products[productId].productId > 0);
                    //check the quantity available equal to or greater than purchased quantity
                    require(stores[vendorAccount][storeIndex].products[productId].quantity >= purchasedQuantity);
                    //require the vendorAccount is a vendor
                    require(vendors[vendorAccount].state == AccountState.Approved);
                    // //GET PRODUCT PRIVPRODUCT
                    //
                    uint productPrice = getItemsPrice(paymentMethod, vendorAccount, storeIndex, productId);//stores[vendorAccount][storeIndex].products[productId].price;
                    
                    uint totalItemsPrice = getTotalItemsPrice(productPrice, purchasedQuantity);
                
                     
                    require(customerBalance >= totalItemsPrice);
                    
                     customerBalance = SafeMath.sub(customerBalance, totalItemsPrice);

                     shoppingCarts[msg.sender].products[productId].purchaseComplete = true;
                     //uint256 paymentMethod, address customerAccount, address vendorAccount, uint256 storeIndexuint256 totalItemsPrice
                     payVendor(paymentMethod, msg.sender,vendorAccount, storeIndex, totalItemsPrice);
                   
                     _createOrderHistory(vendorAccount,productId, productPrice,storeIndex,
                      purchasedQuantity, paymentMethod);
                    // //
                    
                    // //REDUCE PRODUCT quantity
                    // stores[vendorAccount][storeIndex].products[productId].quantity = SafeMath
                    // .sub(stores[vendorAccount][storeIndex].products[productId].quantity,
                    //     purchasedQuantity
                    // );
                    
              }
        }
        
        incrementCustomerOrdersHistory();
        createOrderHistory(getCustomerOrdersHistoryCount(),
        getCartPrice(paymentMethod), paymentMethod);
        emit PaymentCompleted(true);
        delete shoppingCarts[msg.sender].products[productId];
        delete shoppingCarts[msg.sender];
         return true;
    }

    
   
    // function checkOut() public payable returns(bool) {
    //     require(shoppingCarts[msg.sender].productIds.length > 0);
    //     require(msg.value >= getCartPrice());
    //     uint customerBalance = msg.value;
    //     for(uint i = 0; i< shoppingCarts[msg.sender].productIds.length; i++) {
    //         //
    //         uint productId = shoppingCarts[msg.sender].productIds[0];
    //         if(shoppingCarts[msg.sender].products[productId].purchaseComplete ==false) {
            
    //                 uint purchasedQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
    //                 uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
    //                 address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
    //                 //check if product exists
    //                 require(stores[vendorAccount][storeIndex].products[productId].productId > 0);
    //                 //check the quantity available equal to or greater than purchased quantity
    //                 require(stores[vendorAccount][storeIndex].products[productId].quantity >= purchasedQuantity);
    //                 //require the vendorAccount is a vendor
    //                 require(vendors[vendorAccount].state == AccountState.Approved);
    //                 //GET PRODUCT PRIVPRODUCT
    //                 uint productPrice = stores[vendorAccount][storeIndex].products[productId].price;
                    
    //                 uint totalItemsPrice = SafeMath.mul(productPrice, purchasedQuantity);
                     
    //                 require(customerBalance >= totalItemsPrice);
                    
    //                 customerBalance = SafeMath.sub(customerBalance, totalItemsPrice);
    //                  shoppingCarts[msg.sender].products[productId].purchaseComplete = true;
    //                 //UPDATE STORE revenue // READ ONLY
    //                 stores[vendorAccount][storeIndex].revenue = SafeMath.add(stores[vendorAccount][storeIndex].revenue, totalItemsPrice);
    //                 //UPDATE RETRIEVABLE BALANCE
    //                 vendors[vendorAccount].balance = SafeMath.add(vendors[vendorAccount].balance, totalItemsPrice);
    //                 //
                    
    //                 //REDUCE PRODUCT quantity
    //                 stores[vendorAccount][storeIndex].products[productId].quantity = SafeMath
    //                 .sub(stores[vendorAccount][storeIndex].products[productId].quantity,
    //                     purchasedQuantity
    //                 );
                    
    //                  //remove item from slot
            

                   
            
    //           }
              
             
            
    //     }
        
    //     emit PaymentCompleted(true);
    //     delete shoppingCarts[msg.sender];
    //      return true;
    //    //stores
        
    // }
    
}