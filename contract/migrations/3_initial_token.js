const TokenTest = artifacts.require("TokenTest");
module.exports = async function (deployer) {
 const token= await deployer.deploy(TokenTest);
// await token.mint("0x1Bf87D4d8049AEd774Fe118971e87a315819e772", "100000000000000000000");
 console.log("Minting complete");
};
