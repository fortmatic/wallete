import React, { Component } from 'react';
import * as handle from './phantom.js';
import './main.css';

class Main extends Component {
    render() {
        return (
            <div>
                <h1 id="main">Fortmatic Whitelabel SDK Sign-in</h1>
                <p id="status"></p>
                <div>
                    <input type="text" id="user-email" placeholder="Enter your email" />
                    <button onClick={handle.handleLoginWithMagicLink}>Login via Magic Link</button>
                    <button onClick={handle.handleLogout}>Logout</button>
                </div>

                <div>
                    <button onClick={handle.handleGetMetadata}>Get Metadata</button>
                    <button onClick={handle.handleIsLoggedIn}>Check Login Status</button>
                </div>

                <button onClick={handle.deploying}>Deploy Contract</button>

                <div>
                    <input type="number" id="exchangeAmt" placeholder="Transaction amount" />
                    <button onClick={handle.setupTransaction}>Start Transaction</button>
                </div>

                <div>
                    <input type="text" id="address" placeholder="Enter Address" />
                    <button onClick={handle.addToWhiteList}>Add Address to the Whitelist</button>
                </div>

                <button onClick={handle.signContract}>Sign Contract</button>
                <button onClick={handle.checkStatus}>Check Contract Status</button>

            </div>
        );
    }
}

export default Main;