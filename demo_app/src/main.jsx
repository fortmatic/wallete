// import React from 'react';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as handle from './phantom.js';
import './main.css';

class SignAndAdd extends Component {
    render() {
        return (
            <div className="main">
                <div>
                    <input type="text" id="address" placeholder="Enter Address" />
                    <button onClick={handle.addToWhiteList}>Add Address to the Whitelist</button>
                </div>

                <button onClick={handle.signContract}>Sign Contract</button>
                <div className="navigation">
                    <button onClick={getSetupPage}>Go to Setup</button>
                </div>
            </div>
        );
    }
}

class Login extends Component {
    render() {
        return (
            <div className="main">
                <input type="text" id="user-email" placeholder="Enter your email" />
                <button onClick={handle.handleLoginWithMagicLink}>Login via Magic Link</button>
                <button onClick={handle.handleLogout}>Logout</button>
                <div>
                    <button onClick={handle.handleGetMetadata}>Get Metadata</button>
                    <button onClick={handle.handleIsLoggedIn}>Check Login Status</button>
                </div>

                <div className="navigation">
                    <button onClick={getDeployPage}>Go to Deploy</button>
                </div>
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
                    <input type="text" id="contractAdd" placeholder="Enter existing contract address"/>
                    <button onClick={handle.contractConnect}>Connect to Contract</button>
                </div>
                <div className="navigation">
                    <button onClick={getLoginPage}>Go to Login</button>
                    <button onClick={getSetupPage}>Go to Setup</button>
                </div>
            </div>
        );
    }
}

class Top extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <script>
                        fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
                        web3 = new Web3(fmPhantom.getProvider());
                    </script>

                    <h1 id="main">Fortmatic Whitelabel SDK Sign-in</h1>
                    <p id="status"></p>
                </header>
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
                <input type="number" id="threshold" placeholder="Send threshold"/>
                <button onClick={handle.setupTransaction}>Start Transaction</button>

                <div>
                    <input type="text" id="txhash" placeholder="TxHash"/>
                    <button onClick={handle.setTxHash}>Connect to existing Transaction</button>
                </div>

                <div className="navigation">
                    <button onClick={getDeployPage}>Go to Deploy</button>
                    <button onClick={getSignAndadd}>Go to Sign</button>
                </div>
            </div>
        );
    }
}

let getLoginPage = () => {
    ReactDOM.render(<Login />, document.getElementById('root'));
}

let getDeployPage = () => {
    ReactDOM.render(<Deploy />, document.getElementById('root'));
}

let getSetupPage = () => {
    ReactDOM.render(<Setup />, document.getElementById('root'));
}

let getSignAndadd = () => {
    ReactDOM.render(<SignAndAdd />, document.getElementById('root'));
}

export {
    Top,
    Login
};