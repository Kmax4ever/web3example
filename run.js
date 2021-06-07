

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
    fromWei,
    toWei,
    contractCall
} = require('./utils')

const BigNumber = require('bignumber.js');
const address = "0xeAa34C776E18A914E2b9064a00ed0E08eF1C69F2";

const dexAddress = '0x7576AfCF790685Ce17C8a6E900E301f63e513041'

const feedPriceAddress = '0x3f67bd254F2c575BBe485ba987f1D78fc9CEaF30'
var contract;


const contractJson = require('./contract/build/contracts/Ktoken.json');
//0x1c0F5F5f0f3270126672E274Af179e2D6a4161A8 price feed
// 0x87b2624c4127fb377cC3388900fF16331D784beC token
// 

const privateKey = 'eb1a9ef8c486a6027dcbce8c24ca22ad4fee65d1682c287a43907b9067d34a4a'
const contractAddress = contractJson.networks[3].address
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





        // const BigNumber = require('bignumber.js');
        // const amountZoom = toWei('5')
        // const amountParam = new BigNumber(amountZoom)
        // const param = ["0x0E7e98f828795e96F06d21562000563fa6B03a4D", amountParam];

        // await sendContractFunc(privateKey,
        //     contractAddress,
        //     contract,
        //     'mint',
        //     [...param]
        // )


        //tranferFrom

        const BigNumber = require('bignumber.js');
        const amountZoom = toWei('99')
        const amountParam = new BigNumber(amountZoom)
        const param = ["0x9991f5905fFf34B0Cbe99709bad099404889d460", amountParam];

        await sendContractFunc(privateKey,
            contractAddress,
            contract,
            'mint',
            [...param]
        )

        const balance = await contractCall(contract, `balanceOf`, ["0x9991f5905fFf34B0Cbe99709bad099404889d460"]);
        console.log({ balance: fromWei(balance) });


        // const balanceApprove = await contractCall(contract, `allowance`, ["0x1Bf87D4d8049AEd774Fe118971e87a315819e772", "0x0E7e98f828795e96F06d21562000563fa6B03a4D"]);
        // console.log({ balanceApprove: fromWei(balanceApprove) });





    } catch (error) {
        console.log(`error`, error.message);
    }
}


// setInterval(async () => {
//     await run()
// }, 3000);


run()