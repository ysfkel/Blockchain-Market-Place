pragma solidity ^0.4.2;
import './SpinelToken.sol';
import "./SafeMath.sol";

contract SpinelTokenSale {
    address admin;
    SpinelToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint256 _numberOfTokens);


    constructor(SpinelToken _tokenContract, 
    uint256 _tokenPrice) public {

       admin = msg.sender;
       tokenContract = _tokenContract;
       tokenPrice = _tokenPrice;
    }

    function buyTokens(uint _numberOfTokens) public payable {
        /** msg.value (in wei), must be sufficient to pay for the amunt of tokens being requested */
        require(msg.value == (_numberOfTokens * tokenPrice));
          /** tokens available for purchase must be greater or equal to the number of tokens to be purchased */
        require(tokenContract.balanceOf(this) >= _numberOfTokens);
        /** transfer inside of a require so that a revert happens if not successful */
        require(tokenContract.transfer(msg.sender, _numberOfTokens));
         tokensSold += _numberOfTokens;
         emit Sell(msg.sender, _numberOfTokens);
    }

    function endSale() public {
       //require admin
        require(msg.sender == admin);
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)));
        //  selfdestruct(admin);
    }


  
}