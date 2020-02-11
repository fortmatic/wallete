const byteCode = '0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060018060008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055506000600281905550600060048190555061088b806100e86000396000f3fe6080604052600436106100555760003560e01c80630dc29f7f1461005a57806338eada1c146100c35780633b7104f21461012c57806367b142fc1461015b5780638b7afe2e1461017d5780638da5cb5b146101a8575b600080fd5b34801561006657600080fd5b506100a96004803603602081101561007d57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506101ff565b604051808215151515815260200191505060405180910390f35b3480156100cf57600080fd5b50610112600480360360208110156100e657600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610255565b604051808215151515815260200191505060405180910390f35b34801561013857600080fd5b506101416104b2565b604051808215151515815260200191505060405180910390f35b6101636105b0565b604051808215151515815260200191505060405180910390f35b34801561018957600080fd5b506101926107d6565b6040518082815260200191505060405180910390f35b3480156101b457600080fd5b506101bd6107de565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b6000600360008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff169050919050565b60008060009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610319576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260158152602001807f53656e646572206e6f7420617574686f72697a6564000000000000000000000081525060200191505060405180910390fd5b60001515600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff161515146103df576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252601f8152602001807f4164647265737320697320616c7265616479206f6e2077686974656c6973740081525060200191505060405180910390fd5b60018060008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055507f64fd21439447139bed5a374a0f62ecc0fbd38cf2687d4ed5d587cb55dfbd425882604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16004600081546001019190508190555060019050919050565b6000804790506000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc479081150290604051600060405180830381858888f1935050505015801561051f573d6000803e3d6000fd5b507f2f03f1395f971b1f02ef2bc5afe3dcaadb5138627f8f45633cefd28f1a5f7e456000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1682604051808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020018281526020019250505060405180910390a15090565b600060011515600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff1615151461065b576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260248152602001806108336024913960400191505060405180910390fd5b60001515600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060009054906101000a900460ff16151514610704576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252602f815260200180610804602f913960400191505060405180910390fd5b600260008154600101919050819055506001600360003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060006101000a81548160ff0219169083151502179055507f827bfe95984eb396b6d8ff47200bd671835f5a6d87dc4bad10d2dbd4fe6355a333604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390a16001905090565b600047905090565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff168156fe5468697320616464726573732068617320616c7265616479207369676e656420746865207472616e73616374696f6e546869732061646472657373206973206e6f74206f6e207468652077686974656c697374a265627a7a723158200ad7d2d189dcd1e79fd617da8f592e1a1a42dc4f5c2791a918ff7af2292e6ca464736f6c63430005100032';

const contractAbi = [
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
    "name": "AddedWhiteList",
    "type": "event"
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "transactionOccured",
    "type": "event"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address payable",
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
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "contractBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "checkStatus",
    "outputs": [
      {
        "internalType": "bool",
        "name": "succes",
        "type": "bool"
      }
    ],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];