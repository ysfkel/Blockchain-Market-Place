
import * as helper from './helper';

export const getOrdersCount =({ account, contract, web3}) => {

    return new Promise((resolve, reject) => {
     
          contract
          .getCustomerOrdersHistoryCount
          .call({from:account})
                .then((result)=>{
                   const count = result.toNumber();
                  resolve(count);
          })
    });
}

export const getOrderHistory =({account, contract, web3}) => {
 
    return new Promise((resolve, reject) => {
        getOrdersCount({account, contract, web3})
        .then((count) => {
          
             const indexes = [...Array(count).keys()];
             const promise  = indexes.map((index) => {
                   const orderId = ++index;
                   return contract.getOrderHistory.call(orderId, {from: account});
             });
             Promise.all(promise).then((result) => {
                          const ordersList = [];
                          const orders = result.map((orderResult, index) => {
                                const date = (new Date(orderResult[0].toNumber())).toDateString();
                                const __grandTotal = orderResult[1].toNumber();
                                const __paymentMethod = orderResult[2];
                                const grandTotal = helper.getPrice(__grandTotal, __paymentMethod);
                                const orderId = ++index;

                                 return {
                                    orderId,
                                    date,
                                    grandTotal,
                                    transactions: []
                                } 

                     

                          });

                   
                          orders.map((order, index) => {
                                 const { orderId } = order;

                                    contract.getOrderTransactionsCount.call(orderId, {
                                      from: account
                                    })
                                    .then(transactionCountResult => {
                                        const transactionCount = transactionCountResult.toNumber();
                                        const transactionIndexes = [...Array(transactionCount).keys()];
                                        
                                        const transactionPromise  = transactionIndexes.map((index) => {
                                    
                                           return contract.getOrderTransaction.call(orderId, index, {from: account})
                                       });

                                        Promise.all(transactionPromise).then((orderTransactionListResult) => {
                                               
                                                const transactions =orderTransactionListResult.map(orderTransactionResult => {
                                                    return helper.transformTransaction({
                                                        orderTransactionResult,
                                                        web3
                                                    });
                                                })
                                      

                                                order.transactions = transactions;
                                                 ordersList.push(order);
                                                if(index === orders.length -1){
                                                     resolve(ordersList);
                                                }
                                                
                                   
                                        })
                                })
                           // })
                        })
                      

 
                           
                          

                      
                       
                });
                
             })
        .catch(()=>{
                 console.log('error while fetching order history')
        })
    })
     
}
