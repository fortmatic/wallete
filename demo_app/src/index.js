import React from 'react';
import ReactDOM from 'react-dom';

import * as abi from './abi.js'
import Web3 from 'web3';

import './index.css';
import * as serviceWorker from './serviceWorker';
import { Login, makeMainPage } from './loginConstants';

import Fortmatic from 'fortmatic';

export const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
export const web3 = new Web3(fmPhantom.getProvider());

export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0x737b4D07e54f19810E5b6214A377dD233eCc3E49';

let prep = async () => {
    if (await fmPhantom.user.isLoggedIn())
        makeMainPage();
    else
        ReactDOM.render(<Login />, document.getElementById('root'));
}

prep();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
