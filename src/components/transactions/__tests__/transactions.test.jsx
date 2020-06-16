import { startTxInputs } from "../transactionsHelper";

test("invalid inputs for startTxInputs", async () => {
    await expect(startTxInputs("", "", "")).resolves.toMatch("Invalid Inputs");
});

test("invalid sendAddress for startTxInputs", async () => {
    await expect(startTxInputs("0x575c24a1cf017179059a1CbF532A7a8f8AeE80a8", "4", "")).resolves.toMatch("Invalid Inputs");
});

test("invalid amount for startTxInputs", async () => {
    await expect(startTxInputs("0x575c24a1cf017179059a1CbF532A7a8f8AeE80a8", "", "0x575c24a1cf017179059a1CbF532A7a8f8AeE80a8")).resolves.toMatch("Invalid Inputs");
});