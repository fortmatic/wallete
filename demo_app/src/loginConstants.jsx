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
                        <a className = "profileButton" onClick={this.openProfile} id="profBtn">Profile</a>
                    </div>
                    <p className ="connected" id="status"></p>
                </header>
            </div>
        );
    }

    openProfile = async () => {
        const element = (
            <div>
                <a className = "profileButton" onClick={this.closeProfile} id="profBtn">Profile</a>
                <p id="username"></p>
                <p id="userAddress"></p>
            </div>
        );

        await ReactDOM.render(element, document.getElementById('profile'));

        document.getElementById('username').innerHTML = (await fmPhantom.user.getMetadata()).email;
        document.getElementById('userAddress').innerHTML = (await fmPhantom.user.getMetadata()).publicAddress;
    }

    closeProfile = () => {
        const element = (
            <div>
                <a className = "profileButton" onClick={this.openProfile} id="profBtn">Profile</a>
            </div>
        );

        ReactDOM.render(element, document.getElementById('profile'));
    }
}

class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <a className = "sidebarBtn" onClick={this.getDeployPage}>Deploy</a>
                <a className = "sidebarBtn" onClick={this.getSignAndAdd}>Whitelist </a>
                <a className = "sidebarBtn" onClick={this.getSetupPage}>Start Transaction </a>
                <a className = "sidebarBtn" onClick={this.getVault}>Vault </a> 
            </div>
        );
    }

    getSetupPage() {
        ReactDOM.render(<authorizers.Setup />, document.getElementById('root'));
    }

    getDeployPage() {
        ReactDOM.render(<authorizers.Deploy />, document.getElementById('root'));
    }

    async getSignAndAdd() {
        await ReactDOM.render(<authorizers.SignAndAdd />, document.getElementById('root'));
        handle.getWhitelist();
    }

    getVault() {
        ReactDOM.render(<authorizers.Vault />, document.getElementById('root'));
        handle.getPending();

        window.setInterval(handle.getBalance(), 5000);
    }
}


class Login extends Component {
    render() {
        return (
            <div className="login">
                <h1>Fortmatic Whitelabel MultiSig</h1>
                <p id="status"></p>
                <input type="text" id="user-email" placeholder="Enter your email" />
                <a className = "log1" onClick={handle.handleLoginWithMagicLink}>Login via Magic Link</a>
                <a className = "log2" onClick={handle.handleLogout}>Logout</a>
                <a className = "log3" onClick={handle.handleIsLoggedIn}>Check Status</a>

                <div className="navigation">
                    <a className = "Lognext" onClick={this.getMainPage}>Next</a>
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