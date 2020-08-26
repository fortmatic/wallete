import React from 'react';

// App React companents
import { Top } from './login/login'
import Sidebar from "../components/sidebar/sidebar";
import Assets from "../components/assets/assets";
import Transactions from '../components/transactions/transactions';
import SignAndAdd from '../components/whitelist/whitelist';

interface State {
    mainElement: string;
}

interface Props {
    changeStatus: (bool) => void;
    oAuth: boolean,
}


export default class App extends React.Component<Props, State> {
    state = {
        mainElement: "Assets",
        method: false,
    }

    constructor(props) {
        super(props);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleLoginStatus = this.handleLoginStatus.bind(this);
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
                <Top oAuth={this.props.oAuth} changeStatus={this.handleLoginStatus} />
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
