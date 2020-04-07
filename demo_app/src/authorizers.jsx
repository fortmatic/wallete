import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as handle from './phantom.js';
import './main.css';

import Fortmatic from 'fortmatic';
const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');

class Deploy extends Component {
    render() {
        return (
            <div className="main">
                <div className="bigBlock">
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
                <div className="bigBlock">
                    <div id="pending">
                        <h1 className="head_boxPD">Pending Transactions</h1>
                        {/* <ol id="pendingList"></ol> */}
                        {/* <select name="transaction" id="pendTxns"></select> */}
                        {/* <a className="cmpBtn" onClick={this.getCompTx} >Get CompositionTx</a> */}
                        <table>
                            <thead>
                                <tr>
                                    <th >Tx Hash</th>
                                    <th >To</th>
                                    <th >Amount</th>
                                </tr>
                            </thead>
                            <tbody id="list">
                            </tbody>
                        </table>
                        <div className="compBox" id="compositionTx"></div>
                    </div>
                    <h1 className="head_boxST">New Transaction</h1>
                    
                    <div>
                        <input type="text" id="sendAddress" placeholder="Send to Address" />
                        <input type="number" id="exchangeAmt" placeholder="Transaction amount" />
                        {/* <input type="number" id="threshold" placeholder="Send threshold" /> */}
                        <a className="stTran" onClick={handle.setupTransaction}>Start Transaction</a>
                    </div>

                    {/* <div id="balDiv">
                        <h1>Balance</h1>
                        <p id="balance"></p>
                        <a className="refreshBtn" onClick={handle.getBalance}>Refresh</a>
                    </div> */}

                    {/* <a className="signTran" onClick={this.signPendingTx}>Sign Transaction</a> */}
                </div>
            </div>
        );
    }
}

class Vault extends Component {
    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <div id="pending">
                        <h1 className="head_boxPD">Pending Transactions</h1>
                        {/* <ol id="pendingList"></ol> */}
                        {/* <select name="transaction" id="pendTxns"></select> */}
                        {/* <a className="cmpBtn" onClick={this.getCompTx} >Get CompositionTx</a> */}
                        <table>
                            <thead>
                                <tr>
                                    <th >Tx Hash</th>
                                    <th >To</th>
                                    <th >Amount</th>
                                </tr>
                            </thead>
                            <tbody id="list">

                            </tbody>
                        </table>
                    </div>

                    {/* <div id="balDiv">
                        <h1>Balance</h1>
                        <p id="balance"></p>
                        <a className="refreshBtn" onClick={handle.getBalance}>Refresh</a>
                    </div> */}

                    <a className="signTran" onClick={this.signPendingTx}>Sign Transaction</a>
                    <div className="compBox" id="compositionTx"></div>
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

    // async signPendingTx() {
    //     var sel = document.getElementById('pendTxns');
    //     handle.signContract(sel.value);
    // }
}

export {
    Setup,
    Deploy,
    Vault
};
