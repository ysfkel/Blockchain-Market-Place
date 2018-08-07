
export const transformProduct = ({productResult, web3}) => {
    return {
        name:  web3.toAscii(productResult[0]),
        description: web3.toAscii(productResult[1]),
        price: productResult[2].toNumber(),
        productId: productResult[3].toNumber(),
        storeIndex: productResult[4].toNumber(),
    }
}