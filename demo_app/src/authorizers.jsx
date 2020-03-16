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
                    <ol id="pendingList"></ol>
                    <select name="transaction" id="pendTxns"></select>
                    <button onClick={this.getCompTx} >Get CompositionTx</button>
                </div>

                <div id="balDiv">
                    <h1>Balance</h1>
                    <p id="balance"></p>
                    <button onClick={handle.getBalance}>Refresh</button>
                </div>

                <button onClick={this.signPendingTx}>Sign Contract</button>
                <div id="compositionTx"></div>
            </div>
        );
    }

    async getCompTx() {
        var div = document.getElementById('compositionTx');
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }

        var sel = document.getElementById('pendTxns');
        handle.getComp(sel.value);
    }

    async signPendingTx() {
        var sel = document.getElementById('pendTxns');
        handle.signContract(sel.value);
    }
}

export {
    SignAndAdd,
    Setup,
    Deploy,
    Vault
};