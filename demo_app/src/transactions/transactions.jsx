// General React components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// General function libraries
import * as index from '../index.js';
import './transactions.css';
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
                        <a className="stTran" onClick={this.startTransaction} href="!#">Start Transaction</a>
                        <p className="connected" id="message"></p>
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

    Adding(datum) {
        document.getElementById("floater").style.display = "block";
        if (datum == null) {
            return (
                <div className="loader">
                    <h2>Transacting on Blockchain</h2>
                    <div className="spinner"></div>
                </div>
            );
        } else {
            return (
                <div className="loader">
                    <h2>Transacting on Blockchain</h2>
                    <p >Hash is {datum}</p>
                    <div className="spinner"></div>
                </div>
            );
        }
    }

    Fail(title, datum, msg) {
        document.getElementById("floater").style.display = "block";
        console.log(msg);
        return (
            <div className="loader" >
                <h2>{title}</h2>
                <p>{datum}</p>
                <p>{msg}</p>
                <a href="!#" className="exitLoad" onClick={() => {
                    ReactDOM.render(<div></div>, document.getElementById('floater'));
                    document.getElementById("floater").style.display = "none";
                }}>Close</a>
            </div>
        );
    }

    SuccessStart(address, amount, txnHash) {
        document.getElementById("floater").style.display = "block";
        const link = "https://rinkeby.etherscan.io/tx/" + txnHash;

        return (
            <div className="loader">
                <h2>Successfully Started Transaction</h2>
                <p>To: {address}</p>
                <p>Amount: {amount}</p>
                <a href={link}>View on EtherScan</a>
                <a href="!#" className="exitLoad" onClick={() => {
                    ReactDOM.render(<div></div>, document.getElementById('floater'));
                    document.getElementById("floater").style.display = "none";
                }}>Close</a>
            </div>
        );
    }

    startTransaction = async () => {
        ReactDOM.render(this.Adding(null), document.getElementById('floater'));

        const userAddress = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const amount = document.getElementById('exchangeAmt').value;
        const sendAddress = document.getElementById('address').value;
        //const threshold = document.getElementById('threshold').value;
        const threshold = 3;

        try {
            if (sendAddress == "" || amount == "") throw "Invalid Inupts";
        }
        catch (err) {
            console.log(err);
            ReactDOM.render(this.Fail("Unable to start transaction", null, err), document.getElementById('floater'));
            return;
        }

        console.log(amount);
        var txnHash;

        const transactAmt = index.web3.utils.toWei(amount, "ether");
        console.log(transactAmt);

        try {
            await index.contract.methods.setupTransaction(sendAddress, threshold, transactAmt).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000',
                value: transactAmt
            })
                .on('transactionHash', (hash) => {
                    txnHash = hash;
                    ReactDOM.render(this.Adding(hash), document.getElementById('floater'));
                });

            await index.contract.methods.setHash(txnHash).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '30000000000'
            });
        } catch (err) {
            console.log("error caught");
            console.log(err);
            const fail = "Something went wrong on Blockchain";
            ReactDOM.render(this.Fail("Unable to start transaction", null, fail), document.getElementById('floater'));
            return;
        }

        ReactDOM.render(this.SuccessStart(sendAddress, amount, txnHash), document.getElementById('floater'));
    }

    SuccessSigned(txnHash, msg) {
        document.getElementById("floater").style.display = "block";

        return (
            <div className="loader">
                <h2>Successfully Signed Transaction</h2>
                <p>Hash: {txnHash}</p>
                <p>{msg}</p>
                <a href="!#" className="exitLoad" onClick={() => {
                    ReactDOM.render(<div></div>, document.getElementById('floater'));
                    document.getElementById("floater").style.display = "none";
                }}>Close</a>
            </div>
        );
    }

    signContract = async (i) => {
        ReactDOM.render(this.Adding(null), document.getElementById('floater'));

        const userAddress = (await index.fmPhantom.user.getMetadata()).publicAddress;
        let msg = "";

        try {
            await index.contract.methods.signTransaction(i).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '3000000000000'
            })
                .on('transactionHash', (hash) =>
                    ReactDOM.render(this.Adding(hash), document.getElementById('floater')))

                .on('receipt', (rec) => {
                    console.log(rec);
                    if (rec.events.transactionOccured != null) {
                        msg = "Transaction completed";
                    }
                });
        } catch (err) {
            console.log("error caught");
            console.log(err);
            const fail = "Something went wrong on Blockchain";
            ReactDOM.render(this.Fail("Unable to sign transaction", null, fail), document.getElementById('floater'));
            return;
        }

        ReactDOM.render(this.SuccessSigned(data[i].txHash, msg), document.getElementById('floater'));
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
