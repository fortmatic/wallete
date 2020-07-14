// General React libraries
import React, { Component } from 'react';

import * as index from '../../index.js';
import * as constants from '../../constants/constants';
import whitelistStyle from './whitelist.module.scss';
import mainStyle from '../../main.module.scss';

import { Loader } from '../loader/loader.js';
import { validateInputs, getData } from './whitelistHelper';

export default class SignAndAdd extends Component {
    state = {
        address: "",
        name: "",
        loading: false,
        hash: "",
        addedAddress: "",
        errorMsg: "",
        successType: "",
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
                    <td className={whitelistStyle.whitelistBlockie}>{blockie}</td>
                    <td className={whitelistStyle.whitelistName}>{name}</td>
                    <td className={whitelistStyle.whitelistAddress}>{address}</td>
                </tr>
            );
        });
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
        const { address, name } = this.state;

        let tmp = await validateInputs(address, name, async () => {
            return await index.contract.methods.addAddress(address, name).call({
                from: userAddress
            })
        });

        if (tmp !== "") {
            this.setState({
                loadTitle: "Unable to Add Address",
                addedAddress: address,
                errorMsg: tmp
            });
            return;
        }

        try {
            await index.contract.methods.addAddress(address, name).send({
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

    render() {
        const {
            hash,
            addedAddress,
            errorMsg,
            successType,
            loadTitle,
            loading,
            address,
            name
        } = this.state;

        return (
            <div className={mainStyle.main}>
                {loading && <Loader
                    hash={hash}
                    addedAddress={addedAddress}
                    errorMsg={errorMsg}
                    close={this.handleCloseLoad}
                    successType={successType}
                    title={loadTitle}
                />}
                <div className={mainStyle.mainBlueBox}>
                    <div id={whitelistStyle.whitelist}>
                        <h1 className={whitelistStyle.whitelistTitle}>Whitelist</h1>
                        <table className={whitelistStyle.whitelistTable}>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th className={whitelistStyle.whitelistName}>Name</th>
                                    <th className={whitelistStyle.whitelistAddress}>Address</th>
                                </tr>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                    <div className={whitelistStyle.addToWhitelist}>
                        <h1 className={whitelistStyle.addressBox}>Add New Address to Whitelist</h1>
                        <input className={whitelistStyle.address} type="text" placeholder="Enter Address"
                            value={address} onChange={this.handleAddress} />
                        <input className={whitelistStyle.name} type="text" placeholder="Account Name"
                            value={name} onChange={this.handleName} />
                        <p className={whitelistStyle.connected} id="status"></p>
                        <button className={whitelistStyle.addBtn} onClick={this.addToWhiteList} href="!#" >Add Address</button>
                    </div>
                </div>
            </div>
        );
    }
}