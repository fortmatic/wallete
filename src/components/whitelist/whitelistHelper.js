import React from 'react';
    
import Blockies from 'react-blockies';
import * as index from '../../index.js';

export let validateInputs = (address, acctName) => {
    try {
        let message = "Invalid Inputs";
        if (address === "" || acctName === "") throw message;
    }
    catch (err) {
        console.log(err);
        return err;
    }
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
