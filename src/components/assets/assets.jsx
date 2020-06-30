import React, { Component } from 'react';

import * as index from '../../index.js';
import './assets.scss';

export default class Assets extends Component {
    state = {
        contractAddress: "",
        eth: ""
    }

    async componentDidMount() {
        this.setState({
            contractAddress: index.contract.options.address
        })
        const balance = await index.contract.methods.contractBalance().call() / Math.pow(10, 18);
        this.setState({
            eth: balance
        });
    }

    render() {
        return (
            <div className="main">
                <div className="mainBlueBox">
                <h1 className="title">{"On contract " + this.state.contractAddress}</h1>
                    <table className="table">
                        <tbody>
                            <tr>
                                <th className="assets">Assets</th>
                                <th className="balance">Balance</th>
                            </tr>
                            <tr>
                                <td className="assets">Ether</td>
                                <td className="balance">{this.state.eth + " Eth"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};
