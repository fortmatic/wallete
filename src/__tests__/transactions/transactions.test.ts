import { startTxInputs, signContractInputs } from "../../components/transactions/transactionsHelper";

// START TX TESTS
test("invalid inputs for startTxInputs", async () => {
    await expect(startTxInputs("", "", () => { })).resolves.toMatch("Invalid Inputs");
});

test("invalid sendAddress for startTxInputs", async () => {
    await expect(startTxInputs("4", "", () => { })).resolves.toMatch("Invalid Inputs");
});

test("invalid amount for startTxInputs", async () => {
    await expect(startTxInputs("", "0x575c24a1cf017179059a1CbF532A7a8f8AeE80a8", () => { })).resolves.toMatch("Invalid Inputs");
});

test("sending to address not on whitelist", async () => {
    const status = await startTxInputs("4", "address", () => {
        return "This address is not on the whitelist";
    });

    expect(status).toMatch("This address is not on the whitelist");
});

test("sending to address successfully", async () => {
    const status = await startTxInputs("4", "address", () => {
        return "Transaction Started";
    });

    expect(status).toMatch("");
});

// SIGN TX TESTS
test("sign Tx success", async () => {
    const status = await signContractInputs(() => {
        return "Signed";
    });

    expect(status).toMatch("");
});

test("transfer Tx success", async () => {
    const status = await signContractInputs(() => {
        return "Transaction Completed";
    });

    expect(status).toMatch("");
});

test("tx already sent", async () => {
    const status = await signContractInputs(() => {
        return "Transaction has already been sent";
    });

    expect(status).toMatch("Transaction has already been sent");
});

test("address not on whitelist", async () => {
    const status = await signContractInputs(() => {
        return "This address is not on the whitelist";
    });

    expect(status).toMatch("This address is not on the whitelist");
});

test("address already signed", async () => {
    const status = await signContractInputs(() => {
        return "This address has already signed the transaction";
    });

    expect(status).toMatch("This address has already signed the transaction");
});