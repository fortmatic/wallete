import React from 'react';

import Blockies from 'react-blockies';
import * as index from '../../index.js';

export let validateInputs = async (address, acctName, userAddress) => {
    if (address === "" || acctName === "") throw "Invalid Inputs";

    const status = await index.contract.methods.addAddress(address, acctName).call({
        from: userAddress
    });

    if (status !== "Added") throw status;
}

export let getData = async () => {
    var pending = await index.contract.methods.getWhitelistAdd().call();
    var data = [];

    for (let i = pending.length - 1; i !== -1; --i) {
        var name = pending[i].email;
        var address = pending[i].whiteAdd;
        var icon = <Blockies
            seed={address}
            size={6}
            scale={6}>
        </Blockies>
        data.push({
            blockie: icon,
            name: name,
            address: address
        });
    }

    return data;
}

export let addWhitelistUser = async (address, acctName) => {

}
