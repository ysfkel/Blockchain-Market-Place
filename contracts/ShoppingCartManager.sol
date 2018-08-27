pragma solidity 0.4.24;
import './UserManager.sol';
import "./Ownerble.sol";
import "./StoreBase.sol";
import './SafeMath.sol';
import "./VendorBase.sol";
import "./SpinelTokenSale.sol";
import "./SpinelToken.sol";
import "./OrderHistory.sol";

 /** @title shopping cart manager */
contract ShoppingCartManager is Ownerble, StoreBase,
 VendorBase, OrderHistory{
    
    SpinelToken internal tokenContract_shoppingCart;
   
    /**
      * @dev EMITS CART ITEM INSERTED EVENT
      * @param cartSize shopping cart size
      */
    event ItemInsertedToCart(uint cartSize);
    /**
      * @dev EMITS CART ITEM UPDATED EVENT
      * @param productQuantity shopping cart product quanity
      */
    event CartItemUpdated(uint productQuantity);
    /**
      * @dev EMITS CART ITEM DELETED EVENT
      * @param cartSize size of shopping cart
      */
    event CartItemDeleted(uint cartSize);
    /**
      * @dev EMITS CART PAYMENT COMPLETED EVENT
      * @param status true if success
      */
    event PaymentCompleted(bool status);
    /**
      * @dev EMITS CART PRICE IN TOKEN EVENT
      * @param amount total cart price
      */
    event PaymentByTokenCompleted(uint256 amount);
    /**
      * @dev EMITS CART IN ETHER EVENT
      * @param amount total cart price
      */
    event PaymentByEtherCompleted(uint256 amount);

       /**
      * @dev RETURNS THE DETAILS OF SHOPPING CART ITEM
      * @param productId array index of product
      * @return name name of product  
      * @return description description of product  
      * @return price price of product in ether 
      * @return princeInSpinelToken product price in tokens
      * @return productQuantityToPurchase quantity of product 
      * @return storeIndex array index of store 
      * @return vendorAccount vendors address 
      */
    function getCartItem(uint productId) public view returns(uint, bytes32, uint, uint, uint, uint, address){
        //get store index
        uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
        //GET PURCHASED QUANTITY
        uint productQuantityToPurchase = shoppingCarts[msg.sender].products[productId].productQuantity;
        //GET THE VENDORS ACCOUNT ADDRESS
        address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
        // GET THE PRICE OF THE PRODUCT IN TOKENS
        uint priceInSpinelToken = stores[vendorAccount][storeIndex].products[productId].priceInSpinelToken;
      
        return (
            productId,
            stores[vendorAccount][storeIndex].products[productId].name,
            stores[vendorAccount][storeIndex].products[productId].price,
            priceInSpinelToken,
            productQuantityToPurchase,
            storeIndex,
            vendorAccount
        );
    }
    
       /**
      * @dev CALCULATES THE TOTAL PRICE OF SHOPPING CART 
      * @param paymentMethod payment method - ETher or Token
      * @return cartPrice total cart price 
      */
    function getCartPrice(uint256 paymentMethod) public view returns(uint256){
        require(PaymentMethod(paymentMethod) == PaymentMethod.Token ||
         PaymentMethod(paymentMethod) == PaymentMethod.Ether);
        uint256 cartPrice = 0;
      
        /**
            LOOPS THROUGH EACH ITEM IN THE SHOPPPING CART 
         */
        for(uint i; i < shoppingCarts[msg.sender].productIds.length; i++) {
           /**
             CHECK IF THE PRODUCT PURCHASE WAS COMPLETED
            */
           if(shoppingCarts[msg.sender].products[productId].purchaseComplete == false) {

            //GET THE PRODUCT ID
             uint productId = shoppingCarts[msg.sender].productIds[i];
             ShoppingCartItem memory item = shoppingCarts[msg.sender].products[productId];
             uint productPrice;
             //CHECK THE PAYMENT METHOD - ETHER OR TOKEN
             if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
                   // IF TOKEN , GET THE TOKEN PRICE OF THE ITEM
                   productPrice = stores[item.vendorAccount][item.storeIndex].products[productId].priceInSpinelToken;
             } else {
                   // IF ETHER , GET THE ETHER PRICE OF THE ITEM
                 productPrice = stores[item.vendorAccount][item.storeIndex].products[productId].price;
             }

            // GET THE PURCHASED QUANTITY
             uint productQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
              //CALCULATE THE PRICE AND ADD TO THE CART PRICE
             cartPrice = SafeMath.add(cartPrice, SafeMath.mul(productPrice, productQuantity));
           }
        }
        
        //RETURN TOTAL CART PRICE
        return cartPrice;
    }

    //RETURNS THE COUNT OF ITEMS IN THE SHOPPING CART
    function getCartItemsCount() public view returns(uint){
        return shoppingCarts[msg.sender].productIds.length;
    }
    
    // RETURNS THE IDS OF ITEMS IN THE SHOPPING CART
    function getCartItemsIds() public view returns(uint[]){
        return shoppingCarts[msg.sender].productIds;
    }

    //ADDS ITEM TO SHOPPING CART
    function addItemToCart(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) public returns(bool){
        
   
        //check if quantity in the store is equql or greater than purchased quantity
        require(stores[vendorAccount][storeIndex].products[productId].quantity >= productQuantity);
        require(stores[vendorAccount][storeIndex].products[productId].productId >0);

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

          //EMITS ITEM INSERTED EVENT
          emit ItemInsertedToCart( shoppingCarts[msg.sender].productIds.length);

        return  true;

    }
    
    /**
      UPDATES CART ITEM QUANTITY
     */
    function updateCartItem(address vendorAccount, uint storeIndex, uint productId, uint productQuantity) public returns(bool){
        //check if quantity in the store is equql or greater than purchased quantity
        require(stores[vendorAccount][storeIndex].products[productId].quantity >= productQuantity);

        require(stores[vendorAccount][storeIndex].products[productId].productId > 0 );

         //UPDATE QUANTITY
         shoppingCarts[msg.sender].products[productId].productQuantity = productQuantity;
         //emit cart updated event
        emit CartItemUpdated(shoppingCarts[msg.sender].products[productId].productQuantity);

         return true;
         
    }
    
   
    /**
      DELETES CART ITEM
     */
    function deleteCartItem(uint productId ) public returns(bool) {
        //get product id index
        uint productCartIndex = shoppingCarts[msg.sender].cartItemSlot[productId].slot;
          //remove the deleted product id by exchanging position with last item
          shoppingCarts[msg.sender].productIds[productCartIndex] = shoppingCarts[msg.sender].productIds[shoppingCarts[msg.sender].productIds.length - 1];
          //DECREASE THE INDEX OF SHOPPING CART PRODUCTS IDS LIST
          shoppingCarts[msg.sender].productIds.length --;
     
        //DELETE THE ID OF THE REMOVED ITEM FROM THE SHOPPING PRODUCT IDS ARRAY
        delete shoppingCarts[msg.sender].products[productId];
        //DELETE THE PRODUCT FROM SHOPPING CART
        delete shoppingCarts[msg.sender].cartItemSlot[productId];

        //EMIT PRODUCT DELETED EVENT
        emit CartItemDeleted(shoppingCarts[msg.sender].productIds.length);
        
        return true;
    }
    
    /**
      SUBTRACTS THE PRICE OF AN ITEM THAT IS REMOVED FROM THE SHOPPING CART 
      FROM TOTAL SHOPPING CART PRICE 
     */
    function deductDeletedCartItemPriceFromCartPrice(uint productPrice, uint purchasedQuantity, uint256 currentCartPrice) private pure returns(uint){
            
            return SafeMath.sub(currentCartPrice, (SafeMath.mul(productPrice, purchasedQuantity )));
    }

    /**
       CHECKS IF THE CUSTOMERS BALANCE (ETHER OR TOKEN ) IS SUFFICIENT TO PAY FOR THE TOTAL CART PRICE
     */
    function isCustomerBalanceSufficient(uint256 paymentMethod, uint customerBalanceInWei) public view returns(bool) {
        
        if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
            //RETURNS TRUE IF THE CUSTOMER IS PAYING BY TOKEN AND CUSTOMER 
            //HAS SUFFICIENT TOKEN BALANCE TO PAY FOR SHOPPING CART PRICE
            return tokenContract_shoppingCart.balanceOf(msg.sender) >= 
            getCartPrice(paymentMethod);
        } else {
            //RETURNS TRUE IF THE CUSTOMER IS PAYING BY ETHER AND CUSTOMER 
            //HAS SUFFICIENT ETHER BALANCE TO PAY FOR SHOPPING CART PRICE
            return customerBalanceInWei >= getCartPrice(paymentMethod);
        }
    }

    /**
      RETURNS THE PRICE (IN ETHER OR TOKEN ) 
      OF AN ITEM IN THE SHOPPING CART ACCORDING TO THE PAYMENT METHOD
      
     */
    function getItemsPrice(uint256 paymentMethod,  address vendorAccount, uint256 storeIndex, uint productId) public view returns(uint256) {
         
        if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
            //IF CUSTOMERS PAYMENT METHOD IS TOKEN
            //RETURN THE PRICE OF THE ITEM IN TOKENS
               return stores[vendorAccount][storeIndex].products[productId].priceInSpinelToken;
        } else {
            //IF CUSTOMERS PAYMENT METHOD IS ETHER
            //RETURN THE PRICE OF THE ITEM IN ETHER
            return stores[vendorAccount][storeIndex].products[productId].price;
        }
    }

  
    /**
      CALCULATES THE TOTAL PRICE OF A SHOPPING CART ITEM
     */
    function getTotalItemsPrice(uint256 productPrice, uint256 purchasedQuantity) public pure returns(uint256) {

        uint256 totalItemsPrice = SafeMath.mul(productPrice, purchasedQuantity);

        return totalItemsPrice;
    }

   /**
     RETURNS THE BALANCE OF THE CUSTOMER (ETHER OR TOKEN) ACCORDING 
     TO THE CUSTOMERS CHOSEN PAYMENT METHOD
    */
    function getcustomerBalance(uint256 paymentMethod, uint256 customerBalance) public view returns(uint256){
         if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
               //RETURN CUSTOMERS TOKEN BALANCE IF CUSTOMER IS PAYING IN TOKENS
               return tokenContract_shoppingCart.balanceOf(msg.sender);
        } else {
               //RETURN CUSTOMERS ETHER  BALANCE IF CUSTOMER IS PAYING IN ETHER
            return customerBalance;
        }
    }

    /**
      COMPLETES PURCHASE BY MAKING PAYMENT TO VENDOR OF ITEM
      PURCHASED BY CUSTOMER
     */
    function payVendor(uint256 paymentMethod, address customerAccount, address vendorAccount, uint256 storeIndex,
     uint256 totalItemsPrice )
      public  returns(bool) {
        //IF CUSTOMER IS MAKING PAYMENT BY TOKEN
        //TRANSFER THE TOKEN FROM THE CUSTOMERS BALANCE TO THE VENDOR
        if(PaymentMethod(paymentMethod) == PaymentMethod.Token) {
             tokenContract_shoppingCart.transferFrom(customerAccount, vendorAccount, totalItemsPrice);
             emit PaymentByTokenCompleted(totalItemsPrice);
        } else {
         //IF CUSTOMER IS MAKING PAYMENT BY ETHER
         //TRANSFER THE ETHER TO THE CUSTMERS BALANCE
         //THE VENDOR WILL WITHDRAW THE ETHER TO HIS / HER WALLET BY USING THE WIDTHRAWAL CONTRACT
         //FROM HIS / HER DASHBOARD USER INTERFACE

          //SAVE THE REVENUE TO INFORM VENDOR HOW MUCH THE STORE HAS SOLD
          stores[vendorAccount][storeIndex].revenue = SafeMath.add(stores[vendorAccount][storeIndex].revenue, totalItemsPrice);
          //UPDATE RETRIEVABLE BALANCE
          vendors[vendorAccount].balance = SafeMath.add(vendors[vendorAccount].balance, totalItemsPrice);
          emit PaymentByEtherCompleted(totalItemsPrice);
        }                
    }

             /**
               ADDS THE ORDER ITEM TO THE ORDER HISTORY
               VIEWABLE BY THE CUSTOMER FROM HIS / HER DASHBOARD INTERFACE
              */
            function _createOrderHistory(
            address vendorAccount,
            uint256 productId,
            uint price,
            uint256 storeIndex, 
            uint256 quantity,
            uint256 paymentMethod

            ) private returns(bool) {
                //GET THE COUNT OF THE ITEMS IN THE CUSTOMERS ORDER HISTORY
                uint256 currentOrderHistoryCount = getCustomerOrdersHistoryCount();
                //DETERMINE THE ID OF CURRENT ORDER ITEM
                uint256 orderId = ++currentOrderHistoryCount;
                //TOTAL  PRICE OF ITEM
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

  /**
    WHEN TRIGGERED, MAKES PAYMENT FOR ALL 
    ITEMS IN THE CUSTOMERS SHOPPING CART
   */
  function checkOutTokenPayment(uint256 paymentMethod) public payable returns(bool){
        require(shoppingCarts[msg.sender].productIds.length > 0);
        //REVERT IF THE CUSTOMER DOES NOT HAVE SUFFICIEN BALANCE TO COVER THE CART PRICE
        require(isCustomerBalanceSufficient(paymentMethod, msg.value));

        //GET CUSTOMER PAYMENT BY HIS PAYMENT METHOD
        // IF CUSTOMER IS MAKING PAYMENT BY TOKEN, RETURNS HIS TOKEN BALANCE
        // IF CUSTOMER IS MAKING PAYMENT BY ETHER, THE VALUE SENT WITH THE TRANSACTION 
        // IS RETURNED
        uint customerBalance = getcustomerBalance(paymentMethod, msg.value);
        // LOOP THROUGH EACH ITEM IN THE SHOPPING CART
        for(uint i = 0; i< shoppingCarts[msg.sender].productIds.length; i++) {
            // GET THE ITEM ID
           uint productId = shoppingCarts[msg.sender].productIds[0];
            if(shoppingCarts[msg.sender].products[productId].purchaseComplete ==false) {
                   // GET THE PURCHASED QUANTITY
                    uint purchasedQuantity = shoppingCarts[msg.sender].products[productId].productQuantity;
                    // GET THE STORE IN WHICH THE ITEM BELONGS
                    uint storeIndex = shoppingCarts[msg.sender].products[productId].storeIndex;
                    // GET THE VENDOR ADDRESS OF THE STORE
                    address vendorAccount = shoppingCarts[msg.sender].products[productId].vendorAccount;
                    //check if product exists
                    require(stores[vendorAccount][storeIndex].products[productId].productId > 0);
                    //check the quantity available equal to or greater than purchased quantity
                    require(stores[vendorAccount][storeIndex].products[productId].quantity >= purchasedQuantity);
                    //require the vendorAccount is a vendor
                    require(vendors[vendorAccount].state == AccountState.Approved);
                     // GET THE PRODUCT PRICE
                    uint productPrice = getItemsPrice(paymentMethod, vendorAccount, storeIndex, productId);
                    // CALCULATE THE TOTAL PRICE
                    uint totalItemsPrice = getTotalItemsPrice(productPrice, purchasedQuantity);
                
                    // REVERT IF THE PRICE OF THE ITEM IS GREATER THE THE CUSTOMERS 
                    // REMANING BALANCE
                    require(customerBalance >= totalItemsPrice);
                    
                    // CALCULATE THE CUSTOMERS REMAINING BALNEC
                     customerBalance = SafeMath.sub(customerBalance, totalItemsPrice);
                     // UPDATE PURCAHSE COMPLETE
                     shoppingCarts[msg.sender].products[productId].purchaseComplete = true;
                     // PAY VENDOR
                     payVendor(paymentMethod, msg.sender,vendorAccount, storeIndex, totalItemsPrice);
                     //subtract purchaed quantity
                      stores[vendorAccount][storeIndex].products[productId].quantity = SafeMath.sub(stores[vendorAccount][storeIndex].products[productId].quantity,
                      purchasedQuantity );

                       // ADD ITEM TO ORDER HISTORY
                     _createOrderHistory(vendorAccount,productId, productPrice,storeIndex,
                      purchasedQuantity, paymentMethod);


                    
              }
        }
        // INCREMENT THE ORDER HISTORY
        incrementCustomerOrdersHistory();
        // CREATE THE ORDRE HISTORY
        createOrderHistory(getCustomerOrdersHistoryCount(),getCartPrice(paymentMethod), paymentMethod);
        emit PaymentCompleted(true);
        //DELETE SHOPPING CART
        delete shoppingCarts[msg.sender].products[productId];
        delete shoppingCarts[msg.sender];
         return true;
    }

    
}