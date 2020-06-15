import validateInputs from './../whitelistHelper';

describe("invalid inputs", () => {
    it("validates the inputs for adding to whitelist", () => {
        let message = "Invalid Inputs";

        expect(validateInputs("", "")).toEqual(message);
    });
});

describe("valid inputs", () => {
    it("validates the inputs for adding to whitelist", () => {
        let message = "";

        expect(validateInputs("0x7Be413F5E12B51AD68a09f90d4A3E544DF5B7720", "helen")).toEqual(message);
    });
});

describe("valid address and invalid name", () => {
    it("validates the inputs for adding to whitelist", () => {
        let message = "Invalid Inputs";

        expect(validateInputs("0x7Be413F5E12B51AD68a09f90d4A3E544DF5B7720", "")).toEqual(message);
    });
});

describe("invalid address and valid name", () => {
    it("validates the inputs for adding to whitelist", () => {
        let message = "Invalid Inputs";

        expect(validateInputs("", "helen")).toEqual(message);
    });
});