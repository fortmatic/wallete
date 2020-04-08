import * as abi from './abi.js'
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
const web3 = new Web3(fmPhantom.getProvider());
export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0x737b4D07e54f19810E5b6214A377dD233eCc3E49';


let deploying = async() => {
    const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;

    contract.deploy({ data: abi.byteCode })
        .send({
            from: userAddress,
            gas: 4000000,
            gasPrice: '3000000000000'
        })
        .on('receipt', (rec) => {
            contract.options.address = rec.contractAddress;
            console.log(rec);
            document.getElementById('status').innerHTML = 'Contract deployed at ' + contract.options.address;
        });
};

let setupTransaction = async() => {
    const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;
    const amount = document.getElementById('exchangeAmt').value;
    const sendAddress = document.getElementById('sendAddress').value;
    //const threshold = document.getElementById('threshold').value;
    const threshold = 3;

    var txnHash;

    await contract.methods.setupTransaction(sendAddress, threshold, amount).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '3000000000000',
            value: amount
        })
        .on('receipt', (rec) => {
            console.log(rec);
            txnHash = rec.transactionHash;
            document.getElementById('status').innerHTML = "Transaction started";
        });

    await contract.methods.setHash(txnHash).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '3000000000000'
        })
        .then(console.log);
}

let checkStatus = async() => {
    const userAddress = (await fmPhantom.user.getMetadata()).publicAddress;
    var index;

    await contract.methods.checkStatus(index).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '3000000000000'
        })
        .then(console.log);
};

let contractConnect = () => {
    contract.options.address = document.getElementById('contractAdd').value;
    document.getElementById('status').innerHTML = 'Contract connected at ' + contract.options.address;
}

export {
    checkStatus,
    deploying,
    setupTransaction,
    contractConnect
};