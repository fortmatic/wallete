// General React components
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// General function libraries
import * as index from './index.js';
import * as handle from './phantom.js';

import DataTable from 'react-data-table-component';

var data = [];
var pending;
var txnHash;


export class Transactions extends Component {
    // async componentDidMount() {
    //     await this.getPending();
    // }

    columns = [
        {
            name: 'Tx hash',
            selector: 'txHash'
        },
        {
            name: 'To',
            selector: 'to'
        },
        {
            name: 'Amount',
            selector: 'amt'
        }
    ]

    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <div id="pending">
                        <DataTable
                            title="Pending Transactions"
                            columns={this.columns}
                            data={data}
                            expandOnRowClicked
                            expandableRows
                            expandableRowsComponent={this.composition}/>
                    </div>
                    <h1 className="head_boxST">New Transaction</h1>

                    <div>
                        <input type="text" id="sendAddress" placeholder="Send to Address" />
                        <input type="number" id="exchangeAmt" placeholder="Transaction amount" />
                        {/* <input type="number" id="threshold" placeholder="Send threshold" /> */}
                        <a className="stTran" onClick={handle.setupTransaction}>Start Transaction</a>
                    </div>
                </div>
            </div>
        );
    }

    composition = async () => {
        
    }

}

export let getPending = async () => {
    pending = await index.contract.methods.getPendingTx().call();
    txnHash = await index.contract.methods.getHashes().call();

    for (let i = 0; i < pending.length; ++i) {
        data.push({
            id: i, txHash: txnHash[i], to: pending[i].txnData.to, amt: pending[i].txnData.amount
        })
    }

    console.log(data);
}