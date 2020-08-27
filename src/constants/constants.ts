import { Magic } from 'magic-sdk';
import { OAuthExtension } from '@magic-ext/oauth';
import Web3 from 'web3';
import abi from './abi';

export const magic = new Magic("pk_test_77A011678F246927", {
    extensions: [new OAuthExtension()],
    network: "rinkeby"
});
const contractAddress = '0xd959d927De283A43d36386a43367E2ca57D05104';

export const web3 = new Web3(magic.rpcProvider);
export var contract = new web3.eth.Contract(abi); // need abi of smart contract
contract.options.address = contractAddress;