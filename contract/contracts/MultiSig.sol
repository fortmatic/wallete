pragma solidity ^0.5.16;

contract MultiSig {
    address public owner;
    uint private N; // number of signatures

    mapping(address => bool) private whiteList; // whitelist of address that can sign transactions
    mapping(address => bool) private signedList; // list of address that have signed the transaction
    event SignedTransact(address);
    event AddedWhiteList(address);

    constructor() public {
        owner = msg.sender;
        N = 0;
    }

    function addAddress(address newAddress) public returns (string memory confirmation) {
        require(msg.sender == owner, "Sender not authorized");
        require(whiteList[newAddress] == false, "Address is already on whitelist");
        whiteList[newAddress] = true;
        emit AddedWhiteList(newAddress);
        return "Address has been added to the whitelist";
    }

    function checkList(address called) public returns (bool checked) {
        return whiteList[called];
    }

    function signTransaction() public returns (bool success) {
        require(whiteList[msg.sender] == true, "This address is not on the whitelist");
        require(signedList[msg.sender] == false, "This address has already signed the transaction");
        ++N;
        signedList[msg.sender] = true;
        emit SignedTransact(msg.sender);
        return true;
    }

    function returnN() public returns (uint number) {
        return N;
    }

}
