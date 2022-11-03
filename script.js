require('dotenv').config();

const Web3 = require('web3');
const Provider = require('@truffle/hdwallet-provider');
const MyContract = require('./build/contracts/phone0x.json');
const { exit } = require('process');

const address = process.env.ADDRESS;
const privateKey = process.env.PRIVATE_KEY;
const infuraUrl = process.env.INFURA_URL;

const ADDR1 = process.env.ADDR1;
const ADDR2 = process.env.ADDR2;
const ADDR3 = process.env.ADDR3;

const init3 = async () => {
  const provider = new Provider(privateKey, infuraUrl); 
  const web3 = new Web3(provider);
  const networkId = await web3.eth.net.getId();
  const myContract = new web3.eth.Contract(
    MyContract.abi,
    MyContract.networks[networkId].address
  );

  const NODEIP1 = web3.utils.fromAscii('10.10.10.10')
  const NODEIP2 = web3.utils.fromAscii('20.20.20.20')
  const NODEIP3 = web3.utils.fromAscii('30.30.30.30')
  
    var nodeIP = await myContract.methods.getNodeIP(ADDR3).call({ from: address });
    console.log(`Old data value: ${web3.utils.toAscii(nodeIP)}`);
  
    var receipt1 = await myContract.methods.addNode(ADDR3, NODEIP3).send({ from: address });
    console.log(`Transaction hash: ${receipt1.transactionHash}`);
  
    var nodeIP = await myContract.methods.getNodeIP(ADDR3).call({ from: address });
    console.log(`New data value: ${web3.utils.toAscii(nodeIP)}`);

    var countCDRsByUser = await myContract.methods.getCDRsCountByUser(ADDR1).call({ from: address });
    console.log(`Count CDRs for user: ${ADDR1} ${countCDRsByUser}`);

    receipt1 = await myContract.methods.writeCDR(ADDR1,ADDR2, Date.now(), '100', ADDR1, ADDR3).send({ from: address });
    console.log(`Transaction hash: ${receipt1.transactionHash}`);
  
    var countCDRsByUser = await myContract.methods.getCDRsCountByUser(ADDR1).call({ from: address });
    console.log(`added 1 CDR: ${countCDRsByUser}`);
   
  process.exit()
}  

init3();

