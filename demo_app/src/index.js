// General React Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.css';
import * as serviceWorker from './serviceWorker';

// Contract related Libraries
import * as abi from './abi.js';
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

// React Components
import { Login, Top } from './loginConstants';
import Sidebar from "./sidebar.jsx";
import Assets from "./assets.jsx";

export const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
export const web3 = new Web3(fmPhantom.getProvider());


export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0x86907340099D5D94A1D5C85683ED3C1c4416F961';

let prep = async () => {
    if (await fmPhantom.user.isLoggedIn())
        makeMainPage();
    else
        ReactDOM.render(<Login />, document.getElementById('root'));
}

export let makeMainPage = async () => {
    ReactDOM.render(<Top />, document.getElementById('constant'));
    ReactDOM.render(<Sidebar />, document.getElementById('sidebar'));
    ReactDOM.render(<Assets />, document.getElementById('root'));
}


prep();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
