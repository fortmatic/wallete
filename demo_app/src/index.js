// General React Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.css';
import * as serviceWorker from './serviceWorker';

// Contract related Libraries
import * as abi from './constants/abi.js';
import * as constants from './constants/constants.js';
import Web3 from 'web3';

// Main React Components
import App from './containers/App.jsx';
import { Login } from './containers/login/login.jsx';

export const web3 = new Web3(constants.magic.rpcProvider);
export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = constants.contractAddress;

class Main extends React.Component {
    state = {
        isLoggedIn: false
    };

    async componentDidMount() {
        const loginStatus = (await constants.magic.user.isLoggedIn());
        this.setState({
            isLoggedIn: loginStatus
        });
    }

    handleLoginStatus = status => {
        this.setState({ isLoggedIn: status });
    }

    render() {
        return (
            (this.state.isLoggedIn) ? (
                <App changeStatus={this.handleLoginStatus} />
            ) : (
                    <Login changeStatus={this.handleLoginStatus} />
                )
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
