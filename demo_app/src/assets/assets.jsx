import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as index from '../index.js';
import './assets.css';

export default class Assets extends Component {
    async componentDidMount() {
        document.getElementById('thing').innerHTML = 'On contract ' + index.contract.options.address;
        window.setInterval(this.getData(), 10000);
    }

    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <h1 id="thing">On Contract </h1>
                    <table id="table">
                        <thead>
                            <tr>
                                <th>Assets</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody id="list"></tbody>
                    </table>
                </div>
            </div>
        );
    }

    async getData() {
        const balance = await index.contract.methods.contractBalance().call() / Math.pow(10, 18) + " Eth";

        const element = (
            <tr>
                <td>Ether</td>
                <td>{balance}</td>
            </tr>
        );

        ReactDOM.render(element, document.getElementById('list'));
    }
};
