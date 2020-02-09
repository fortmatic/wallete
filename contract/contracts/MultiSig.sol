pragma solidity ^0.5.16;

contract MultiSig {
    address public owner;
    int private N;

    mapping(address => bool) private whiteList;
    event SignedTransact(address);

    function MultiSig() private {
        owner = msg.sender;
    }

    function addAddress(address newAddress) private returns (string confirmation) {
        require(msg.sender == owner, "Sender not authorized");
        whiteList[newAddress] = true;
        return "Address has been added to the whitelist";
    }

    function checkList(address called) public returns (bool checked) {
        return signedList[called];
    }

    function signTransaction () public return (bool success) {
        require(whiteList[msg.sender] == true, "This address is not on the whitelist");

        
    }

}
