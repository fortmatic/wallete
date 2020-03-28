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
                <div className= "bigBlock">
                <div id="whitelist">
                    <h1 id="thing">Addresses on Whitelist</h1>
                    <ul id="list"></ul>
                </div>
                <div id="addAddress">
                    <input type="text" id="address" placeholder="Enter Address" />
                    <a className="otherBtn" onClick={handle.addToWhiteList}>Add Address to the Whitelist</a>
                </div>
                <br></br>
                </div>
            </div>
        );
    }
}

class Deploy extends Component {
    render() {
        return (
            <div className="main">
                <div className= "bigBlock">
                    <a className="otherBtn" onClick={handle.deploying}>Deploy Contract</a>
                    <div>
                        <input type="text" id="contractAdd" placeholder="Enter existing contract address" />
                        <a className="otherBtn" onClick={handle.contractConnect}>Connect to Contract</a>
                    </div>
                </div>
            </div>
        );
    }
}

class Setup extends Component {
    render() {
        return (
            <div className="main">
                <div className = "bigBlock">
                <input type="text" id="sendAddress" placeholder="Send to Address" />
                <input type="number" id="exchangeAmt" placeholder="Transaction amount" />
                {/* <input type="number" id="threshold" placeholder="Send threshold" /> */}
                <a className="otherBtn" onClick={handle.setupTransaction}>Start Transaction</a>
                </div>
            </div>
        );
    }
}

class Vault extends Component {
    render() {
        return (
            <div className="main">
                <div className = "bigBlock">
                <div id="pending">
                    <h1>Pending Transactions</h1>
                    <ol id="pendingList"></ol>
                    {/* <select name="transaction" id="pendTxns"></select> */}
                    {/* <a className="cmpBtn" onClick={this.getCompTx} >Get CompositionTx</a> */}
                </div>

                <div id="balDiv">
                    <h1>Balance</h1>
                    <p id="balance"></p>
                    {/* <a className="refreshBtn" onClick={handle.getBalance}>Refresh</a> */}
                </div>

                <a className="otherBtn" onClick={this.signPendingTx}>Sign Transaction</a>
                <div id="compositionTx"></div>
                </div>
            </div>
        );
    }

    // async getCompTx() {
    //     var div = document.getElementById('compositionTx');
    //     while (div.firstChild) {
    //         div.removeChild(div.firstChild);
    //     }

    //     var sel = document.getElementById('pendTxns');
    //     handle.getComp(sel.value);
    // }

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
