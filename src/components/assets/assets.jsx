import React, { Component } from 'react';

import * as index from '../../index.js';
import './assets.css';

import DataTable from 'react-data-table-component';
import Card from '@material-ui/core/Card';

const dataTableStyle = {
    rows: {
        style: {
            maxWidth: '970px', // override the row height
            fontWeight: '700'
        }
    },

    header: {
        style: {
            fontSize: '25px',
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
    }
}

export default class Assets extends Component {
    state = {
        contractAddress: "",
        data: []
    }

    async componentDidMount() {
        this.setState({
            contractAddress: index.contract.options.address
        })
        const balance = await index.contract.methods.contractBalance().call() / Math.pow(10, 18) + " Eth";
        var data = [];
        data.push({
            currency: "Ether",
            amt: balance
        });
        this.setState({
            data: data
        });
    }

    columns = [
        {
            name: 'Assets',
            selector: 'currency',
            sortable: false
        },
        {
            name: 'Balance',
            selector: 'amt',
            sortable: false
        }
    ]

    render() {
        return (
            <div className="main">
                <div className="main-blue-box">
                    {/* <h1 >On Contract {this.state.contractAddress} </h1> */}
                    {/* <table id="table">
                        <thead>
                            <tr>
                                <th>Assets</th>
                                <th>Balance</th>
                            </tr>
                        </thead>
                        <tbody id="list">
                            {this.state.data}
                        </tbody>
                    </table> */}
                    <Card>
                         <DataTable
                            title={"On Contract " + this.state.contractAddress}
                            columns={this.columns}
                            data={this.state.data}
                            customStyles={dataTableStyle} />
                    </Card>
                </div>
            </div>
        );
    }

    // async getData() {
    //     const balance = await index.contract.methods.contractBalance().call() / Math.pow(10, 18) + " Eth";

    //     const element = (
    //         <tr>
    //             <td>Ether</td>
    //             <td>{balance}</td>
    //         </tr>
    //     );

    //     this.setState({ data: element });
    // }
};
