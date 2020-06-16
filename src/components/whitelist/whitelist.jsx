// General React libraries
import React, { Component } from 'react';

import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './whitelist.scss';

import { Loader } from '../loader/loader.jsx';
import { validateInputs, getData } from './whitelistHelper.js';

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
        const data = await getData();

        this.setState({
            data: data
        });
    }

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

    renderTableData() {
        return this.state.data.map((row, index) => {
            const { blockie, name, address } = row;
            return (
                <tr key={index}>
                    <td className="whitelist-Blockie">{blockie}</td>
                    <td className="whitelist-Name">{name}</td>
                    <td className="whitelist-Address">{address}</td>
                </tr>
            );
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
                        <h1 className="whitelist-title">Whitelist</h1>
                        <table className="whitelist-table">
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th className="whitelist-Name">Name</th>
                                    <th className="whitelist-Address">Address</th>
                                </tr>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                    <div className="add-to-whitelist">
                        <h1 className="address-box">Add New Address to Whitelist</h1>
                        <input className="address" type="text" placeholder="Enter Address"
                            value={this.state.address} onChange={this.handleAddress} />
                        <input className="name" type="text" placeholder="Account Name"
                            value={this.state.name} onChange={this.handleName} />
                        <p className="connected" id="status"></p>
                        <button className="add-btn" onClick={this.addToWhiteList} href="!#" >Add Address</button>
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

    addToWhiteList = async () => {
        this.setState({ loading: true });

        const userAddress = (await constants.magic.user.getMetadata()).publicAddress;
        const address = this.state.address;
        const acctName = this.state.name;

        const tmp = await validateInputs(address, acctName, userAddress);

        if (tmp !== "") {
            this.setState({
                loadTitle: "Unable to Add Address",
                addedAddress: address,
                errorMsg: tmp
            });
            return;
        }

        try {
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