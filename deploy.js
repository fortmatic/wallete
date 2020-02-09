import Fortmatic from 'fortmatic';
import { AbiCoder } from 'web3-eth-abi'; // what is this? 
const fmPhantom = new Fortmatic.Phantom('pk_test_3F4C85DABD924AA7');
var web3 = new Web3(fmPhantom.getProvider());
var abi = '0x0000000000000000000000000000000000000000';
var byteCode = '0x0000000000000000000000000000000000000000';
var publicAdd = fmPhantom.user.getMetadata().publicAddress;


let deploying = (byteCode, publicAdd) => {
    contract.deploy({
    })
        .send({
            data: byteCode,
            from: publicAdd,
            gas: '1000000',
            gasPrice: '1500'
        })
        .then (console.log);
};


var contract = new web3.eth.Contract(abi); // need abi of smart contract 
var deployContract = contract.new(contract.deploy);