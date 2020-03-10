pragma solidity ^0.5.16;

contract MultiSig {
    address payable public owner; // Will be the address of who deploys to contract


    struct transactionData {
        address payable from;
        address payable to;
        uint256 amount;
        uint256 nonceTrans;
        uint256 threshold;
    }

    mapping(uint256 => transactionData) private transactions;

    mapping(bytes32 => mapping(address => bool)) public whiteList; // whitelist of address that can sign transactions
    uint256 private numWhiteList; // Keep track of num of addresses on whitelist

    mapping(bytes32 => mapping(address => bool)) public signedList; // list of address that have signed the transaction
    uint256 private numSigs; // Keeps track of num of signatures on transaction

    // Events to emmit
    event transactionCreated(address, address, uint256, uint256);

    event SignedTransact(address);
    event AddedWhiteList(address);
    event transactionOccured(address, uint256);
    event emitHash(bytes32);

    uint256 public nonce = 0;
    uint256 public threshold;
    // Mapping to keep track of all message hashes that have been approve by ALL REQUIRED owners
    mapping(bytes32 => uint256) public signedMessages;
    mapping(bytes32 => uint256) public dataViaTxHash;

    constructor() public {
        // Make the owner who deploys contract
        owner = msg.sender;

        // Add to white list for owner to sign
        numSigs = 0;
        numWhiteList = 1;
    }

    // Adds address to whitelist so entity has signing ability
    function addAddress(address newAddress, bytes32 txHash) public returns (bool success) {
        // Requires to ensure owner adding signers
        require(msg.sender == owner, "Sender not authorized");
        require(
            whiteList[txHash][newAddress] == false,
            "Address is already on whitelist"
        );

        // Give address signing ability and emit event
        whiteList[txHash][newAddress] = true;
        emit AddedWhiteList(newAddress);
        ++numWhiteList;
        return true;
    }

    function setupTransaction(
        address payable _paymentReciever,
        uint256 _threshold,
        uint256 _amount
    ) external payable returns (bytes32) {
        require(msg.value == _amount, "Not enough eth to send transaction");

        transactions[nonce] = transactionData(
            msg.sender,
            _paymentReciever,
            _amount,
            nonce,
            _threshold
        );

        emit transactionCreated(
            msg.sender,
            _paymentReciever,
            nonce,
            _threshold
        );

        bytes32 txHash = keccak256(
            abi.encode(
                transactions[nonce].to,
                transactions[nonce].from,
                transactions[nonce].amount,
                transactions[nonce].nonceTrans,
                transactions[nonce].threshold
            )
        );

        signedMessages[txHash] = 0;
        dataViaTxHash[txHash] = nonce;
        addAddress(msg.sender, txHash);
        signTransaction(txHash);

        nonce++;
        emit emitHash(txHash);

        return txHash;
    }

    // Msg.sender signs transaction
    function signTransaction(bytes32 txHash) public returns (bool success) {
        // Makes sure sender is on whitelist and has not signed yet
        require(
            whiteList[txHash][msg.sender] == true,
            "This address is not on the whitelist"
        );
        require(
            signedList[txHash][msg.sender] == false,
            "This address has already signed the transaction"
        );

        // Increment num of signatures on transact and approve on signedList
        ++numSigs;
        signedList[txHash][msg.sender] = true;
        signedMessages[txHash] += 1;
        emit SignedTransact(msg.sender);

        return checkStatus(txHash);
    }

    function handlePayment(bytes32 txHash) private returns (bool) {
        address payable reciever = transactions[dataViaTxHash[txHash]].to;
        reciever.transfer(transactions[dataViaTxHash[txHash]].amount);

        emit transactionOccured(
            transactions[dataViaTxHash[txHash]].to,
            transactions[dataViaTxHash[txHash]].amount
        );
        return true;
    }

    function contractBalance() public view returns (uint256 balance) {
        return address(this).balance;
    }

    // Getter for number of entities signed
    function checkStatus(bytes32 txHash) public payable returns (bool success) {
        if (
            signedMessages[txHash] >=
            transactions[dataViaTxHash[txHash]].threshold
        ) {
            return handlePayment(txHash);
        }

        return false;
    }

}
