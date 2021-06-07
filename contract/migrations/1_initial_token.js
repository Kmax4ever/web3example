const Ktoken = artifacts.require("Ktoken");
module.exports = async function (deployer) {
    deployer.deploy(Ktoken);
};
