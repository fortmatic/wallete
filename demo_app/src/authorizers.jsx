import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as handle from './phantom.js';
import './main.css';

import Fortmatic from 'fortmatic';
const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');

class SignAndAdd extends Component {
    render() {
        return (
            <div className="main">
                <div id="whitelist">
                    <h1>Addresses on Whitelist</h1>
                    <ul id="list">
                    </ul>
                </div>
                <div id="addAddress">
                    <input type="text" id="address" placeholder="Enter Address" />
                    <button onClick={handle.addToWhiteList}>Add Address to the Whitelist</button>
                </div>
                <br></br>

                <button onClick={handle.signContract}>Sign Contract</button>
            </div>
        );
    }
}

class Deploy extends Component {
    render() {
        return (
            <div className="main">
                <button onClick={handle.deploying}>Deploy Contract</button>
                <div>
                    <input type="text" id="contractAdd" placeholder="Enter existing contract address" />
                    <button onClick={handle.contractConnect}>Connect to Contract</button>
                </div>
            </div>
        );
    }
}

class Setup extends Component {
    render() {
        return (
            <div className="main">
                <input type="text" id="sendAddress" placeholder="Send to Address" />
                <input type="number" id="exchangeAmt" placeholder="Transaction amount" />
                <input type="number" id="threshold" placeholder="Send threshold" />
                <button onClick={handle.setupTransaction}>Start Transaction</button>

                <div>
                    <input type="text" id="txhash" placeholder="TxHash" />
                    <button onClick={handle.setTxHash}>Connect to existing Transaction</button>
                </div>
            </div>
        );
    }
}

class Vault extends Component {
    render() {
        return (
            <div className="main">
                <div id="pending">
                    <h1>Pending Transactions</h1>
                    <ul id="pendingList"></ul>
                    <select name="transaction" id="pendTxns"></select>
                </div>

                <div id="balDiv">
                    <h1>Balance</h1>
                    <p id="balance"></p>
                    <button onClick={handle.getBalance}>Refresh</button>
                </div>

                <div id="compositionTx"></div>
            </div>
        );
    }
}

export {
    SignAndAdd,
    Setup,
    Deploy,
    Vault
};