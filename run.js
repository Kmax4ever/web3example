

const {
    web3Default,
    privateKeyToAccount,
    getPastLogs,
    getPastEvents,
    sendCoin,
    getGasPriceEth,
    getGasPrice,
    isAddress,
    sendContractFunc,
    getBlockNumber,
} = require('./utils')

const BigNumber = require('bignumber.js');
const address = "0xeAa34C776E18A914E2b9064a00ed0E08eF1C69F2";

const dexAddress = '0x7576AfCF790685Ce17C8a6E900E301f63e513041'

const feedPriceAddress = '0x3f67bd254F2c575BBe485ba987f1D78fc9CEaF30'
var contract;


const contractJson = require('./contract/build/contracts/PriceFeed.json')


const privateKey = 'eb1a9ef8c486a6027dcbce8c24ca22ad4fee65d1682c287a43907b9067d34a4a'
const contractAddress = '0x1c0F5F5f0f3270126672E274Af179e2D6a4161A8'
async function initContract() {
    contract = await new web3Default.eth.Contract(contractJson.abi, contractAddress)
}



async function run() {
    try {

        if (!contract) {
            await initContract();
        }

   //     const block = await getBlockNumber();
        //console.log(block);

        // await sendContractFunc(privateKey,
        //     contractAddress,
        //     contract,
        //     'updatePrice',
        // )


        const price = await contract.methods.getPrice('0x1Bf87D4d8049AEd774Fe118971e87a315819e772').call()
        console.log({price});

    } catch (error) {
        console.log(`error`, error.message);
    }
}


// setInterval(async () => {
//     await run()
// }, 3000);


run()