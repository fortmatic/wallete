// General React components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// General function libraries
import * as index from './index.js';
import * as handle from './phantom.js';

// React Components
import * as authorizers from './authorizers.jsx';
import Assets from './assets.jsx';

export default class Sidebar extends Component {
    render() {
        return (
            <div className="sidebar">
                <ul id="nav">
                    {/* <a className="sidebarBtn" onClick={this.getDeployPage}>Deploy</a> */}
                    <li className="active"><a onClick={this.getAssets}>Assets</a></li>
                    <li><a onClick={this.getSignAndAdd}>Whitelist </a></li>
                    <li><a onClick={this.getSetupPage}>Start Transaction </a></li>
                    <li><a onClick={this.getVault}>Vault </a></li>
                </ul>
            </div>
        );
    }

    getSetupPage() {
        ReactDOM.render(<authorizers.Setup />, document.getElementById('root'));
    }

    getDeployPage() {
        ReactDOM.render(<authorizers.Deploy />, document.getElementById('root'));
    }

    getAssets() {
        ReactDOM.render(<Assets />, document.getElementById('root'));
    }

    async getSignAndAdd() {
        ReactDOM.render(<authorizers.SignAndAdd />, document.getElementById('root'));
        await handle.getWhitelist();
    }

    getVault() {
        ReactDOM.render(<authorizers.Vault />, document.getElementById('root'));
        handle.getPending();

        window.setInterval(handle.getBalance(), 5000);
    }
}
