const Web3 = require("web3")
const web3Default = new Web3('https://ropsten.infura.io/v3/8a6aa3e1424c42ec9e33ae552c4d9551') //http://178.128.116.31:8545 http://127.0.0.1:7545
const EthUtil = require('ethereumjs-util');
const Transaction = require('ethereumjs-tx')
const utils = require('web3-utils')
const { toBN } = utils;
const privateKeyToAccount = async (privateKey) => {
    //const account = await web3Default.eth.accounts.privateKeyToAccount(privateKey)

    const privateKeyBuffer = EthUtil.toBuffer('0x' + privateKey);
    const publickeyBuffer = EthUtil.privateToPublic(privateKeyBuffer);
    const addressBuffer = EthUtil.pubToAddress(publickeyBuffer);

    const publicKey = '0x' + publickeyBuffer.toString('hex');
    const address = '0x' + addressBuffer.toString('hex')
    const nonce = await getNonce(address);
    const blockNumer = await getBlockNumber(address);
    const balance = await getBalance(address);
    console.log({
        privateKey, publicKey, address, nonce, balance, blockNumer,
    });
    return { privateKey, publicKey, address, balance, nonce }
}

async function getBalance(address) {
    let balance = await web3Default.eth.getBalance(address)
    balance = Web3.utils.fromWei(balance)
    return balance
}

const getNonce = async (address) => {
    return await web3Default.eth.getTransactionCount(address)
}

const getBlockNumber = async () => {
    return await web3Default.eth.getBlockNumber()
}

const getChainId = async () => {
    const chainId = await web3Default.eth.getChainId();
    console.log(chainId);
}

const getPastLogs = async () => {
    const lastBlock = await getBlockNumber();
    const logs = await web3Default.eth.getPastLogs({ fromBlock: 0, toBlock: lastBlock })
    console.log({ logs });
    const events = processLogs(logs)
    console.log(events);
}

const getGasPrice = async () => {
    const gasPrice = await web3Default.eth.getGasPrice()
    console.log({
        gasPrice
    });
}

const getGasPriceEth = async (isFast) => {
    const { callApi } = require('./callApi')
    try {
        const rs = await callApi({
            method: 'get',
            url: 'https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=XCNDZMQTHRCY7TMS9ZBK4U9AZG6V59PWSC',
        });
        if (rs.data) {
            console.log(rs.data.result);
            const { FastGasPrice, ProposeGasPrice } = rs.data.result;
            const gasPriceEther = isFast ? FastGasPrice : ProposeGasPrice;
            let gasPrice = Web3.utils.toWei(
                gasPriceEther.toString(),
                'gwei',
            );
            console.log({ gasPrice });
            return gasPrice
        }
        else {
            return '100000'
        }

    } catch (error) {
        console.log(error);
    }



}

const isAddress = (address) => {
    return web3Default.utils.isAddress(address);
}

const sendTransaction = async (privateKey, to, amount, dataObj) => {
    const { address, nonce, balance } = await privateKeyToAccount(privateKey);

    if (amount && balance < amount) {
        console.log('xxxx ERROR : balance < amount');
    }
    var _amountHex
    if (amount) {
        _amountHex = Web3.utils.toWei(amount.toString())
    }

    let gasPrice = await web3Default.eth.getGasPrice();
    gasPrice = toBN(gasPrice);
    gasPrice = toBN(gasPrice)
        .mul(toBN('11'))
        .div(toBN('10'));



    const txObj = {
        nonce: Web3.utils.toHex(nonce.toString()),
        from: address,
        value: Web3.utils.toHex(_amountHex || 0),
        gasPrice: Web3.utils.toHex(gasPrice),
        gasLimit: Web3.utils.toHex('1000000'),
        to,
    };

    if (dataObj) {
        txObj['data'] = dataObj.encodeABI();
    }

    const bufferPKey = new Buffer(
        privateKey,
        'hex'
    );

    const transaction = new Transaction(txObj);
    transaction.sign(bufferPKey)

    console.log('Senders Address: ' + transaction.getSenderAddress().toString('hex'))
    const raw = '0x' + transaction.serialize().toString('hex');
    const transactionHash = await Web3.utils.sha3(raw);
    console.log({ txObj });
    await web3Default.eth.sendSignedTransaction(raw);
    return transactionHash;

}

const sendCoin = async (privateKey, to, amount) => {

    const txHash = await sendTransaction(privateKey, to, amount)
    console.log({ txHash });

}

const sendContractFunc = async (privateKey, contractAddress, contract, funcName, param) => {
    const BigNumber = require('bignumber.js');
    const priceZoom = Web3.utils.toWei(`100`);
    const dataObj = await contract.methods[funcName]('0x1Bf87D4d8049AEd774Fe118971e87a315819e772', new BigNumber(priceZoom));
    const txHash = await sendTransaction(privateKey, contractAddress, null, dataObj);
    console.log({ txHash });
}






const processLogs = (logs) => {
    const events = [];
    for (const log of logs) {
        const event = decodeLogPair(log);
        if (event) {
            events.push(event);
        }
    }
    return events
}



const json = require('./contract/build/contracts/TokenTest.json')
const decodeLogPair = (log) => {
    try {
        const event = {};

        for (const abi of json.abi) {
            if (abi.type === 'event') {
                const signature = web3Default.eth.abi.encodeEventSignature(abi);
                event[signature] = abi;
            }
        }

        const signature = log.topics[0];
        const eventAbi = event[signature];
        if (!eventAbi) {
            return;
        } else {
            const { inputs, anonymous, name } = eventAbi;
            const hexString = log.data;
            if (!anonymous) {
                log.topics.splice(0, 1);
            }
            const data = web3Default.eth.abi.decodeLog(
                inputs,
                hexString,
                log.topics,
            );

            return {
                address: log.address,
                blockHash: log.blockHash,
                blockNumber: log.blockNumber,
                event: name,
                returnValues: data,
                transactionHash: log.transactionHash,
                transactionIndex: log.transactionIndex,
            };
        }
    } catch (error) {
        console.log(error);
        return;
    }
}


const getPastEvents = async (contract) => {

    const events = await contract.getPastEvents('allEvents', {
        filter: {},
        fromBlock: 0,
        toBlock: 'latest'

    });
    console.log(events);
    return events
}

module.exports = {
    privateKeyToAccount,
    getPastLogs,
    getPastEvents,
    sendCoin,
    sendContractFunc,
    getGasPriceEth,
    getGasPrice,
    isAddress,
    getBlockNumber,
    web3Default
}