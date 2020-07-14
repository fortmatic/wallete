// General React components
import React, { Component } from 'react';

// General function libraries
import sidebarStyle from './sidebar.module.scss';

export default class Sidebar extends Component {
    state = {
        assetsActive: "active",
        whitelistActive: "",
        txActive: ""
    };

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

    render() {
        const {
            assetsActive,
            whitelistActive,
            txActive } = this.state;

        return (
            <div className={sidebarStyle.sidebar} id={sidebarStyle.sidebar}>
                <ul id={sidebarStyle.nav}>
                    <div>
                        <li id="Assets" className={assetsActive === "active" ? sidebarStyle.active : ""}>
                            <a onClick={this.getAssets} href="!#">Assets</a></li>
                        <li id="Whitelist" className={whitelistActive === "active" ? sidebarStyle.active : ""}>
                            <a onClick={this.getSignAndAdd} href="!#">Whitelist </a></li>
                        <li id="Transactions" className={txActive === "active" ? sidebarStyle.active : ""}>
                            <a onClick={this.getTransactions} href="!#">Transactions</a></li>
                    </div>
                </ul>
            </div>
        );
    }
}
