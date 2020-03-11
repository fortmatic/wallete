pragma solidity ^0.5.16;

contract MultiSig {
    address public owner; // Will be the address of who deploys to contract
    uint256 public nonce;

    struct transactionData {
        address payable from;
        address payable to;
        uint256 amount;
        uint256 nonceTrans;
        uint256 threshold;
    }

    address[] public whitelistAdd; // list of addresses added to whitelist
    uint256 public numWhitlist;

    transactionData[] public transactions;
    transactionData[] public pendingTransactions;
    uint256 public numPendingTx;

    mapping(bytes32 => mapping(address => bool)) public signedList; // list of address that have signed the transaction
    mapping(bytes32 => uint256) numSigs;

    // Events to emmit
    event transactionCreated(address, address, uint256, uint256);
    event SignedTransact(address);
    event AddedWhiteList(address);
    event transactionOccured(address, uint256);
    event emitHash(bytes32);

    constructor() public {
        // Make the owner who deploys contract
        owner = msg.sender;
        // Add to white list for owner to sign
        numWhitlist = 0;
        numPendingTx = 0;
        nonce = 0;
        addAddress(msg.sender); // add owner's address as address 0 of whitelist addresses
    }

    function findAddress(address find) internal returns (bool success) {
        for (uint256 index = 0; index < whitelistAdd.length; index++) {
            if (whitelistAdd[index] == find) {
                return true;
            }
        }

        return false;
    }

    // Adds address to whitelist so entity has signing ability
    function addAddress(address newAddress) public returns (bool success) {
        // Requires to ensure owner adding signers
        require(msg.sender == owner, "Sender not authorized");
        require(!findAddress(newAddress), "Already added");

        // Give address signing ability and emit event
        whitelistAdd.push(newAddress); // add the new address to list of whitelist addresses
        numWhitlist++;
        emit AddedWhiteList(newAddress);
        return true;
    }

    function setupTransaction(
        address payable _paymentReciever,
        uint256 _threshold,
        uint256 _amount
    ) external payable returns (uint256) {
        require(msg.value == _amount, "Not enough eth to send transaction");

        transactionData memory tmp = transactionData(
            msg.sender,
            _paymentReciever,
            _amount,
            nonce,
            _threshold
        );

        transactions.push(tmp);
        pendingTransactions.push(tmp);
        numPendingTx++;

        emit transactionCreated(
            msg.sender,
            _paymentReciever,
            nonce,
            _threshold
        );

        bytes32 txHash = encodeTransaction(nonce);

        numSigs[txHash] = 0;
        signTransaction(nonce);

        nonce++;
        emit emitHash(txHash);

        return nonce - 1;
    }

    function encodeTransaction(uint256 index) internal returns (bytes32) {
        bytes32 tmp = keccak256(
            abi.encode(
                transactions[index].to,
                transactions[index].from,
                transactions[index].amount,
                transactions[index].nonceTrans,
                transactions[index].threshold
            )
        );

        return tmp;
    }

    // Msg.sender signs transaction
    function signTransaction(uint256 index) public returns (bool success) {
        bytes32 txHash = encodeTransaction(index);
        // Makes sure sender is on whitelist and has not signed yet
        require(
            findAddress(msg.sender),
            "This address is not on the whitelist"
        );
        require(
            signedList[txHash][msg.sender] == false,
            "This address has already signed the transaction"
        );

        // Increment num of signatures on transact and approve on signedList
        signedList[txHash][msg.sender] = true;
        numSigs[txHash] += 1;
        emit SignedTransact(msg.sender);

        return checkStatus(index);
    }

    function handlePayment(uint256 index) private returns (bool) {
        address payable reciever = transactions[index].to;
        reciever.transfer(transactions[index].amount);

        emit transactionOccured(
            transactions[index].to,
            transactions[index].amount
        );

        for (uint256 i = index; i < pendingTransactions.length - 1; i++) {
            pendingTransactions[i] = pendingTransactions[i + 1];
        }

        delete pendingTransactions[pendingTransactions.length - 1];
        pendingTransactions.length--;
        numPendingTx--;

        return true;
    }

    function contractBalance() public view returns (uint256 balance) {
        return address(this).balance;
    }

    // Getter for number of entities signed
    function checkStatus(uint256 index) public payable returns (bool success) {
        bytes32 txHash = encodeTransaction(index);
        if (numSigs[txHash] >= transactions[index].threshold) {
            return handlePayment(index);
        }

        return false;
    }

}
