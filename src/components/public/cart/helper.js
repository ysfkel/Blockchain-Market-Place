
export const transformProduct = ({productResult, web3}) => {
    return {
        productId:  productResult[0].toNumber(),
        name: web3.toAscii(productResult[1]),
        price: web3.fromWei(productResult[2].toNumber(), 'ether'),
        priceInSpinelToken: productResult[3].toNumber(),
        quantity: productResult[4].toNumber(),
        storeIndex: productResult[5].toNumber(),
        vendorAccount: productResult[6]
    }
}
