pragma solidity ^0.5.16;
pragma experimental ABIEncoderV2;


contract MultiSig {
    // Basic Contract data for ownership and nonce
    address public owner;
    uint256 public nonce;

    struct whitelistData {
        address whiteAdd;
        string email;
    }

    // WhiteList info
    whitelistData[] public whitelistAdd;
    mapping(address => bool) whitelist;

    // Structs for transactions
    struct transactionData {
        address payable from;
        address payable to;
        uint256 amount;
        uint256 nonceTrans;
        uint256 threshold;
        uint256 numSigs;
        string txHash;
        bool complete;
    }
    mapping(uint256 => mapping(address => bool)) signedList;

    // Arrays for transactions
    transactionData[] public transactions;

    // Events to emmit
    event transactionCreated(address, address, uint256, uint256);
    event SignedTransact(address);
    event AddedWhiteList(address);
    event transactionOccured(address, uint256);

    constructor(string memory name) public {
        // Make the owner address that deploys contract
        owner = msg.sender;
        nonce = 0;

        // Add to white list for owner to sign
        addAddress(msg.sender, name);
    }

    function getTransactions()
        public
        view
        returns (transactionData[] memory transArr)
    {
        return transactions;
    }

    function getWhitelistAdd()
        public
        view
        returns (whitelistData[] memory whitelistArr)
    {
        return whitelistAdd;
    }

    function contractBalance() external view returns (uint256 balance) {
        return address(this).balance;
    }

    function setHash(string memory txHash_in) public returns (bool success) {
        transactions[transactions.length - 1].txHash = txHash_in;
        return true;
    }

    // Adds address to whitelist so entity has signing ability
    function addAddress(address newAddress, string memory name)
        public
        returns (bool success)
    {
        // Requires to ensure owner adding signers
        require(
            whitelist[msg.sender] == true || owner == msg.sender,
            "Sender not authorized"
        );
        require(whitelist[newAddress] == false, "Already added");

        // Give address signing ability and emit event
        whitelistAdd.push(whitelistData(newAddress, name)); // add the new address to list of whitelist addresses
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

        transactions.push(
            transactionData(
                msg.sender,
                _paymentReciever,
                _amount,
                nonce,
                _threshold,
                0,
                "",
                false
            )
        );

        emit transactionCreated(
            msg.sender,
            _paymentReciever,
            nonce,
            _threshold
        );
        signTransaction(transactions.length - 1);

        nonce++;
        return nonce - 1;
    }

    // Msg.sender signs transaction
    function signTransaction(uint256 index) public returns (bool success) {
        // Makes sure sender is on whitelist and has not signed yet
        require(
            transactions[index].complete == false,
            "Transaction has already been sent"
        );
        require(index < transactions.length, "Index is out of bounds");
        require(
            whitelist[msg.sender] == true,
            "This address is not on the whitelist"
        );
        require(
            signedList[transactions[index].nonceTrans][msg.sender] == false,
            "This address has already signed the transaction"
        );

        // Increment num of signatures on transact and approve on signedList
        signedList[transactions[index].nonceTrans][msg.sender] = true;
        transactions[index].numSigs += 1;
        emit SignedTransact(msg.sender);

        return checkStatus(index);
    }

    function handlePayment(uint256 index) private returns (bool) {
        require(
            transactions[index].complete == false,
            "Transaction has already been sent"
        );
        require(index < transactions.length, "Index is out of bounds");
        address payable reciever = transactions[index].to;
        reciever.transfer(transactions[index].amount);

        emit transactionOccured(
            transactions[index].to,
            transactions[index].amount
        );
        transactions[index].complete = true;

        return true;
    }

    function checkStatus(uint256 index) public payable returns (bool success) {
        require(index < transactions.length, "Index is out of bounds");
        if (transactions[index].numSigs >= transactions[index].threshold) {
            return handlePayment(index);
        }

        return false;
    }
}
