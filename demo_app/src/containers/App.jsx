import React from 'react';

import { Top } from './login/login.jsx'
import Sidebar from "../components/sidebar/sidebar.jsx";
import Assets from "../components/assets/assets.jsx";
import { Transactions } from '../components/transactions/transactions.jsx';
import SignAndAdd from '../components/whitelist/whitelist.jsx';


export default class App extends React.Component {
    state = {
        mainElement: "Assets"
    }

    constructor(props) {
        super(props);
    }

    handlePageChange = newPage => {
        this.setState({ mainElement: newPage });
    }

    handleLoginStatus = status => {
        this.props.changeStatus(status);
    }

    render() {
        return (
            <div>
                <Top changeStatus={this.handleLoginStatus} />
                <Sidebar changePage={this.handlePageChange} />
                <div id="main">
                    {this.state.mainElement === "Assets" && <Assets />}
                    {this.state.mainElement === "SignAndAdd" && <SignAndAdd />}
                    {this.state.mainElement === "Transactions" && <Transactions />}
                </div>
            </div>
        );
    }
}