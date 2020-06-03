// General React components
import React, { Component } from 'react';

// General function libraries
import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './transactions.scss';
// Libraries for table
import DataTable from 'react-data-table-component';
import Card from '@material-ui/core/Card';

import { Loader } from '../loader/loader.jsx';

const dataTableStyle = {
    rows: {
        style: {
            maxWidth: '970px', // override the row height
            fontWeight: '700'
        }
    },

    header: {
        style: {
            fontSize: '30px',
            fontWeight: 700
        }
    },

    headCells: {
        style: {
            fontSize: '20px',
            fontWeight: 700
        }
    },

    cells: {
        style: {
            fontSize: '20px',
            fontWeight: 700
        }
    },

    expanderRow: {
        style: {
            fontSize: '15px',
            fontWeight: 700,
            paddingLeft: '65px'
        }
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
        var pending = await index.contract.methods.getTransactions().call();
        var data = [];

        for (let i = pending.length - 1; i !== -1; --i) {
            data.push({
                id: pending[i].nonceTrans,
                txHash: pending[i].txHash,
                to: pending[i].to,
                amt: pending[i].amount / Math.pow(10, 18) + " Eth",
                status: (pending[i].complete) ? 'Done' : "Pending"
            });
        }

        this.setState({ data: data, pending: pending });
    }

    columns = [
        {
            name: 'Tx hash',
            selector: 'txHash',
            sortable: false
        },
        {
            name: 'To',
            selector: 'to',
            sortable: true
        },
        {
            name: 'Amount',
            selector: 'amt',
            sortable: true
        },
        {
            name: 'Status',
            selector: 'status',
            sortable: false
        }
    ]

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
                        <Card>
                            <DataTable
                                title="Transactions"
                                columns={this.columns}
                                data={this.state.data}
                                expandOnRowClicked
                                customStyles={dataTableStyle}
                                highlightOnHover
                                expandableRows
                                expandableRowsComponent={<this.composition />} />
                        </Card>
                    </div>
                    <h1 className="new-trans">New Transaction</h1>
                    <div className = "start-trans">
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

    composition = ({ data }) => {
        var pending = this.state.pending;
        const index = data.id;
        const link = "https://rinkeby.etherscan.io/tx/" + pending[index].txHash;

        if (pending[index].complete) {
            return (
                <div className="compostion">
                    <p>Transaction Hash: {pending[index].txHash}</p>
                    <p>From: {pending[index].from}</p>
                    <p>To: {pending[index].to}</p>
                    <a href={link} className = "link-btn" target = "_blank" rel="noopener noreferrer">View on Etherscan</a>
                    <p id="status">Tx has been sent</p>
                </div>
            );
        }

        return (
            <div className="compostion">
                <p>Transaction Hash: {pending[index].txHash}</p>
                <p>From: {pending[index].from}</p>
                <p>To: {pending[index].to}</p>
                <p>Number of Signatures: {pending[index].numSigs}/{pending[index].threshold}</p>
                <a href={link} className = "link-btn" target = "_blank" rel="noopener noreferrer">View on Etherscan</a>
                <br></br>
                <br></br>
                <button onClick={() => this.signContract(index)} className = "sign-btn">Sign Transaction</button>
                <p id="status"></p>
            </div>
        );
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
