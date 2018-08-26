pragma solidity 0.4.24;

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

    event  Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
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

    //Delegated Transfer
    
    function approve(address _spender, uint256 _value) public returns(bool success) {
         allowance[msg.sender][_spender] = _value;
         emit Approval(msg.sender, _spender, _value);
         success = true;
    }

    function approveAdmin(address _spender, uint256 _value) public returns(bool) {
          return approve(_spender, _value);
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns(bool success) {
         require(_value <= balanceOf[_from]);
         require(_value <= allowance[_from][msg.sender]);
        
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
         allowance[_from] [msg.sender]-= _value; 
         emit Transfer(_from, _to, _value);
         success = true;
    }

    function getOwner() public view returns(address) {
         return owner;
    }
}