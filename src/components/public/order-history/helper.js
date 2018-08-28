

export const PaymentMethod ={
   Ether:0,
   Token: 1
}

export const getPaymentType = (type) => {
   return type === PaymentMethod.Ether ? 'Ether' : 'Token';
}

export const getPrice = (price, paymentMethod) => {

    if(paymentMethod === PaymentMethod.Ether) {
         return web3.fromWei(price, 'ether');
    } else {
        return price;
    }

}
export const transformTransaction = ({orderTransactionResult, web3}) => {
  
    return {
        productName:  web3.toAscii(orderTransactionResult[0]),
        quantity: orderTransactionResult[1].toNumber(),
        price: getPrice(orderTransactionResult[2].toNumber(), orderTransactionResult[5].toNumber() ),
        vendor: orderTransactionResult[3],
        storeName: web3.toAscii(orderTransactionResult[4]),
        paymentMethod:  getPaymentType(orderTransactionResult[5].toNumber() )
    }
}