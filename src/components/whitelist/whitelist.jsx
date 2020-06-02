// General React libraries
import React, { Component } from 'react';

// Blockies library
import blockies from 'ethereum-blockies';

import * as index from '../../index.js';
import * as constants from '../../constants/constants.js';
import './whitelist.scss';

import Loader from '../loader/loader.jsx';

export default class SignAndAdd extends Component {
    state = {
        address: "",
        name: "",
        loading: false,
        hash: "",
        addedAddress: "",
        errorMsg: ""
    };

    constructor() {
        super();

        this.myRef = React.createRef();

        this.handleAddress = this.handleAddress.bind(this);
        this.handleName = this.handleName.bind(this);
    }

    async componentDidMount() {
        await this.getWhitelist();
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
                        <div className="head-box">
                            <h1 id="thing"> Addresses on Whitelist</h1>
                        </div>
                        <div>
                            <table id="table">
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th className="whitelist-Name">Name</th>
                                        <th className="whitelist-Address">Address</th>
                                    </tr>
                                </thead>
                                <tbody ref={this.myRef}>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row-Input">
                        <h1 className = "new-add-box">Add New Address to Whitelist</h1>
                        <input className="address" type="text" placeholder="Enter Address"
                            value={this.state.address} onChange={this.handleAddress} />
                        <input className="name" type="text" placeholder="Account Name"
                            value={this.state.name} onChange={this.handleName} />
                        <p className="connected" id="status"></p>
                        <a className="other-Btn" onClick={this.addToWhiteList} href="!#" >Add Address</a>
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

    getWhitelist = async () => {
        var whitelist = await index.contract.methods.getWhitelistAdd().call();

        var table = this.myRef.current;

        for (let i = 0; i < whitelist.length; i++) {
            var row = table.insertRow(0);

            var icon = blockies.create({
                seed: whitelist[i].whiteAdd,
                size: 10
            });

            var logo = row.insertCell(0);
            var name = row.insertCell(1);
            var address = row.insertCell(2);

            logo.appendChild(icon);
            name.innerHTML = whitelist[i].email;
            address.innerHTML = whitelist[i].whiteAdd;

            name.setAttribute("class", "whitelist-Name");
            address.setAttribute("class", "whitelist-Address");
        }
    }

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
