import { validateInputs } from '../../src/components/whitelist/whitelistHelper';

test("invalid inputs for validateInputs", async () => {
    await expect(validateInputs("", "", "")).resolves.toMatch("Invalid Inputs");
});

test("invalid address for validateInputs", async () => {
    await expect(validateInputs("", "helen", "0x575c24a1cf017179059a1CbF532A7a8f8AeE80a8")).resolves.toMatch("Invalid Inputs");
});

test("invalid name for validateInputs", async () => {
    await expect(validateInputs("0x7Be413F5E12B51AD68a09f90d4A3E544DF5B7720", "", "0x575c24a1cf017179059a1CbF532A7a8f8AeE80a8")).resolves.toMatch("Invalid Inputs");
});
