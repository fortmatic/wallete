pragma solidity ^0.5.16;

contract MultiSig {
    address payable public owner; // Will be the address of who deploys to contract

    mapping(address => bool) private whiteList; // whitelist of address that can sign transactions
    uint256 private numSigs; // Keeps track of num of signatures on transaction

    mapping(address => bool) private signedList; // list of address that have signed the transaction
    uint256 private numWhiteList; // Keep track of num of addresses on whitelist

    // Events to emmit
    event SignedTransact(address);
    event AddedWhiteList(address);
    event transactionOccured(address, uint256);

    constructor() public {
        // Make the owner who deploys contract
        owner = msg.sender;

        // Add to white list for owner to sign
        whiteList[owner] = true;
        numSigs = 0;
        numWhiteList = 0;
    }

    // Adds address to whitelist so entity has signing ability
    function addAddress(address newAddress) public returns (bool success) {
        // Requires to ensure owner adding signers
        require(msg.sender == owner, "Sender not authorized");
        require(
            whiteList[newAddress] == false,
            "Address is already on whitelist"
        );

        // Give address signing ability and emit event
        whiteList[newAddress] = true;
        emit AddedWhiteList(newAddress);
        ++numWhiteList;
        return true;
    }

    // Checks if address has signed transaction
    function checkList(address called) public returns (bool checked) {
        return signedList[called];
    }

    // Msg.sender signs transaction
    function signTransaction() public payable returns (bool success) {
        // Makes sure sender is on whitelist and has not signed yet
        require(
            whiteList[msg.sender] == true,
            "This address is not on the whitelist"
        );
        require(
            signedList[msg.sender] == false,
            "This address has already signed the transaction"
        );

        // Increment num of signatures on transact and approve on signedList
        ++numSigs;
        signedList[msg.sender] = true;
        emit SignedTransact(msg.sender);

        return true;
    }

    function contractBalance() public view returns(uint256 balance){
        return address(this).balance;
    }

    // Getter for number of entities signed
    function checkStatus() public returns (bool succes) {
        // if (2 * numSigs > numWhiteList) {
        //     return "Transaction occurs";
        // } else {
        //     return "Transaction not sent";
        // }
        uint256 transact = address(this).balance;

        owner.transfer(address(this).balance);

        emit transactionOccured(owner, transact);

        return true;
    }

}
