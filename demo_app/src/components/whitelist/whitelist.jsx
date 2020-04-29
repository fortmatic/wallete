// General React libraries
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

// Blockies library
import blockies from 'ethereum-blockies';

import * as index from '../../index.js';
import './whitelist.css';

export default class SignAndAdd extends Component {
    async componentDidMount() {
        await this.getWhitelist();
    }

    render() {
        return (
            <div className="main">
                <div className="big-block">
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
                                <tbody id="list">
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="row-Input">
                        <input type="text" id="address" placeholder="Enter Address" />
                        <input type="text" id="name" placeholder="Account Name" />
                        <p className="connected" id="status"></p>
                        <a className="other-Btn" onClick={this.addToWhiteList} href="!#" >Add Address</a>
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

            name.setAttribute("class", "whitelist-Name");
            address.setAttribute("class", "whitelist-Address");
        }
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

    Success(datum) {
        document.getElementById("floater").style.display = "block";
        return (
            <div className="loader">
                <h2>Successfully added</h2>
                <p>{datum}</p>
                <a href="!#" className="exit-Load" onClick={() => {
                    ReactDOM.render(<div></div>, document.getElementById('floater'));
                    document.getElementById("floater").style.display = "none";
                }}>Close</a>
            </div>
        );
    }

    Fail(datum, msg) {
        document.getElementById("floater").style.display = "block";
        console.log(msg);
        return (
            <div className="loader" >
                <h2>Unable to Add Address</h2>
                <p>{datum}</p>
                <p>{msg}</p>
                <a href="!#" className="exit-Load" onClick={() => {
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
            let message = "Invalid Inputs";
            if (address === "" || acctName === "") throw message;
        }
        catch (err) {
            console.log(err);
            ReactDOM.render(this.Fail(null, err), document.getElementById('floater'));
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
                    ReactDOM.render(this.Adding(hash), document.getElementById('floater')))

                .on('receipt', (rec) =>
                    ReactDOM.render(this.Success(address), document.getElementById('floater')));

        } catch (err) {
            console.log("error caught");
            console.log(err);
            ReactDOM.render(this.Fail(null, err), document.getElementById('floater'));
        }
    }
}
