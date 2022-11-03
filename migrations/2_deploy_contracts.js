require('dotenv').config();

const NODEIP1 = web3.utils.fromAscii('10.10.10.10')

const phone0x = artifacts.require("phone0x");

console.log('process.env.ADDR1', process.env.ADDR1)
module.exports = function(deployer) {

  deployer.deploy(phone0x, process.env.ADDR1, '0x31302e31302e31302e3130000000000000000000000000000000000000000000');
};