// General React Libaries
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './main.module.scss';

// Contract related Libraries
import { magic } from './constants/constants';

// Main React Components
import App from './containers/app';
import { Login } from './containers/login/login';
import { Buffer } from "./components/loader/loader";

interface State {
    isLoggedIn: boolean;
    isLoading: boolean;
    oAuth: boolean;
}

class Main extends React.Component<{}, State> {
    state = {
        isLoggedIn: false,
        isLoading: true,
        oAuth: null,
    };

    async componentDidMount() {
        const loginStatus = (await magic.user.isLoggedIn());
        this.setState({
            isLoggedIn: loginStatus,
            isLoading: false,
            oAuth: true,
        });

        try {
            await magic.oauth.getRedirectResult();
            this.setState({
                oAuth: true,
            });
        } catch(e) {
            this.setState({
                oAuth: false,
            });
        }
    }

    handleLoginStatus = status => {
        this.setState({ isLoggedIn: status });
    }

    render() {
        return (
            (this.state.isLoading) ? (
                <Buffer />
            ) : (
                    (this.state.isLoggedIn) ? (
                        <App oAuth={this.state.oAuth} changeStatus={this.handleLoginStatus} />
                    ) : (
                            <Login changeStatus={this.handleLoginStatus} />
                        )
                )
        );
    }
}

ReactDOM.render(<Main />, document.getElementById('root') || document.createElement("div"));
