
import { TOKEN_PRICE } from '../../../constants/constants';


export const tokenToEther = ({tokenAmount, web3}) => {

        const priceInWei = (TOKEN_PRICE * tokenAmount);
        return web3.fromWei(priceInWei, 'ether');

}

export const tokenToWei = ({tokenAmount, web3}) => {

    return (TOKEN_PRICE * tokenAmount);
 

}