// General React Libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Function libraries
import * as index from "./index.js";
// import * as handle from './phantom.js';

// React components
// import * as authorizers from './authorizers.jsx';
// import Assets from './assets.jsx';
//blockies
import Blockies from 'react-blockies';



export class Top extends Component {
    // async componentDidMount() {
    //     await this.blockieS;
    // }
    render () {
        var mySeed = this.setSeed.toString();
        return (
            <div className="App">
                <header className="App-header">
                    <h1 id="main"> <div className = "logo_box">WALLETTE</div></h1>
                    <div id="profile">
                    <a href="!#" className = "identicon" onClick={this.openProfile} id="profBtn" ref={node => this.node = node}>
                        <Blockies
                        seed={mySeed}
                        size= {5}
                        scale = {10}
                        >
                        </Blockies>
                    </a>
                    </div>
                </header>
                <p ref={this.container}></p>
            </div>
        );
    }

    setSeed = async () => {
        var mySeed = (await index.fmPhantom.user.getMetadata()).publicAddress;
        return mySeed;
    }

    container = React.createRef();

    handleClick = (e) => {
        if (!this.node.contains(e.target) && !this.container.current.contains(e.target)) {
            this.closeProfile();
        }
    }

    logout = async () => {
        document.removeEventListener('mousedown', this.handleClick, false);

        await index.fmPhantom.user.logout()
            .then((rec) => {
                ReactDOM.render(<Login />, document.getElementById('root'));
                ReactDOM.render(<div></div>, document.getElementById('sidebar'));
                ReactDOM.render(<div></div>, document.getElementById('constant'));
            });
    }

    openProfile = async () => {
        document.addEventListener('mousedown', this.handleClick, false);

        var mySeed = this.setSeed.toString();
        const element = (
            <div >
                <a href="!#" className = "identicon" onClick={this.closeProfile} id="profBtn" ref={node => this.node = node}>
                        <Blockies
                            seed={mySeed}
                            size= {5}
                            scale = {10}
                            >
                        </Blockies>
                        </a>
                <div className = "profileBox" ref={this.container}>
                <p id="username"></p>
                <p id="userAddress"></p>
                <a href="!#" className="logoutBtn" onClick={this.logout} id="logoutBtn">Logout</a>
                </div>
            </div>
        );

        await ReactDOM.render(element, document.getElementById('profile'));
        
        document.getElementById('username').innerHTML = (await index.fmPhantom.user.getMetadata()).email;
        document.getElementById('userAddress').innerHTML = (await index.fmPhantom.user.getMetadata()).publicAddress;
    }

    closeProfile = async () => {
        document.removeEventListener('mousedown', this.handleClick, false);

        var mySeed = this.setSeed.toString();
        const element = (
            <div>
                <a href="!#" className = "identicon" onClick={this.openProfile} id="profBtn" ref={node => this.node = node}>
                    <Blockies 
                        seed= {mySeed}
                        size= {5}
                        scale = {10}
                        >
                    </Blockies>
                </a>
                <p ref={this.container}></p>
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
                    <h1>WALLETTE</h1>
                    <p id="status">Please login</p>
                    <input type="text" id="user-email" placeholder="Enter your email" />
                    <a href="!#" className="log1" onClick={this.loginAndMain}>Login</a>
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