function validateInputs(address, acctName) {
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

export default validateInputs;