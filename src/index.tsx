// General React Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.module.scss';
import * as serviceWorker from './serviceWorker';

// Contract related Libraries
import abi from './constants/abi';
import * as constants from './constants/constants';
import Web3 from 'web3';

// Main React Components
import App from './containers/app';
import { Login } from './containers/login/login';
import { Buffer } from "./components/loader/loader";

export const web3 = new Web3(constants.magic.rpcProvider);
export var contract = new web3.eth.Contract(abi); // need abi of smart contract
contract.options.address = constants.contractAddress;

class Main extends React.Component {
    state = {
        isLoggedIn: false,
        isLoading: true
    };

    async componentDidMount() {
        const loginStatus = (await constants.magic.user.isLoggedIn());
        this.setState({
            isLoggedIn: loginStatus,
            isLoading: false
        });
    }

    handleLoginStatus = status => {
        this.setState({ isLoggedIn: status });
    }

    render() {
        return (
            (this.state.isLoading) ? (
                <Buffer />
            ) : (
                    (this.state.isLoggedIn) ? (
                        <App changeStatus={this.handleLoginStatus} />
                    ) : (
                            <Login changeStatus={this.handleLoginStatus} />
                        )
                )
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root') || document.createElement("div"));
