contractAbi[
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": false,
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "SignedTransact",
        "type": "event"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "newAddress",
            "type": "address"
          }
        ],
        "name": "addAddress",
        "outputs": [
          {
            "internalType": "string",
            "name": "confirmation",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "internalType": "address",
            "name": "called",
            "type": "address"
          }
        ],
        "name": "checkList",
        "outputs": [
          {
            "internalType": "bool",
            "name": "checked",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "signTransaction",
        "outputs": [
          {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [],
        "name": "returnN",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "number",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      }
]