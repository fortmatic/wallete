import React, { Component } from 'react';

import * as index from '../../index.js';
import assetStyle from'./assets.module.scss';
import mainStyle from '../../main.module.scss'

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
        const { eth } = this.state;

        return (
            <div className={mainStyle.main}>
                <div className={mainStyle.mainBlueBox}>
                <h1 className="title">{"On contract " + this.state.contractAddress}</h1>
                    <table className={assetStyle.table}>
                        <tbody>
                            <tr>
                                <th className={assetStyle.assets}>Assets</th>
                                <th className={assetStyle.balance}>Balance</th>
                            </tr>
                            <tr>
                                <td className={assetStyle.assets}>Ether</td>
                                <td className={assetStyle.balance}>{eth + " Eth"}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
};
