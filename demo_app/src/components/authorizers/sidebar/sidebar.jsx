// General React components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// General function libraries
import './sidebar.css';

// React Components
import * as authorizers from '../authorizers/authorizers.jsx';
import Assets from '../assets/assets.jsx';
import Whitelist from '../whitelist/whitelist.jsx';
import { Transactions, getPending } from '../transactions/transactions.jsx';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <ul id="nav">
                    <div>
                        <li id="Assets" className="active"><a onClick={this.getAssets} href="!#">Assets</a></li>
                        <li id="Whitelist" ><a onClick={this.getSignAndAdd} href="!#">Whitelist </a></li>
                        <li id="Transactions"><a onClick={this.getTransactions} href="!#">Transactions</a></li>
                    </div>
                </ul>
            </div>
        );
    }

    getTransactions = async () => {
        document.getElementById('Assets').setAttribute('class', '');
        document.getElementById('Whitelist').setAttribute('class', '');
        document.getElementById('Transactions').setAttribute('class', 'active');

        await getPending();
        ReactDOM.render(<Transactions />, document.getElementById('root'));
    }

    getAssets = () => {
        document.getElementById('Assets').setAttribute('class', 'active');
        document.getElementById('Whitelist').setAttribute('class', '');
        document.getElementById('Transactions').setAttribute('class', '');

        ReactDOM.render(<Assets />, document.getElementById('root'));
    }

    getSignAndAdd = () => {
        document.getElementById('Assets').setAttribute('class', '');
        document.getElementById('Whitelist').setAttribute('class', 'active');
        document.getElementById('Transactions').setAttribute('class', '');

        ReactDOM.render(<Whitelist />, document.getElementById('root'));
    }

    getDeployPage = () => {
        ReactDOM.render(<authorizers.Deploy />, document.getElementById('root'));
    }
}
