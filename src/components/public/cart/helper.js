
export const transformProduct = ({productResult, web3}) => {
    return {
        productId:  productResult[0].toNumber(),
        name: web3.toAscii(productResult[1]),
        description: web3.toAscii(productResult[2]),
        price: productResult[3].toNumber(),
        quantity: productResult[4].toNumber(),
        storeIndex: productResult[5].toNumber(),
        vendorAccount: productResult[6]//.toNumber(),
    }
}

//web3.toAscii(productResult[0])