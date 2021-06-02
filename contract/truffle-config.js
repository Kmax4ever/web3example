
var HDWalletProvider = require("truffle-hdwallet-provider")
const mnemonic='poem debris robot when energy throw trap rule demise security exclude very'

module.exports = {


  networks: {

    development: {
     host: "127.0.0.1",     // Localhost (default: none)
     port: 7545,            // Standard Ethereum port (default: none)
     network_id: "*",       // Any network (default: none)
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/8a6aa3e1424c42ec9e33ae552c4d9551")
      },
      network_id: "*",
      gas: 4700000,
			gasPrice: 100000000000
    }
    
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },


  compilers: {
    solc: {
       version: "0.8.0",    // Fetch exact version from solc-bin (default: truffle's version)
     
    }
  },

  

  db: {
    enabled: false
  }
};
