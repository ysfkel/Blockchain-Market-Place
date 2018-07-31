
import Web3 from 'web3';
import MarketPlace from '../../build/contracts/MarketPlace.json';

export const getWeb3Contract = () =>{
   
   return new Promise((res, rej)=>{
       let _web3, web3Provider,contract;
        if(typeof web3 != 'undefined') {
            web3Provider = web3.currentProvider;
        } else {
            web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
        }

        _web3 = new Web3(web3Provider);

        contract= TruffleContract(MarketPlace);
        contract.setProvider(web3Provider);
        res(
            {
                contract,
                web3: _web3
            }
        );
   })
   
   
}