import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';
import * as serviceWorker from './serviceWorker';
import { Login, makeMainPage } from './loginConstants';

import Fortmatic from 'fortmatic';
const fmPhantom = new Fortmatic.Phantom('pk_test_0DBC72C8476764F8');

let prep = async () => {
    if (await fmPhantom.user.isLoggedIn())
        makeMainPage();
    else
        ReactDOM.render(<Login />, document.getElementById('root'));
}

prep();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
