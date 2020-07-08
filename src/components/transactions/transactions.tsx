// General React components
import React from 'react';

// General function libraries
import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './transactions.scss';

import { Loader } from '../loader/loader.jsx';

import { startTxInputs, signContractInputs } from "./transactionsHelper.js";

interface TxRowProps {
    data?: any,
    signTx(): any;
}

interface TxRowState {
    isExpanded?: Boolean;
}

class TxRow extends React.Component<TxRowProps, TxRowState> {
    state = {
        isExpanded: false
    }

    render() {
        const {
            txHash,
            to,
            amount,
            complete,
            from,
            threshold,
            numSigs
        } = this.props.data;

        return (

            <tr className="transactionRow" onClick={() => this.setState({ isExpanded: !this.state.isExpanded })}>
                <td className="transactionHash">{this.props.data.txHash.substring(0, 15) + "..."}</td>
                <td className="transactionTo">{this.props.data.to.substring(0, 15) + "..."}</td>
                <td className="transactionAmount">{this.props.data.amount / Math.pow(10, 18)} Eth</td>
                {(this.props.data.complete) ?
                    <td className="transactionStatus">Done</td>
                    : <td className="transactionStatus">Pending</td>}

                {this.state.isExpanded &&
                    <td className="composition">
                        <p>Transaction Hash: {this.props.data.txHash}</p>
                        <p>From: {this.props.data.from}</p>
                        <p>To: {this.props.data.to}</p>
                        <a href={"https://rinkeby.etherscan.io/tx/" + this.props.data.txHash} className="linkBtn" target="_blank" rel="noopener noreferrer">View on Etherscan</a>
                        {(this.props.data.complete) ?
                            <p id="status">Tx has been sent</p> :
                            <div>
                                <p>Number of Signatures: {this.props.data.numSigs}/{this.props.data.threshold}</p>
                                <button onClick={() => this.props.signTx()} className="signBtn">Sign Transaction</button>

                                <p id="status"></p>
                            </div>}
                    </td>}
            </tr>
        );
    }
}

interface transactionData {
    from?: any,
    to?: any,
    amount?: number,
    nonceTrans?: number,
    threshold?: number,
    numSigs?: number,
    txHash?: string,
    complete?: Boolean
}

interface TransactionsProps {

}

interface TransactionsState {
    exchangeAmt?: string,
    address?: string,
    sendAddress?: string,
    loading?: boolean,
    hash?: string,
    errorMsg?: string,
    loadTitle?: string,
    txLink?: string,
    successType?: string,
    msg?: string,
    pending: Array<transactionData>
}

export default class Transactions extends React.Component<TransactionsProps, TransactionsState> {
    state = {
        exchangeAmt: "",
        address: "",
        sendAddress: "",
        loading: false,
        hash: "",
        errorMsg: "",
        loadTitle: "",
        txLink: "",
        successType: "",
        msg: "",
        pending: []
    }

    constructor(props: TransactionsProps) {
        super(props);

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
        const {
            loading,
            hash,
            errorMsg,
            successType,
            pending,
            address,
            loadTitle,
            exchangeAmt,
            msg,
            txLink
        } = this.state;

        return (
            <div className="main">
                {loading && <Loader
                    hash={hash}
                    close={this.handleCloseLoad}
                    errorMsg={errorMsg}
                    title={loadTitle}
                    toAddress={address}
                    amount={exchangeAmt}
                    link={txLink}
                    msg={msg}
                    successType={successType}
                />}
                <div className="mainBlueBox">
                    <div id="pending">

                        <h1 className="transactionTitle">Transactions</h1>
                        <table className="transactionTable">
                            <tbody>
                                <tr className="headingRow">
                                    <th className="transactionHash">Tx Hash</th>
                                    <th className="transactionTo">To</th>
                                    <th className="transactionAmount">Amount</th>
                                    <th className="transactionStatus">Status</th>
                                </tr>
                                {pending.map((tx, index) => {
                                    return (<TxRow key={index} data={tx} signTx={() => this.signContract(index)} />)
                                })}

                            </tbody>
                        </table>

                    </div>
                    <h1 className="newTrans">New Transaction</h1>
                    <div className="startTrans">
                        <input type="text" className="address" placeholder="Send to Address"

                            value={this.state.address} onChange={this.handleAddress} />
                        <input type="number" className="exchangeAmt" placeholder="Transaction amount (Eth)"
                            value={this.state.exchangeAmt} onChange={this.handleExchangeAmt} />

                        <p className="connected" id="status"></p>
                        <a className="startBtn" onClick={this.startTransaction} href="!#">Start Transaction</a>
                        <p className="connected" id="message"></p>
                    </div>
                </div>
            </div>
        );
    }

    handleExchangeAmt = (event: any) => {
        this.setState({
            exchangeAmt: event.target.value
        });
    }

    handleAddress = (event: any) => {
        this.setState({
            address: event.target.value
        })
    }

    startTransaction = async () => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        const { exchangeAmt, sendAddress } = this.state;
        const threshold = 3;

        const tmp = await startTxInputs(userAddress, exchangeAmt, sendAddress);
        if (tmp !== "") {
            this.setState({
                loadTitle: "Unable to start transaction",
                errorMsg: tmp
            });
            return;
        }

        var txnHash;

        const transactAmt = index.web3.utils.toWei(exchangeAmt, "ether");

        try {
            await index.contract.methods.setupTransaction(sendAddress, threshold, transactAmt).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000',
                value: transactAmt
            })
                .on('transactionHash', (hash: string) => {
                    txnHash = hash;
                    this.setState({ hash: hash });
                });

            await index.contract.methods.setHash(txnHash).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000'
            });
        } catch (err) {
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

    signContract = async (i: number) => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        let msg = "";

        const tmp = await signContractInputs(userAddress, i);
        if (tmp !== "") {
            this.setState({
                loadTitle: "Unable to sign transaction",
                errorMsg: tmp
            });
            return;
        }

        try {
            await index.contract.methods.signTransaction(i).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '3000000000000'
            })
                .on('transactionHash', (hash: string) =>
                    this.setState({ hash: hash }))

                .on('receipt', (rec: any) => {
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
            // hash: this.state.pending[i].txHash,
            msg: msg
        });
    }
}
