// General React components
import React, { Component } from 'react';

// General function libraries
import './sidebar.scss';

export default class Sidebar extends Component {
    state = {
        assetsActive: "active",
        whitelistActive: "",
        txActive: ""
    };

    render() {
        const {
            assetsActive,
            whitelistActive,
            txActive } = this.state;

        return (
            <div className="sidebar" id="sidebar">
                <ul id="nav">
                    <div>
                        <li id="Assets" className={assetsActive}>
                            <a onClick={this.getAssets} href="!#">Assets</a></li>
                        <li id="Whitelist" className={whitelistActive}>
                            <a onClick={this.getSignAndAdd} href="!#">Whitelist </a></li>
                        <li id="Transactions" className={txActive}>
                            <a onClick={this.getTransactions} href="!#">Transactions</a></li>
                    </div>
                </ul>
            </div>
        );
    }

    getTransactions = async () => {
        this.setState({
            assetsActive: "",
            whitelistActive: "",
            txActive: "active"
        });

        this.props.changePage("Transactions");
    }

    getAssets = () => {
        this.setState({
            assetsActive: "active",
            whitelistActive: "",
            txActive: ""
        });

        this.props.changePage("Assets");
    }

    getSignAndAdd = () => {
        this.setState({
            assetsActive: "",
            whitelistActive: "active",
            txActive: ""
        });

        this.props.changePage("SignAndAdd");
    }
}
