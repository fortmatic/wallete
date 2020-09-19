// General React libraries
import React, { Component } from 'react';

import { magic, contract } from '../../constants/constants';
import AllowedListStyle from './allowed_list.module.scss';
import mainStyle from '../../main.module.scss';

import { Loader } from '../loader/loader';
import { validateInputs, getData, Entry } from './allowed_list_helper';

interface State {
    address: string
    name: string
    loading: boolean
    hash: string
    addedAddress: string
    errorMsg: string
    successType: string
    loadTitle: string
    data: Array<Entry>
}

export default class SignAndAdd extends Component<{}, State>{
    state = {
        address: "",
        name: "",
        loading: false,
        hash: "",
        addedAddress: "",
        errorMsg: "",
        successType: "",
        loadTitle: 'any',
        data: []
    };

    constructor(props) {
        super(props);

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
            successType: "",
            loadTitle: ""
        });
    }

    renderTableData() {
        return this.state.data.map((row, index) => {
            const { blockie, name, address } = row;
            return (
                <tr key={index}>
                    <td className={AllowedListStyle.allowedListBlockie}>{blockie}</td>
                    <td className={AllowedListStyle.allowedListName}>{name}</td>
                    <td className={AllowedListStyle.allowedListAddress}>{address}</td>
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

    addToAllowedList = async () => {
        this.setState({ loading: true });

        const userAddress = (await magic.user.getMetadata()).publicAddress;
        const { address, name } = this.state;

        let tmp = await validateInputs(address, name, async () => {
            return await contract.methods.addAddress(address, name).call({
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
            await contract.methods.addAddress(address, name).send({
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
                    <div id={AllowedListStyle.allowedList}>
                        <h1 className={AllowedListStyle.allowedListTitle}>Allowed List</h1>
                        <table className={AllowedListStyle.allowedListTable}>
                            <tbody>
                                <tr>
                                    <th></th>
                                    <th className={AllowedListStyle.allowedListName}>Name</th>
                                    <th className={AllowedListStyle.allowedListAddress}>Address</th>
                                </tr>
                                {this.renderTableData()}
                            </tbody>
                        </table>
                    </div>
                    <div className={AllowedListStyle.addToallowedList}>
                        <h1 className={AllowedListStyle.addressBox}>Add New Address to Allowed List</h1>
                        <input className={AllowedListStyle.address} type="text" placeholder="Enter Address"
                            value={address} onChange={this.handleAddress} />
                        <input className={AllowedListStyle.name} type="text" placeholder="Account Name"
                            value={name} onChange={this.handleName} />
                        <p className={AllowedListStyle.connected} id="status"></p>
                        <button className={AllowedListStyle.addBtn} onClick={this.addToAllowedList} >Add Address</button>
                    </div>
                </div>
            </div>
        );
    }
}