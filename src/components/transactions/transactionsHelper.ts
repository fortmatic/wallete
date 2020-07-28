import { web3 } from "../../constants/constants";

export let startTxInputs = async (amount, sendAddress, func) => {
    if (sendAddress === "" || amount === "")
        return "Invalid Inputs";

    const transactAmt = web3.utils.toWei(amount, "ether");

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