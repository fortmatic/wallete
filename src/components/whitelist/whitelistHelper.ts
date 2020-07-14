import React from 'react';

import Blockies from 'react-blockies';
import * as index from '../../index';

export let validateInputs = async (address, acctName, func) => {
    if (address === "" || acctName === "") return "Invalid Inputs";

    let status = await func();

    if (status !== "Added") return status;

    return "";
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
