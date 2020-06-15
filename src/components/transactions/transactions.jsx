// General React components
import React, { Component } from 'react';

// General function libraries
import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './transactions.scss';
// Libraries for table
import Card from '@material-ui/core/Card';

import { Loader } from '../loader/loader.jsx';

class TxRow extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        isExpanded: false
    }

    render() {
        return (
            <tr className="transaction-row" onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}>
                <td className="transaction-hash">{this.props.data.txHash.substring(0, 15) + "..."}</td>
                <td className="transaction-to">{this.props.data.to.substring(0, 15) + "..."}</td>
                <td className="transaction-amount">{this.props.data.amount / Math.pow(10, 18)} Eth</td>
                {(this.props.data.complete) ?
                    <td className="transaction-status">Done</td>
                    : <td className="transaction-status">Pending</td>}

                {this.state.isExpanded &&
                    <div className="composition">
                        <p>Transaction Hash: {this.props.data.txHash}</p>
                        <p>From: {this.props.data.from}</p>
                        <p>To: {this.props.data.to}</p>
                        <a href={"https://rinkeby.etherscan.io/tx/" + this.props.data.txHash} className="link-btn" target="_blank" rel="noopener noreferrer">View on Etherscan</a>
                        {(this.props.data.complete) ?
                            <p id="status">Tx has been sent</p> :
                            <div>
                                <p>Number of Signatures: {this.props.data.numSigs}/{this.props.data.threshold}</p>
                                <button onClick={() => this.props.signTx()} className="sign-btn">Sign Transaction</button>
                                <p id="status"></p>
                            </div>}
                    </div>}
            </tr>
        );
    }
}

export default class Transactions extends Component {
    state = {
        exchangeAmt: "",
        address: "",
        loading: false,
        hash: "",
        errorMsg: "",
        loadTitle: "",
        txLink: "",
        successType: "",
        msg: "",
        data: [],
        pending: []
    }

    constructor() {
        super();

        this.handleExchangeAmt = this.handleExchangeAmt.bind(this);
        this.handleAddress = this.handleAddress.bind(this);
    }

    async componentDidMount() {
        const pending = await index.contract.methods.getTransactions().call();
        this.setState({ pending: pending });
    }

    handleCloseLoad = () => {
        this.setState({
            loading: false,
            hash: "",
            errorMsg: "",
            loadTitle: "",
            txLink: "",
            successType: "",
            msg: ""
        });
    }

    render() {
        return (
            <div className="main">
                {this.state.loading && <Loader
                    hash={this.state.hash}
                    close={this.handleCloseLoad}
                    errorMsg={this.state.errorMsg}
                    title={this.state.loadTitle}
                    toAddress={this.state.address}
                    amount={this.state.exchangeAmt}
                    link={this.state.txLink}
                    msg={this.state.msg}
                    successType={this.state.successType}
                />}
                <div className="main-blue-box">
                    <div id="pending">
                        <h1 className="transaction-title">Transactions</h1>
                        <Card>
                            <table className="transaction-table">
                                <tbody>
                                    <tr>
                                        <th className="transaction-hash">Tx Hash</th>
                                        <th className="transaction-to">To</th>
                                        <th className="transaction-amount">Amount</th>
                                        <th className="transaction-status">Status</th>
                                    </tr>
                                    {this.state.pending.map((tx, index) => {
                                        return (<TxRow key={index} data={tx} signTx={() => this.signContract(index)} />)
                                    })}

                                </tbody>
                            </table>
                        </Card>
                    </div>
                    <h1 className="new-trans">New Transaction</h1>
                    <div className="start-trans">
                        <input type="text" className="address" placeholder="Send to Address"
                            value={this.state.address} onChange={this.handleAddress} />
                        <input type="number" className="exchange-Amt" placeholder="Transaction amount (Eth)"
                            value={this.state.exchangeAmt} onChange={this.handleExchangeAmt} />
                        <p className="connected" id="status"></p>
                        <a className="start-btn" onClick={this.startTransaction} href="!#">Start Transaction</a>
                        <p className="connected" id="message"></p>
                    </div>
                </div>
            </div>
        );
    }

    handleExchangeAmt = (event) => {
        this.setState({
            exchangeAmt: event.target.value
        });
    }

    handleAddress = (event) => {
        this.setState({
            address: event.target.value
        })
    }

    startTransaction = async () => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        const amount = this.state.exchangeAmt;
        const sendAddress = this.state.address;
        const threshold = 3;

        try {
            let message = "Invalid Inputs";
            if (sendAddress === "" || amount === "") throw message;
        }
        catch (err) {
            console.log(err);
            this.setState({
                loadTitle: "Unable to start transaction",
                errorMsg: err
            });
            return;
        }

        console.log(amount);
        var txnHash;

        const transactAmt = index.web3.utils.toWei(amount, "ether");
        console.log(transactAmt);

        try {
            const status = await index.contract.methods.setupTransaction(sendAddress, threshold, transactAmt).call({
                from: userAddress,
                value: transactAmt
            });

            if (status !== "Transaction Started") {
                throw status;
            }

            await index.contract.methods.setupTransaction(sendAddress, threshold, transactAmt).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000',
                value: transactAmt
            })
                .on('transactionHash', (hash) => {
                    txnHash = hash;
                    this.setState({ hash: hash });
                });

            await index.contract.methods.setHash(txnHash).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000'
            });
        } catch (err) {
            console.log("error caught");
            console.log(err);
            this.setState({
                loadTitle: "Unable to start transaction",
                errorMsg: err
            });
            return;
        }
        const link = "https://rinkeby.etherscan.io/tx/" + txnHash;

        this.setState({
            successType: "start",
            txLink: link
        });
    }

    signContract = async (i) => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        let msg = "";

        try {
            const status = await index.contract.methods.signTransaction(i).call({
                from: userAddress
            });

            if (status !== "Signed" && status !== "Transaction Completed") {
                throw status;
            }

            await index.contract.methods.signTransaction(i).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '3000000000000'
            })
                .on('transactionHash', (hash) =>
                    this.setState({ hash: hash }))

                .on('receipt', (rec) => {
                    if (rec.events.transactionOccured != null) {
                        msg = "Transaction completed";
                    }
                });
        } catch (err) {
            this.setState({
                loadTitle: "Unable to sign transaction",
                errorMsg: err
            });
            return;
        }

        this.setState({
            successType: "sign",
            hash: this.state.data[i].txHash,
            msg: msg
        });
    }
}
