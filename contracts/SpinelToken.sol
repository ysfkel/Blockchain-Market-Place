pragma solidity 0.4.24;

/**@title SpinelToken - ERC20 TOKEN  */
contract SpinelToken {
    //NAME
    string public name = "SPINEL Token";
    //SYMBOL
    string public symbol = 'SL';
    //total supply is from ERC20 
    uint256 public totalSupply ;
       //standard - not part of ERC20 standard
    string public standard = 'SPINEL Token v1.0';

    address owner;
    
    /**
      * @dev emits transfer event
      * @param _from address to transfer from
      * @param _to address to transfer to
      * @param _value value to be transfered
      * @return bool 
      */
    event  Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

     /**
      * @dev emits Approval event
      * @param _owner contract owners address
      * @param _spender account to be approved as spender 
      * @param _value that spender is allowed to spend 
      */
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

     /**
      * @dev emits TokenBalance event
      * @param _balance emits token balance
      */
    event TokenBalance(
        uint256 indexed _balance
    );

    mapping(address => uint256) public balanceOf;
    //account A , approves account C, to spend x tokens
    mapping(address => mapping(address => uint256)) public allowance;

    constructor(uint256 _initialSupply) public {
         owner = msg.sender;
         balanceOf[msg.sender] = _initialSupply;
                  //allocate the initial supply
         totalSupply = _initialSupply;
    }

    /**
      * @dev transfers tokens to specified address
      * @param _to address to transfer to
      * @param _value to be transfered 
      * @return success true if succeeds
      */
    function transfer(address _to, uint256 _value) public returns (bool success) {
       //TRANSFER
       require(balanceOf[msg.sender] >= _value);
       balanceOf[msg.sender] -= _value;
       balanceOf[_to] += _value; 
       emit Transfer(msg.sender, _to, _value);

        success = true;
       //EXCEPTION IF ACCOUNT DOES NOT HAVE ENOUGH
       //TRANSFER EVENT
    } 

    /**
      * @dev approves an account to spend tokens on behalf of another account
      * @param _spender address to approve 
      * @param _value total value to allow spender to spend
      * @return success true if succeeds
      */
    function approve(address _spender, uint256 _value) public returns(bool success) {
         allowance[msg.sender][_spender] = _value;
         emit Approval(msg.sender, _spender, _value);
         success = true;
    }

     /**
      * @dev clears revokes the previledge a spender has to spend behalf of another account
      * @param _spender address to revoke priviledge from 
      * @return success true if succeeds
      */
     function clearApproval(address _spender) public returns(bool success) {
         delete allowance[msg.sender][_spender];
         success = true;
    }

     /**
      * @dev approves an account to spend tokens on behalf of another account
      * @param _spender address to approve 
      * @param _value total value to allow spender to spend
      * @return success true if succeeds
      */
    function approveAdmin(address _spender, uint256 _value) public returns(bool) {
          return approve(_spender, _value);
    }

     /**
      * @dev used by an approved account to transfer tokens from one account to another
      * @param _from address to transfer from
      * @param _to address to transfer to
      * @param _value total value to allow spender to spend
      * @return success true if succeeds
      */
    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
         require(_value <= balanceOf[_from]);
         require(_value <= allowance[_from][msg.sender]);
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
         allowance[_from] [msg.sender]-= _value; 
         emit Transfer(_from, _to, _value);
         emit TokenBalance(balanceOf[_from]);
         success = true;
    }

     /**
      * @dev returns contract owner
      * @return owner contract owner address
      */
    function getOwner() public view returns(address) {
         return owner;
    }
}