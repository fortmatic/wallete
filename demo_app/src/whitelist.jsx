import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as index from './index.js';

export default class SignAndAdd extends Component {
    async componentDidMount() {
        this.getWhitelist();
    }

    render() {
        return (
            <div className="main">
                <div className="bigBlock">
                    <div id="whitelist">
                        <div className="head_box">
                            <h1 id="thing"> Addresses on Whitelist</h1>
                        </div>
                        <div>
                            <table id="table">
                                <thead>
                                    <tr>
                                        <th className="whitelistName">Name</th>
                                        <th className="whitelistAddress">Address</th>
                                    </tr>
                                </thead>
                                <tbody id="list">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div id="addAddress">
                        <input type="text" id="address" placeholder="Enter Address" />
                        <input type="text" id="name" placeholder="Account Name" />
                    </div>
                    <a className="otherBtn" onClick={this.addToWhiteList}>Add Address to the Whitelist</a>
                    <br></br>
                </div>
            </div>
        );
    }

    getWhitelist = async () => {
        var whitelist = await index.contract.methods.getWhitelistAdd().call();

        var table = document.getElementById("list");

        for (let i = 0; i < whitelist.length; i++) {
            var row = table.insertRow(0);

            var name = row.insertCell(0);
            var address = row.insertCell(1);

            name.innerHTML = whitelist[i].email;
            address.innerHTML = whitelist[i].whiteAdd;

            name.setAttribute("class", "whitelistName");
            address.setAttribute("class", "address");
        }
    }

    addToWhiteList = async () => {
        const userAddress = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const address = document.getElementById('address').value;
        const acctName = document.getElementById('name').value;

        await index.contract.methods.addAddress(address, acctName).send({
            from: userAddress,
            gas: 1500000,
            gasPrice: '3000000000000'
        })
            .on('receipt', (rec) => {
                console.log(rec);
                document.getElementById('status').innerHTML = address + " added to Whitelist";
            });
    }
}