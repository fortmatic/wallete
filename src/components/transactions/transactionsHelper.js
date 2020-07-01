import * as index from '../../index.js';

export let startTxInputs = async (amount, sendAddress, func) => {
    if (sendAddress === "" || amount === "")
        return "Invalid Inputs";

    const transactAmt = index.web3.utils.toWei(amount, "ether");

    const status = await func(transactAmt);

    if (status !== "Transaction Started")
        return status;
    
    return "";
}

export let signContractInputs = async (func) => {
    const status = await func();

    if (status !== "Signed" && status !== "Transaction Completed") return status;

    return "";
}