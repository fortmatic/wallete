// General React Libraries
import React, { Component } from 'react';

// Function libraries
import * as constants from '../../constants/constants';
import './login.scss';

// React components
import Blockies from 'react-blockies';


export class Top extends Component<any, any> {
    state = {
        open: false,
        userAddress: "",
        username: "",
        addressPart: "",
        addEnd: "",
        icon: ""
    };

    async componentDidMount() {
        const user_in = (await constants.magic.user.getMetadata()).email;
        const address_in = (await constants.magic.user.getMetadata()).publicAddress;
        var userAdd = "";
        var addressEnd = ""
        this.setState({ userAddress: user_in });
        this.setState({ username: address_in });
        for (let i = 0; i < 15; ++i) {
            userAdd += address_in[i];
        }
        userAdd += '...';
        for (let i = address_in.length - 5; i < address_in.length; ++i) {
            userAdd += address_in[i];
        }
        userAdd += ' ';
        this.setState({ addressPart: userAdd });
        this.setState({ addEnd: addressEnd });

        this.setState({
            icon: <Blockies
                seed={address_in}
                size={6}
                scale={6}
            >
            </Blockies>
        });

        document.addEventListener('mousedown', this.handleClick, false);
    }

    render() {
        return (
            <div className="Top">
                <header className="Top-header">
                    <h1 id="main"> <div className="logo_box">WALLETTE</div></h1>
                    <div id="profile">
                        {this.handleState()}
                    </div>
                </header>
                <p ref={this.container}></p>
            </div>
        );
    }

    container: any = React.createRef();
    node: any;

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

        await constants.magic.user.logout();

        this.props.changeStatus(await constants.magic.user.isLoggedIn());
    }

    openProfile = () => {
        return (
            <div >
                <a href="!#" onClick={this.switchState} ref={node => this.node = node}>
                    {this.state.icon}
                </a>
                <div className="profile-Box" ref={this.container}>
                    <p className="icon-display">{this.state.icon} {this.state.userAddress}
                    </p>

                    <div>
                        <a href="!#" id="user-Address">{this.state.addressPart}
                            <span className="copy-hov">{this.state.username}</span>
                        </a>
                        <a href="!#" onClick={() => navigator.clipboard.writeText(this.state.username)}>
                            <i ><span className="clipboard-hov">Copy</span></i></a>
                    </div>
                    <a href="!#" className="logout-Btn" onClick={this.logout}>Logout</a>
                </div>
            </div>
        );
    }

    closeProfile = () => {
        return (
            <div>
                <a href="!#" onClick={this.switchState} ref={node => this.node = node}>
                    {this.state.icon}
                </a>
                <p ref={this.container}></p>
            </div>
        );
    }

}

export class Login extends Component<any> {
    state = {
        email: "",
        status: ""
    };

    constructor(props) {
        super(props);

        this.handleEmail = this.handleEmail.bind(this);
    }

    render() {
        return (
            <div className="login">
                <div className="login-Box">
                    <h1>WALLETTE</h1>
                    <p>Please login</p>
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

        await constants.magic.auth.loginWithMagicLink({ email })
            .catch((err) => (
                this.setState({
                    status: "Incorrect Login"
                })
            ));


        this.props.changeStatus(await constants.magic.user.isLoggedIn());
    }
}