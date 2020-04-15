// General React libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Blockies library
import blockies from 'ethereum-blockies';

import * as index from '../index.js';
import './whitelist.css';

export default class SignAndAdd extends Component {
    async componentDidMount() {
        await this.getWhitelist();
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
                                        <th></th>
                                        <th className="whitelistName">Name</th>
                                        <th className="whitelistAddress">Address</th>
                                    </tr>
                                </thead>
                                <tbody id="list">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="rowInput">
                        <input type="text" id="address" placeholder="Enter Address" />
                        <input type="text" id="name" placeholder="Account Name" />
                        <p className="connected" id="status"></p>
                        <a className="otherBtn" onClick={this.addToWhiteList}>Add Address</a>
                    </div>
                </div>
            </div>
        );
    }

    getWhitelist = async () => {
        var whitelist = await index.contract.methods.getWhitelistAdd().call();

        var table = document.getElementById("list");

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

            name.setAttribute("class", "whitelistName");
            address.setAttribute("class", "whitelistAddress");
        }
    }

    Adding(success) {
        document.getElementById("floater").style.display = "block";
        if (success == null) {
            return (
                <div className="loader">
                    <h2>Transacting on Blockchain</h2>
                    <div className="spinner"></div>
                </div>
            );
        }

        return (
            <div className="loader">
                <h2>Unable to Add Address</h2>
                <p>{success}</p>
                <a className="exitLoad" onClick={() => {
                    ReactDOM.render(<div></div>, document.getElementById('floater'));
                    document.getElementById("floater").style.display = "none";
                }}>Close</a>
            </div>
        );
    }

    addToWhiteList = async () => {
        ReactDOM.render(this.Adding(null), document.getElementById('floater'));

        const userAddress = (await index.fmPhantom.user.getMetadata()).publicAddress;
        const address = document.getElementById('address').value;
        const acctName = document.getElementById('name').value;

        try {
            await index.contract.methods.addAddress(address, acctName).send({
                from: userAddress,
                gas: 1500000,
                gasPrice: '3000000000000'
            })
                .on('receipt', (rec) => {
                    document.getElementById('status').innerHTML = address + " added to Whitelist";
                })

        } catch (err) {
            console.log("error caught");
            const fail = "Error Occured";
            ReactDOM.render(this.Adding(fail), document.getElementById('floater'));
        }
    }
}
