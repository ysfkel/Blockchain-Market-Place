pragma solidity 0.4.24;
import "./VendorBase.sol";
import "./Ownerble.sol";
/*
  DIRECTLY INVOKING THE TRANSFER FUNCTION ON AN ADDRESS IS A SECURITY RISK
  THE WITHDRAWAL PATTERN ALLOWS US TO KEEP TRACK OF ANY WITHDRAWALS THAT ARE 
  PENDING AND PROVIDES A SIMPLE WITHDRAWAL FUNCTION WHERE OTHERS CAN TAKE 
  OUT THERE ETHER FROM THE CONTRACT SO INSTEAD OF THE CONTRACT FUNCTIONS 
  DIRECTLY CALLING TRANSFER ON AN ADDRESSES AND POTENTIAL OPENING THEMSELVES 
  UP TO AN ATTACK, OUR CONTRACT JUST UPDATES THE STATE OF THE PENDING 
  WITHDRAWALS , THIS WOULD THEN ALLOW THE EXTERNAL ADDRESS TO CALL INTO 
  THE WITHDRAWAL FUNCTION TO COLLECT ITS ETHER.
  THE IDEA IS THAT THE ATTACK VECTOR IS ALLOWED TO ONLY THE WITHDRWAL function
  AND THE ATTACKER CANNOT COMPROMISE THE FUNCTIONALITY OF THE REST OF THE 
  CONTRACT
*/

/**@title Withdrawable allows vendors to withdraw funcds to their wallet */
contract Withdrawable is Ownerble, VendorBase {
    
    /**
            * @dev EMITS FUNDS WITHDRWAL SUCCESS
            * @param amount true if success
            */
    event WithdrawalCompletedSuccessfully(uint amount);

        /**
            * @dev WITHDRWAS VENDORS FUNDS
            * @return bool true if success
            */
    function withdraw() public returns (bool) {
        
        require(vendors[msg.sender].state == AccountState.Approved);
        if(vendors[msg.sender].balance > 0) {
            
            uint balance = vendors[msg.sender].balance;
            
            vendors[msg.sender].balance = 0;
            
            if(!msg.sender.send(balance)) {
                vendors[msg.sender].balance = balance;
                return false;
            }

            emit WithdrawalCompletedSuccessfully(balance);
        }
        
        return true;
        
    }



    
}