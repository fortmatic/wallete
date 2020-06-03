// General React libraries
import React, { Component } from 'react';

// Blockies library
import Blockies from 'react-blockies';

import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './whitelist.scss';

import { Loader, Buffer } from '../loader/loader.jsx';
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
    }
}

export default class SignAndAdd extends Component {
    state = {
        address: "",
        name: "",
        loading: false,
        hash: "",
        addedAddress: "",
        errorMsg: "",
        data: []
    };

    constructor() {
        super();

        this.myRef = React.createRef();

        this.handleAddress = this.handleAddress.bind(this);
        this.handleName = this.handleName.bind(this);
    }

    async componentDidMount() {
        var pending = await index.contract.methods.getWhitelistAdd().call();
        var data = [];

        for (let i = pending.length - 1; i != -1; --i) {
            var name = pending[i].email;
            var address = pending[i].whiteAdd;
            var icon = <Blockies
                seed={address}
                size={6}
                scale ={6}>
                </Blockies>
            data.push({
                blockie: icon,
                name: name,
                address: address
            });
        }
        this.setState({
            data: data
        });
    }

    columns = [
        {
            name: "",
            selector: "blockie",
            sortable: false,
            width: "70px"
        },
        {
            name: 'Name',
            selector: 'name',
            sortable: true,
            width: "350px"
        },
        {
            name: 'Address',
            selector: 'address',
            sortable: true
        },
    ]

    handleCloseLoad = () => {
        this.setState({
            loading: false,
            hash: "",
            addedAddress: "",
            errorMsg: "",
            sucessType: "",
            loadTitle: ""
        });
    }

    render() {
        return (
            <div className="main">
                {this.state.loading && <Loader
                    hash={this.state.hash}
                    addedAddress={this.state.addedAddress}
                    errorMsg={this.state.errorMsg}
                    close={this.handleCloseLoad}
                    successType={this.state.successType}
                    title={this.state.loadTitle}
                />}
                <div className="main-blue-box">
                    <div id="whitelist">
                        <div>
                            <Card>
                                <DataTable 
                                    title="Whitelist"
                                    columns={this.columns}
                                    data={this.state.data}
                                    customStyles={dataTableStyle}
                                />
                            </Card>
                        </div>
                    </div>
                    <div className="add-to-whitelist">
                        <h1 className = "address-box">Add New Address to Whitelist</h1>
                        <input className="address" type="text" placeholder="Enter Address"
                            value={this.state.address} onChange={this.handleAddress} />
                        <input className="name" type="text" placeholder="Account Name"
                            value={this.state.name} onChange={this.handleName} />
                        <p className="connected" id="status"></p>
                        <a className="add-btn" onClick={this.addToWhiteList} href="!#" >Add Address</a>
                    </div>
                </div>
            </div>
        );
    }


    handleAddress = (event) => {
        this.setState({
            address: event.target.value
        });
    }

    handleName = (event) => {
        this.setState({
            name: event.target.value
        })
    }

    // getWhitelist = async () => {
    //     var whitelist = await index.contract.methods.getWhitelistAdd().call();

    //     var table = this.myRef.current;

    //     for (let i = 0; i < whitelist.length; i++) {
    //         var row = table.insertRow(0);

    //         var icon = blockies.create({
    //             seed: whitelist[i].whiteAdd,
    //             size: 10
    //         });

    //         var logo = row.insertCell(0);
    //         var name = row.insertCell(1);
    //         var address = row.insertCell(2);

    //         logo.appendChild(icon);
    //         name.innerHTML = whitelist[i].email;
    //         address.innerHTML = whitelist[i].whiteAdd;

    //         name.setAttribute("class", "whitelist-Name");
    //         address.setAttribute("class", "whitelist-Address");
    //     }
    // }

    addToWhiteList = async () => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        const address = this.state.address;
        const acctName = this.state.name;

        try {
            let message = "Invalid Inputs";
            if (address === "" || acctName === "") throw message;
        }
        catch (err) {
            console.log(err);
            this.setState({
                loadTitle: "Unable to Add Address",
                addedAddress: address,
                errorMsg: err
            });
            return;
        }

        try {
            const status = await index.contract.methods.addAddress(address, acctName).call({
                from: userAddress
            });

            if (status !== "Added") {
                throw status;
            }

            await index.contract.methods.addAddress(address, acctName).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '3000000000000'
            })
                .on('transactionHash', (hash) =>
                    this.setState({ hash: hash }))

                .on('receipt', (rec) =>
                    this.setState({
                        addedAddress: address,
                        successType: "add"
                    }));

        } catch (err) {
            console.log("error caught");
            console.log(err);
            this.setState({
                loadTitle: "Unable to Add Address",
                addedAddress: address,
                errorMsg: err
            })
        }
    }
}
