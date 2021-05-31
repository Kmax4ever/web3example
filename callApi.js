const axios = require('axios');

const callApi = async (options, timeout) => {
    return axios({
        ...options,
        timeout: timeout || 3000,
    });
};


module.exports = { callApi }