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


// React Components
import { Login, Top } from './login/login.jsx';
import Sidebar from "./components/sidebar/sidebar.jsx";
import Assets from "./components/assets/assets.jsx";
import { Transactions } from './components/transactions/transactions.jsx';
import SignAndAdd from './components/whitelist/whitelist.jsx';

export const web3 = new Web3(constants.magic.rpcProvider);
export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = constants.contractAddress;

class App extends React.Component {
    state = {
        isLoggedIn: false,
        mainElement: "Assets"
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

    handlePageChange = newPage => {
        this.setState({ mainElement: newPage });
    }

    render() {
        return (
            (this.state.isLoggedIn) ? (
                <div>
                    <Top changeStatus={this.handleLoginStatus} />
                    <Sidebar changePage={this.handlePageChange} />
                    <div id="main">
                        {this.state.mainElement === "Assets" && <Assets />}
                        {this.state.mainElement === "SignAndAdd" && <SignAndAdd />}
                        {this.state.mainElement === "Transactions" && <Transactions />}
                    </div>
                </div>
            ) : (
                    <Login changeStatus={this.handleLoginStatus} />
                )
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
