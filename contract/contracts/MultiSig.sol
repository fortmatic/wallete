pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;

contract MultiSig {
    // Basic Contract data for ownership and nonce
    address public owner;
    uint256 public nonce;

    // WhiteList info
    address[] public whitelistAdd;
    mapping(address => bool) public whitelist;

    // Structs for transactions
    struct transactionData {
        address payable from;
        address payable to;
        uint256 amount;
        uint256 nonceTrans;
        uint256 threshold;
    }

    struct pendingData {
        transactionData txnData;
        uint256 numSigs;
        bytes32 txHash;
    }
    mapping(bytes32 => mapping(address => bool)) signedList;

    // Arrays for transactions
    transactionData[] public transactions;
    pendingData[] public pendingTransactions;

    // Events to emmit
    event transactionCreated(address, address, uint256, uint256);
    event SignedTransact(address);
    event AddedWhiteList(address);
    event transactionOccured(address, uint256);

    constructor() public {
        // Make the owner address that deploys contract
        owner = msg.sender;
        nonce = 0;

        // Add to white list for owner to sign
        addAddress(msg.sender);
    }

    function getWhitelistAdd()
        public
        view
        returns (address[] memory whitelistArr)
    {
        return whitelistAdd;
    }

    function getPendingTx() public view returns (pendingData[] memory pending) {
        return pendingTransactions;
    }

    function contractBalance() public view returns (uint256 balance) {
        return address(this).balance;
    }

    // Adds address to whitelist so entity has signing ability
    function addAddress(address newAddress) public returns (bool success) {
        // Requires to ensure owner adding signers
        require(msg.sender == owner, "Sender not authorized");
        require(whitelist[newAddress] == false, "Already added");

        // Give address signing ability and emit event
        whitelistAdd.push(newAddress); // add the new address to list of whitelist addresses
        whitelist[newAddress] = true;

        emit AddedWhiteList(newAddress);
        return true;
    }

    function setupTransaction(
        address payable _paymentReciever,
        uint256 _threshold,
        uint256 _amount
    ) external payable returns (uint256) {
        require(msg.value == _amount, "Not enough eth to send transaction");
        require(
            whitelist[msg.sender] == true,
            "This address is not an the whitelist"
        );

        transactionData memory tmp = transactionData(
            msg.sender,
            _paymentReciever,
            _amount,
            nonce,
            _threshold
        );
        transactions.push(tmp);

        bytes32 txHash = encodeTransaction(nonce, transactions);
        pendingData memory pendingtmp = pendingData(tmp, 0, txHash);
        pendingTransactions.push(pendingtmp);

        emit transactionCreated(
            msg.sender,
            _paymentReciever,
            nonce,
            _threshold
        );
        signTransaction(nonce);

        nonce++;
        return nonce - 1;
    }

    function encodeTransaction(uint256 index, transactionData[] memory txns)
        internal
        pure
        returns (bytes32)
    {
        bytes32 tmp = keccak256(
            abi.encode(
                txns[index].to,
                txns[index].from,
                txns[index].amount,
                txns[index].nonceTrans,
                txns[index].threshold
            )
        );

        return tmp;
    }

    // Msg.sender signs transaction
    function signTransaction(uint256 index) public returns (bool success) {
        // Makes sure sender is on whitelist and has not signed yet
        require(
            whitelist[msg.sender] == true,
            "This address is not on the whitelist"
        );
        require(
            signedList[pendingTransactions[index].txHash][msg.sender] == false,
            "This address has already signed the transaction"
        );

        // Increment num of signatures on transact and approve on signedList
        signedList[pendingTransactions[index].txHash][msg.sender] = true;
        pendingTransactions[index].numSigs += 1;
        emit SignedTransact(msg.sender);

        return checkStatus(index);
    }

    function handlePayment(uint256 index) private returns (bool) {
        address payable reciever = pendingTransactions[index].txnData.to;
        reciever.transfer(pendingTransactions[index].txnData.amount);

        emit transactionOccured(
            pendingTransactions[index].txnData.to,
            pendingTransactions[index].txnData.amount
        );

        for (uint256 i = index; i < pendingTransactions.length - 1; i++) {
            pendingTransactions[i] = pendingTransactions[i + 1];
        }

        delete pendingTransactions[pendingTransactions.length - 1];
        pendingTransactions.length--;

        return true;
    }

    function checkStatus(uint256 index) public payable returns (bool success) {
        if (
            pendingTransactions[index].numSigs >=
            pendingTransactions[index].txnData.threshold
        ) {
            return handlePayment(index);
        }

        return false;
    }

}
