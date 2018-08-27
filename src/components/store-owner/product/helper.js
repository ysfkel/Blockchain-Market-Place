import { TOKEN_PRICE } from '../../../constants/constants';

export const transformProduct = ({productResult, web3}) => {
 
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
  
    return web3.toWei(value);
    //TOKEN_PRICE
}

export const etherToSpinel =({value, web3}) => {
     
    const ether = etherToWei({value, web3});
    const token = ether / TOKEN_PRICE;

    return token;
    //TOKEN_PRICE
}

