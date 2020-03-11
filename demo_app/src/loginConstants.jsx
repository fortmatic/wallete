import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as handle from './phantom.js';
import './main.css';

import Fortmatic from 'fortmatic';
import * as authorizers from './authorizers.jsx';

const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');

class Top extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 id="main">Whitelabel MultiSig</h1>
                    <div id="profile">
                        <button onClick={this.openProfile} id="profBtn">Profile</button>
                    </div>
                    <p id="status"></p>
                </header>
            </div>
        );
    }

    openProfile = async () => {
        const element = (
            <div>
                <button onClick={this.closeProfile} id="profBtn">Profile</button>
                <p id="username"></p>
                <p id="address"></p>
            </div>
        );

        await ReactDOM.render(element, document.getElementById('profile'));

        document.getElementById('username').innerHTML = (await fmPhantom.user.getMetadata()).email;
        document.getElementById('address').innerHTML = (await fmPhantom.user.getMetadata()).publicAddress;
    }

    closeProfile = () => {
        const element = (
            <div>
                <button onClick={this.openProfile} id="profBtn">Profile</button>
            </div>
        );

        ReactDOM.render(element, document.getElementById('profile'));
    }
}

class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <button onClick={this.getDeployPage}>Deploy</button>
                <button onClick={this.getSignAndAdd}>Whitelist</button>
                <button onClick={this.getSetupPage}>Start Transaction</button>
                <button onClick={this.getVault}>Vault</button>
            </div>
        );
    }

    getSetupPage() {
        ReactDOM.render(<authorizers.Setup />, document.getElementById('root'));
    }

    getDeployPage() {
        ReactDOM.render(<authorizers.Deploy />, document.getElementById('root'));
    }

    getSignAndAdd() {
        ReactDOM.render(<authorizers.SignAndAdd />, document.getElementById('root'));
        handle.getWhitelist();
    }

    getVault() {
        ReactDOM.render(<authorizers.Vault />, document.getElementById('root'));
    }
}


class Login extends Component {
    render() {
        return (
            <div className="login">
                <p id="status"></p>
                <input type="text" id="user-email" placeholder="Enter your email" />
                <button onClick={handle.handleLoginWithMagicLink}>Login via Magic Link</button>
                <button onClick={handle.handleLogout}>Logout</button>
                <button onClick={handle.handleIsLoggedIn}>Check Status</button>

                <div className="navigation">
                    <button onClick={this.getMainPage}>Next</button>
                </div>
            </div>
        );
    }

    async getMainPage() {
        if (document.getElementById('status').innerHTML !== 'Logged out') {
            ReactDOM.render(<Top />, document.getElementById('constant'));
            ReactDOM.render(<Sidebar />, document.getElementById('sidebar'));
            ReactDOM.render(<authorizers.Deploy />, document.getElementById('root'));
        }
    }
}

export default Login;