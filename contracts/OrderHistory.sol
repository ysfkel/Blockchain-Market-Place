pragma solidity 0.4.24;
import "./StoreBase.sol";

contract OrderHistory is StoreBase{
    
 
    constructor() public {
         
    }
    
    /**
      THIS FUNCTION CREATES A ORDER HISTORY
      THIS IS CALLED WHEN A USER / CUSTOMER COMPLETES 
      A SHOPPING CART PAYMENT.
      THE ORDER HISTORY CAN BE VIEWED BY EVERY CUSTOMER
     */
    function createOrderHistory(uint256 orderId, uint grandTotal, 
        uint256 paymentMethod) public returns(bool) {
         orderHistory[msg.sender][orderId].timeStamp = now;
         orderHistory[msg.sender][orderId].grandTotal = grandTotal;
         orderHistory[msg.sender][orderId].grandTotal = paymentMethod;
         return true;
    }
    
    /**
       RETURNS THE ORDER HISTORY BY ORDER ID
     */
    function getOrderHistory(uint orderId) public view returns(uint256, uint256){
         return (
               orderHistory[msg.sender][orderId].timeStamp,
               orderHistory[msg.sender][orderId].grandTotal
             );   
    }
    
    /**
       THIS FUNCTION IS USED TO GENERATE ORDER HISTORY ID
     */
    function incrementCustomerOrdersHistory() public  returns(uint256){
         
        customerOrdersCount[msg.sender]= ++customerOrdersCount[msg.sender];
         return  customerOrdersCount[msg.sender];
    }
    
    /**
       RETURNS ORDER HISTORY COUNT FOR A PARTICULAR ADDRESS
     */
     function getCustomerOrdersHistoryCount() public view returns(uint256){
         
         return  customerOrdersCount[msg.sender];
    }

    /**
       THIS FUNCTION ADDS A TRANSACTION TO AN ORDER HISTORY
       AN ORDER IS MADE OF SEVERAL TRANSACTIONS 
       EACH TRANSACTION IS A PURCHASED PRODUCT
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
       RETURNS A ORDER TRANSACTION
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
     RETURNS THE NUMBER OF TRANSACTIONS / PRODUCTS IN AN ORDER
    */
     function getOrderTransactionsCount(uint256 orderId) public view returns(uint256) {
        return orderHistory[msg.sender][orderId].transactions.length;
    }
  
  
    
}