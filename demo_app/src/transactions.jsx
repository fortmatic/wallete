// General React components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// General function libraries
import * as index from './index.js';

// Libraries for table
import DataTable, { createTheme } from 'react-data-table-component';
import Card from '@material-ui/core/Card';

var data = [];
var pending;

createTheme('Fortmatic', {
    text: {
        primary: '#268bd2',
        secondary: '#2aa198',
    },
    background: {
        default: 'rgb(231, 236, 242)',
    },
    context: {
        background: '#cb4b16',
        text: '#FFFFFF',
    },
    divider: {
        default: '#073642',
    },
    action: {
        button: 'rgba(0,0,0,.54)',
        hover: 'rgba(0,0,0,.08)',
        disabled: 'rgba(0,0,0,.12)',
    },
});

const style = {
    rows: {
        style: {
            maxWidth: '1033px', // override the row height
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

export class Transactions extends Component {
    componentWillUnmount() {
        data = [];
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

    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <div id="pending">
                        <Card>
                            <DataTable
                                title="Transactions"
                                columns={this.columns}
                                data={data}
                                expandOnRowClicked
                                //theme="Fortmatic"
                                customStyles={style}
                                highlightOnHover
                                expandableRows
                                expandableRowsComponent={<this.composition />} />
                        </Card>
                    </div>
                    <h1 className="head_boxST">New Transaction</h1>
                    <div>
                        <input type="text" id="address" placeholder="Send to Address" />
                        <input type="number" id="exchangeAmt" placeholder="Transaction amount (Eth)" />
                        {/* <input type="number" id="threshold" placeholder="Send threshold" /> */}
                        <p className="connected" id="status"></p>
                        <a className="stTran" onClick={this.startTransaction}>Start Transaction</a>
                        <p className = "connected" id = "message"></p>
                    </div>
                </div>
            </div>
        );
    }

    composition = ({ data }) => {
        const index = data.id;
        const link = "https://rinkeby.etherscan.io/tx/" + pending[index].txHash;

        if (pending[index].complete) {
            return (
                <div className="compostion">
                    <p>Transaction Hash: {pending[index].txHash}</p>
                    <p>From: {pending[index].from}</p>
                    <p>To: {pending[index].to}</p>
                    <a href={link}>View on Etherscan</a>
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
                <a href={link}>View on Etherscan</a>
                <br></br>
                <br></br>
                <button onClick={() => this.signContract(index)}>Sign Transaction</button>
                <p id="status"></p>
            </div>
        );
    }

    startTransaction = async () => {
        const userAddress = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const amount = document.getElementById('exchangeAmt').value;
        const sendAddress = document.getElementById('address').value;
        //const threshold = document.getElementById('threshold').value;
        const threshold = 3;

        console.log(amount);
        var txnHash;

        const transactAmt = index.web3.utils.toWei(amount, "ether");
        console.log(transactAmt);

        document.getElementById('message').innerHTML = "Starting transaction...";

        await index.contract.methods.setupTransaction(sendAddress, threshold, transactAmt).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '30000000000',
            value: transactAmt
        })
            .on('receipt', (rec) => {
                console.log(rec);
                txnHash = rec.transactionHash;
            });

        await index.contract.methods.setHash(txnHash).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '30000000000'
        }).on('receipt', () => {
            document.getElementById('message').innerHTML = "Transaction started: " + amount + " Eth to " + sendAddress;
        });
    }

    signContract = async (i) => {
        const userAddress = (await index.fmPhantom.user.getMetadata()).publicAddress;

        document.getElementById('status').innerHTML = "Signing transaction...";

        await index.contract.methods.signTransaction(i).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '3000000000000'
        })
            .on('receipt', (rec) => {
                console.log(rec);
                if (rec.events.transactionOccured != null) {
                    document.getElementById('status').innerHTML = "Transacted " + rec.events.transactionOccured.returnValues[1] / Math.pow(10, 18) + " Eth"
                        + " to " + rec.events.transactionOccured.returnValues[0];
                }
                else {
                    document.getElementById('status').innerHTML = rec.events.SignedTransact.returnValues[0] + " signed transaction";
                }
            });
    }
}

export let getPending = async () => {
    pending = await index.contract.methods.getTransactions().call();
    console.log(pending);

    for (let i = 0; i < pending.length; ++i) {
        data.push({
            id: pending[i].nonceTrans,
            txHash: pending[i].txHash,
            to: pending[i].to,
            amt: pending[i].amount / Math.pow(10, 18) + " Eth",
            status: (pending[i].complete) ? 'Done' : "Pending"
        });
    }

    console.log(data);
}
