// General React Libraries
import React, { Component } from 'react';

// Function libraries
import * as constants from '../constants/constants.js';
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
        const user_in = (await constants.fmPhantom.user.getMetadata()).email;
        const address_in = (await constants.fmPhantom.user.getMetadata()).publicAddress;

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

        await constants.fmPhantom.user.logout();

        this.props.changeStatus(await constants.fmPhantom.user.isLoggedIn());
    }

    openProfile = () => {
        return (
            <div >
                <a href="!#" className="identicon" onClick={this.switchState} ref={node => this.node = node}>
                    {this.state.icon}
                </a>
                <div className="profile-Box" ref={this.container}>
                    <p id="username">{this.state.username}</p>
                    <p id="user-Address">{this.state.userAddress}</p>
                    <a href="!#" className="logout-Btn" onClick={this.logout} id="logout-Btn">Logout</a>
                </div>
            </div>
        );
    }

    closeProfile = () => {
        return (
            <div>
                <a href="!#" className="identicon" onClick={this.switchState} ref={node => this.node = node}>
                    {this.state.icon}
                </a>
                <p ref={this.container}></p>
            </div>
        );
    }

}

export class Login extends Component {
    state = {
        email: "",
        status: ""
    };

    constructor() {
        super();

        this.handleEmail = this.handleEmail.bind(this);
    }

    render() {
        return (
            <div className="login">
                <div className="login-Box">
                    <h1>WALLETTE</h1>
                    <p value={this.state.status}>Please login</p>
                    <input type="text" className="user-email" placeholder="Enter your email" value={this.state.email}
                        onChange={this.handleEmail} />
                    <a href="!#" className="log-1" onClick={this.loginAndMain}>Login</a>
                </div>
            </div>
        );
    }

    handleEmail = (event) => {
        this.setState({
            email: event.target.value
        });
    }

    loginAndMain = async () => {
        const email = this.state.email;

        await constants.fmPhantom.loginWithMagicLink({ email })
            .catch((err) => (
                this.setState({
                    status: "Incorrect Login"
                })
            ));


        this.props.changeStatus(await constants.fmPhantom.user.isLoggedIn());
    }
}