import { TOKEN_PRICE } from '../../../constants/constants';
//bytes32, bytes32, uint, uint, uint, string, address
export const transformProduct = ({productResult, web3}) => {
  console.log('productResult', productResult)
    return {
        name:  web3.toAscii(productResult[0]),
        description: web3.toAscii(productResult[1]),
        price: web3.fromWei(productResult[2].toNumber(), 'ether'),
        priceInSpinelToken: productResult[3].toNumber(),
        quantity: productResult[4].toNumber(),
        imageHash: productResult[5],
        vendor: productResult[6],
        productId: productResult[7].toNumber()
    }
}



export const etherToWei =({value, web3}) => {
    console.log('amount 1',value)
    return web3.toWei(value);
    //TOKEN_PRICE
}

export const etherToSpinel =({value, web3}) => {
     
    const ether = etherToWei({value, web3});
    const token = ether / TOKEN_PRICE;
    console.log('token 3',token)
    return token;
    //TOKEN_PRICE
}

