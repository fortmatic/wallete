// General React Libraries
import React, { Component } from 'react';

// Function libraries
import * as index from "../index.js";
import './login.css';

// React components
import Blockies from 'react-blockies';



export class Top extends Component {
    state = {
        userAddress: "",
        username: "",
        open: false
    };

    async componentDidMount() {
        const user_in = (await index.fmPhantom.user.getMetadata()).email;
        const address_in = (await index.fmPhantom.user.getMetadata()).publicAddress;

        this.setState({ userAddress: user_in });
        this.setState({ username: address_in });

        this.setState({
            icon: <Blockies
                seed={this.state.userAddress}
                size={5}
                scale={10}
            >
            </Blockies>
        });

        document.addEventListener('mousedown', this.handleClick, false);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 id="main"> <div className="logo_box">WALLETTE</div></h1>
                    <div id="profile">
                        {this.handleState()}
                    </div>
                </header>
                <p ref={this.container}></p>
            </div>
        );
    }

    container = React.createRef();

    handleState = () => {
        if (this.state.open) {
            return this.openProfile();
        } else {
            return this.closeProfile();
        }
    }

    switchState = () => {
        if (this.state.open)
            this.setState({ open: false });
        else
            this.setState({ open: true });
    }

    handleClick = (e) => {
        if (!this.node.contains(e.target) && !this.container.current.contains(e.target) && this.state.open) {
            this.setState({ open: false });
        }
    }

    logout = async () => {
        document.removeEventListener('mousedown', this.handleClick, false);

        await index.fmPhantom.user.logout()
            .then((rec) => {
                index.makeLoginPage();
            });
    }

    openProfile = () => {
        return (
            <div >
                <a href="!#" className="identicon" onClick={this.switchState} id="profBtn" ref={node => this.node = node}>
                    {this.state.icon}
                </a>
                <div className="profileBox" ref={this.container}>
                    <p id="username">{this.state.username}</p>
                    <p id="userAddress">{this.state.userAddress}</p>
                    <a href="!#" className="logoutBtn" onClick={this.logout} id="logoutBtn">Logout</a>
                </div>
            </div>
        );
    }

    closeProfile = () => {
        return (
            <div>
                <a href="!#" className="identicon" onClick={this.switchState} id="profBtn" ref={node => this.node = node}>
                    {this.state.icon}
                </a>
                <p ref={this.container}></p>
            </div>
        );
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