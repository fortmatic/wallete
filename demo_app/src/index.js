// General React Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.css';
import * as serviceWorker from './serviceWorker';

// Contract related Libraries
import * as abi from './constants/abi.js';
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

// React Components
import { Login, Top } from './login/loginConstants';
import Sidebar from "./components/sidebar/sidebar.jsx";
import Assets from "./assets/assets.jsx";

// import blockies from 'ethereum-blockies';

export const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
export const web3 = new Web3(fmPhantom.getProvider());


export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0xf703EE3A38fE097545C6b6b555faf6216584bf91';

let prep = async () => {
    if (await fmPhantom.user.isLoggedIn())
        makeMainPage();
    else
        makeLoginPage();
}

export let makeMainPage = () => {
    ReactDOM.render(<Top />, document.getElementById('constant'));
    ReactDOM.render(<Sidebar />, document.getElementById('sidebar'));
    ReactDOM.render(<Assets />, document.getElementById('root'));
}

export let makeLoginPage = () => {
    ReactDOM.render(<Login />, document.getElementById('root'));
    ReactDOM.render(<div></div>, document.getElementById('constant'));
    ReactDOM.render(<div></div>, document.getElementById('sidebar'));
}

prep();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
