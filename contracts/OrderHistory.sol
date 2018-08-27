pragma solidity 0.4.24;
import "./StoreBase.sol";

contract OrderHistory is StoreBase{
    
 
    constructor() public {
         
    }
    
      /**
      * @dev CREATES ORDER HISTORY
      * @param orderId Id of order
      * @param grandTotal total order price
      * @param paymentMethod payment method used by customer
      * @return bool 
      */
    function createOrderHistory(uint256 orderId, uint grandTotal, 
        uint256 paymentMethod) public returns(bool) {
         orderHistory[msg.sender][orderId].timeStamp = now;
         orderHistory[msg.sender][orderId].grandTotal = grandTotal;
         orderHistory[msg.sender][orderId].grandTotal = paymentMethod;
         return true;
    }
    
       /**
      * @dev RETURNS THE ORDER HISTORY BY ORDER ID
      * @param orderId Id of order
      * @return timeStamp order timestamp
      * @return grandTotal order grand total price
      */
    function getOrderHistory(uint orderId) public view returns(uint256, uint256){
         return (
               orderHistory[msg.sender][orderId].timeStamp,
               orderHistory[msg.sender][orderId].grandTotal
             );   
    }
    
      /**
      * @dev GENERATES ORDER HISTORY ID
      * @return uint256 next item id
      */
    function incrementCustomerOrdersHistory() public  returns(uint256){
         
        customerOrdersCount[msg.sender]= ++customerOrdersCount[msg.sender];
         return  customerOrdersCount[msg.sender];
    }

    /**
      * @dev RETURNS ORDER HISTORY COUNT FOR A PARTICULAR ADDRESS
      * @return uint256 count of order history
      */
     function getCustomerOrdersHistoryCount() public view returns(uint256){
         
         return  customerOrdersCount[msg.sender];
    }

       /**
      * @dev ADDS A TRANSACTION TO AN ORDER HISTORY
      * @param orderId Id of order
      * @param productId Id of product
      * @param price price of product
      * @param quantity quantity of product
      * @param totalItemsPrice total Price of product
      * @param vendorAccount vendor acoount
      * @param storeIndex index of store in array
      * @param paymentMethod payment method
      * @return bool 
      */
    function addTransaction(
      uint orderId,
      uint256 productId,
      uint price,
      uint quantity,
      uint256 totalItemsPrice,
      address vendorAccount, 
      uint256 storeIndex,
      uint256 paymentMethod
      ) public returns(bool) {
       
     
        orderHistory[msg.sender][orderId].transactions.push(TransactionHistory(
            productId,
            stores[vendorAccount][storeIndex].products[productId].name,
            quantity,
            price,
            totalItemsPrice,
            vendorAccount,
            stores[vendorAccount][storeIndex].name,
            paymentMethod
            ));
        
 
        return true;
    }
    
     /**
      * @dev  RETURNS A ORDER TRANSACTION
      * @param orderId Id of order
      * @param transactionIndex index of the transaction
      * @return productName name of product
      * @return quantity of product
      * @return price of product
      * @return vendor owner of store
      * @return storeName name of store
      * @return paymentMethod payment method 
      */
    function getOrderTransaction(uint256 orderId, uint transactionIndex) public view returns( bytes32, uint256, uint256, address, bytes32, uint256) {
        
        return(
             orderHistory[msg.sender][orderId].transactions[transactionIndex].productName,
             orderHistory[msg.sender][orderId].transactions[transactionIndex].quantity,
             orderHistory[msg.sender][orderId].transactions[transactionIndex].price,
             orderHistory[msg.sender][orderId].transactions[transactionIndex].vendor,
             orderHistory[msg.sender][orderId].transactions[transactionIndex].storeName,
             orderHistory[msg.sender][orderId].transactions[transactionIndex].paymentMethod
        );
    }
      /**
      * @dev  RETURNS THE NUMBER OF TRANSACTIONS / PRODUCTS IN AN ORDER
      * @return uint256 count of order history   
      */
     function getOrderTransactionsCount(uint256 orderId) public view returns(uint256) {
        return orderHistory[msg.sender][orderId].transactions.length;
    }
  
  
    
}