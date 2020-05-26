const MultiSig = artifacts.require("MultiSig");

module.exports = function (deployer) {
    deployer.deploy(MultiSig);
};
