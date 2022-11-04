require('dotenv').config();

const NODEIP1 = web3.utils.fromAscii('10.10.10.10')

const phone0x = artifacts.require("phone0x");

module.exports = function(deployer) {

  deployer.deploy(phone0x, process.env.ADDR1, NODEIP1);
};