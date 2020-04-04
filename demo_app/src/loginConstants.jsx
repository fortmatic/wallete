// General React Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Function libraries
import * as index from "./index.js";
import * as handle from './phantom.js';

// React components
import * as authorizers from './authorizers.jsx';
import Assets from './assets.jsx';


export class Top extends Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 id="main"> <div className = "logo_box">WHITELABEL MULTISIG</div></h1>
                    <div id="profile">
                        <a className="profileButton" onClick={this.openProfile} id="profBtn">Profile</a>
                    </div>
                    <p className="connected" id="status"></p>
                </header>
            </div>
        );
    }

    logout = async () => {
        await index.fmPhantom.user.logout()
            .then((rec) => {
                ReactDOM.render(<Login />, document.getElementById('root'));
                ReactDOM.render(<div></div>, document.getElementById('sidebar'));
                ReactDOM.render(<div></div>, document.getElementById('constant'));
            });
    }

    openProfile = async () => {
        const element = (
            <div>
                <a className="profileButton" onClick={this.closeProfile} id="profBtn">Profile</a>
                <a className="logoutBtn" onClick={this.logout}>Logout</a>
                <p id="username"></p>
                <p id="userAddress"></p>
            </div>
        );

        ReactDOM.render(element, document.getElementById('profile'));

        document.getElementById('username').innerHTML = (await index.fmPhantom.user.getMetadata()).email;
        document.getElementById('userAddress').innerHTML = (await index.fmPhantom.user.getMetadata()).publicAddress;
    }

    closeProfile = () => {
        const element = (
            <div>
                <a className="profileButton" onClick={this.openProfile} id="profBtn">Profile</a>
            </div>
        );

        ReactDOM.render(element, document.getElementById('profile'));
    }
}

export class Login extends Component {
    render() {
        return (
            <div className="login">
                <div className="loginBox">
                    <h1>Fortmatic MultiSig</h1>
                    <p id="status">Please login</p>
                    <input type="text" id="user-email" placeholder="Enter your email" />
                    <a className="log1" onClick={this.loginAndMain}>Login</a>
                </div>
            </div>
        );
    }

    async loginAndMain() {
        const email = document.getElementById('user-email').value;

        await index.fmPhantom.loginWithMagicLink({ email })
            .catch((err) => (document.getElementById('status').innerHTML = "Incorrect Login"));

        if (await index.fmPhantom.user.isLoggedIn()) {
            index.makeMainPage();
        }
    }
}
