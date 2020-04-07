// General React components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// General function libraries
import * as index from './index.js';
import * as handle from './phantom.js';

// React Components
import * as authorizers from './authorizers.jsx';
import Assets from './assets.jsx';
import Whitelist from './whitelist.jsx';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <ul id="nav">
                    <div>
                        {/* <a className="sidebarBtn" onClick={this.getDeployPage}>Deploy</a> */}
                        <li className="active"><a onClick={this.getAssets}>Assets</a></li>
                        <li><a onClick={this.getSignAndAdd}>Whitelist </a></li>
                        <li><a onClick={this.getSetupPage}>Transactions</a></li>
                        {/* <li><a onClick={this.getVault}>Vault </a></li> */}
                    </div>
                </ul>
            </div>
        );
    }

    getSetupPage = () => {
        const element = (
            <div>
                <li><a onClick={this.getAssets}>Assets</a></li>
                <li><a onClick={this.getSignAndAdd}>Whitelist </a></li>
                <li className="active"><a onClick={this.getSetupPage}>Transactions</a></li>
            </div>
        );

        ReactDOM.render(element, document.getElementById('nav'));
        ReactDOM.render(<authorizers.Setup />, document.getElementById('root'));
        handle.getPending();
    }

    getDeployPage = () => {
        ReactDOM.render(<authorizers.Deploy />, document.getElementById('root'));
    }

    getAssets = () => {
        const element = (
            <div>
                <li className="active"><a onClick={this.getAssets}>Assets</a></li>
                <li><a onClick={this.getSignAndAdd}>Whitelist </a></li>
                <li><a onClick={this.getSetupPage}>Transactions</a></li>
            </div>
        );

        ReactDOM.render(element, document.getElementById('nav'));
        ReactDOM.render(<Assets />, document.getElementById('root'));
    }

    getSignAndAdd = () => {
        const element = (
            <div>
                <li><a onClick={this.getAssets}>Assets</a></li>
                <li className="active"><a onClick={this.getSignAndAdd}>Whitelist </a></li>
                <li ><a onClick={this.getSetupPage}>Transactions</a></li>
            </div>
        );

        ReactDOM.render(element, document.getElementById('nav'));
        ReactDOM.render(<Whitelist />, document.getElementById('root'));
    }

    // getVault() {
    //     ReactDOM.render(<authorizers.Vault />, document.getElementById('root'));
    //     handle.getPending();
    // }
}
