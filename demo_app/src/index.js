// General React Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.css';
import * as serviceWorker from './serviceWorker';

// Contract related Libraries
import * as abi from './constants/abi.js';
import Web3 from 'web3';
import Fortmatic from 'fortmatic';

// React Components
import { Login, Top } from './login/loginConstants';
import Sidebar from "./components/sidebar/sidebar.jsx";
import Assets from "./components/assets/assets.jsx";

export const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');
export const web3 = new Web3(fmPhantom.getProvider());
export var contract = new web3.eth.Contract(abi.contractAbi); // need abi of smart contract
contract.options.address = '0xf703EE3A38fE097545C6b6b555faf6216584bf91';

class App extends React.Component {
    state = {
        LoginStatus: fmPhantom.user.isLoggedIn(),
        mainElement: Assets
    };

    handleLoginStatus = status => {
        this.setState({ LoginStatus: status });
    }

    handlePageChange = newPage => {
        this.setState({ mainElement: newPage });
    }

    render() {
        if (this.state.LoginStatus)
            return (
                <div>
                    <Top changeStatus={this.handleLoginStatus} />
                    <Sidebar changePage={this.handlePageChange}/>
                    <div id="main">
                        <this.state.mainElement />
                    </div>
                </div>
            );

        else
            return (<Login changeStatus={this.handleLoginStatus} />);
    }
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
