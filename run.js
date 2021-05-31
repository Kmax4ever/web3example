

const {
    web3Default,
    privateKeyToAccount,
    getPastLogs,
    getPastEvents,
    sendCoin,
    getGasPriceEth,
    getGasPrice,
    isAddress
} = require('./utils')

const address = "0x9991f5905fFf34B0Cbe99709bad099404889d460";
const privateKey = '12389a6ba70dc5fefc704b00c70ed201b2595bfb5871658e5d60bc0e192c8dac'
const dexAddress = '0x7576AfCF790685Ce17C8a6E900E301f63e513041'
var drkWrapContract;
var dexContract;

const wrapContractJson = require('./contracts/WrappedToken.json')
const dexJson = require('./contracts/Dex.json')


async function initContract() {
    drkWrapContract = new web3Default.eth.Contract(wrapContractJson.abi, '0x64bff95579a6a6ef81aad0e3aea06ebba6207270');
    dexContract = new web3Default.eth.Contract(dexJson.abi, dexAddress)
}




async function start() {
    //  await initContract();
    // await privateKeyToAccount(privateKey)
    // await getPastLogs()
    // await getPastEvents(dexContract)
   // await sendCoin(privateKey, '0x1Bf87D4d8049AEd774Fe118971e87a315819e772', 10);
//    await getGasPriceEth(true)
//    await getGasPrice()
   console.log(isAddress(address));
}


start()