import * as index from '../../index.js';

export let startTxInputs = async (userAddress, amount, sendAddress) => {
    if (sendAddress === "" || amount === "") throw "Invalid Inputs";

    const threshold = 3;
    const transactAmt = index.web3.utils.toWei(amount, "ether");

    const status = await index.contract.methods.setupTransaction(sendAddress, threshold, transactAmt).call({
        from: userAddress,
        value: transactAmt
    });

    if (status !== "Transaction Started") throw status;
}

export let signContractInputs = async (userAddress, i) => {
    const status = await index.contract.methods.signTransaction(i).call({
        from: userAddress
    });

    if (status !== "Signed" && status !== "Transaction Completed") throw status;
}