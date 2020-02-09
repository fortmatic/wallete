pragma solidity ^0.5.16;

contract MultiSig {
    address public owner;

    mapping(address => bool) private signedList;
    event SignedTransact(address);

    constructor() public {
        owner = msg.sender;
    }

    function checkList(address called) public returns (bool checked) {
        return signedList[called];
    }

    function signTransaction () public return (bool success) {
        require(signedList[msg.sender] == false);
        
    }
}
