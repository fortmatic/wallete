// General React Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Function libraries
import * as index from "./index.js";
import * as handle from './phantom.js';

// React components
import * as authorizers from './authorizers.jsx';
import Assets from './assets.jsx';
//blockies
import Blockies from 'react-blockies';

export class Top extends Component {
    render () {

        const mySeed = index.fmPhantom.user.getMetadata().publicAddress;
        return (
            <div className="App">
                <header className="App-header">
                    <h1 id="main"> <div className = "logo_box">WALLETTE</div></h1>
                    <div id="profile">
                    <a className = "identicon" onClick={this.openProfile} onMouseEnter={this.hoverProfile} id="profBtn">
                        <Blockies 
                        seed={mySeed}
                        size= {5}
                        scale = {10}>
                        </Blockies>
                    </a>
                    </div>
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
        const mySeed = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const element = (
            <div >
                <a className = "identicon" onClick={this.closeProfile} id="profBtn">
                        <Blockies 
                            seed={mySeed}
                            size= {5}
                            scale = {10}>
                        </Blockies>
                        </a>
                <div className = "profileBox">
                <p id="username"></p>
                <p id="userAddress"></p>
                <a className="logoutBtn" onClick={this.logout} id = "logoutBtn">Logout</a>
                </div>
            </div>
        );

        await ReactDOM.render(element, document.getElementById('profile'));
        
        document.getElementById('username').innerHTML = (await index.fmPhantom.user.getMetadata()).email;
        document.getElementById('userAddress').innerHTML = (await index.fmPhantom.user.getMetadata()).publicAddress;
    }

    hoverProfile = async () => {
        const mySeed = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const element = (
            <div >
                <a className = "identicon" onMouseLeave={this.closeProfile} onClick={this.openProfile} id="profBtn">
                        <Blockies 
                            seed={mySeed}
                            size= {5}
                            scale = {10}>
                        </Blockies>
                        </a>
                <div className = "profileBox">
                <p id="username"></p>
                <p id="userAddress"></p>
                </div>
            </div>
        );

        await ReactDOM.render(element, document.getElementById('profile'));
        document.getElementById('username').innerHTML = (await index.fmPhantom.user.getMetadata()).email;
        document.getElementById('userAddress').innerHTML = (await index.fmPhantom.user.getMetadata()).publicAddress;
    }

    closeProfile = async () => {
        const mySeed = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const element = (
            <div>
                <a className = "identicon" onClick={this.openProfile} onMouseEnter={this.hoverProfile} id="profBtn">
                    <Blockies 
                        seed= {mySeed}
                        size= {5}
                        scale = {10}>
                    </Blockies>
                </a>
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
