

export const transformProduct = ({productResult, web3}) => {
    console.log('--productResult', productResult)
    return {
        name:  web3.toAscii(productResult[0]),
        description: web3.toAscii(productResult[1]),
        price: web3.fromWei(productResult[2].toNumber(), 'ether'),
        priceInSpinelToken: productResult[3].toNumber(),
        //quantity: productResult[4].toNumber(),
        imageHash: productResult[4],
        vendor: productResult[5],
       productId: productResult[6].toNumber()
    }
}