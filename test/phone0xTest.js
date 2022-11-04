require('dotenv').config();

const phone0x = artifacts.require('phone0x.sol');

const ADDR1 = process.env.ADDR1;
const ADDR2 = process.env.ADDR2;
const ADDR3 = process.env.ADDR3;

const NODEIP1 = web3.utils.fromAscii('10.10.10.10')
const NODEIP2 = web3.utils.fromAscii('20.20.20.20')
const NODEIP3 = web3.utils.fromAscii('30.30.30.30')

const USER1 = web3.utils.fromAscii('sip-user1@password1')
const USER2 = web3.utils.fromAscii('sip-user2@password2')
const USER3 = web3.utils.fromAscii('sip-user3@password3')

contract('phone0x', () => {
    it('Should add a new voip node', async () => {
        const storage = await phone0x.new(ADDR1, NODEIP1);
        await storage.addNode(ADDR2, NODEIP2);
        await storage.addNode(ADDR3, NODEIP3);
        const data2 = await storage.getNodeIP(ADDR2);
        console.log('getNodeIP of', ADDR2,': ', web3.utils.toAscii(data2));
     
        assert((data2.toString()).length > 0);
        
    });

    it('Should remove a voip node', async () => {
        const storage = await phone0x.new(ADDR1, NODEIP1);
        await storage.addNode(ADDR2, NODEIP2);
        await storage.addNode(ADDR3, NODEIP3);
     
        var nodeIP1 = await storage.getNodeIP(ADDR1);
        var nodeIP2 = await storage.getNodeIP(ADDR2);
        var nodeIP3 = await storage.getNodeIP(ADDR3);

        console.log('nodeIP1', web3.utils.toAscii(nodeIP1), 'nodeIP2', web3.utils.toAscii(nodeIP2), 'nodeIP3', web3.utils.toAscii(nodeIP3));

        console.log('remove node',ADDR2 );
        await storage.removeNode(ADDR2);

        nodeIP1 = await storage.getNodeIP(ADDR1);
        nodeIP2 = await storage.getNodeIP(ADDR2);
        nodeIP3 = await storage.getNodeIP(ADDR3);
        console.log('nodeIP1', web3.utils.toAscii(nodeIP1), 'nodeIP2', web3.utils.toAscii(nodeIP2), 'nodeIP3', web3.utils.toAscii(nodeIP3));

        assert(nodeIP2 == 0);

        console.log('add node');
        await storage.addNode(ADDR2, NODEIP2);

        nodeIP2 = await storage.getNodeIP(ADDR2);        
        console.log('nodeIP1', web3.utils.toAscii(nodeIP1), 'nodeIP2', web3.utils.toAscii(nodeIP2), 'nodeIP3', web3.utils.toAscii(nodeIP3));
     
        assert(nodeIP2 != 0);
        
    });

    it('Should get a random IP', async () => {
        const storage = await phone0x.new(ADDR1, NODEIP1);
        await storage.addNode(ADDR2, NODEIP2);
        await storage.addNode(ADDR3, NODEIP3);
        const data1 = await storage.getRandomNodeIP();
        console.log('getRandomNodeIP', web3.utils.toAscii(data1));
     
        assert((data1.toString()).length > 0);
        
    });

    it('Should write a CDR', async () => {
        const storage = await phone0x.new(ADDR1, NODEIP1);
        await storage.addNode(ADDR2, NODEIP2);
        await storage.addNode(ADDR3, NODEIP3);

        await storage.writeCDR(ADDR1, ADDR2, Date.now(), '100', ADDR1, ADDR3 );

        console.log('new CDR added', ADDR1, ADDR2, Date.now(), '100', ADDR1), ADDR3;

        const data1 = await storage.getCDRsCountByUser(ADDR1);

        //expect to see 1 CDRs
        assert(data1  == 1);

        await storage.writeCDR( ADDR1, ADDR2, Date.now(), '200', ADDR1 , ADDR3);
        console.log('new CDR ', ADDR1, ADDR2, Date.now(), '200', ADDR1);
        await storage.writeCDR( ADDR1, ADDR2, Date.now(), '300', ADDR3 , ADDR3);
        console.log('new CDR ', ADDR1, ADDR2, Date.now(), '300', ADDR3);
        await storage.writeCDR( ADDR1, ADDR2, Date.now(), '400', ADDR3 , ADDR3);
        console.log('new CDR ', ADDR1, ADDR3, Date.now(), '400', ADDR3);

        data2 = await storage.getCDRsCountByUser(ADDR1);
        console.log('getCDRsCountByUser', data2.toString());
        //expect to see 2 CDRs
        assert(data2 == 4);

        tmpCount = data2.toNumber();

        for ( i=0; i < tmpCount;i++) {
            const data3 = await storage.getCDRsByUserIndex(ADDR1,i);
            console.log('getCDRsByUserIndex', data3.addrCallee, data3.callDuration.toString());
        }

        //another test for node operators get function
        data2 = await storage.getCDRsCountByNodeOperator(ADDR1);
        console.log('getCDRsCountByNodeOperator', data2.toString());
        //expect to see 2 node operators that operated calls
        assert(data2 == 2);

        tmpCount = data2.toNumber();

        for ( i=0; i < tmpCount;i++) {
            const data3 = await storage.getCDRsByNodeOperatorIndex(ADDR1,i);
            console.log('getCDRsByNodeOperatorIndex', data3.addrCaller, data3.addrCallee, data3.callDuration.toString());
        }

    });

    it('Should add a new user', async () => {
        const storage = await phone0x.new(ADDR1, NODEIP1);
        await storage.addUser(ADDR3, USER3);

        const data2 = await storage.getUserCreds(ADDR3);
        console.log('getUserCreds of', ADDR3,': ', web3.utils.toAscii(data2));
     
        assert((data2.toString()).length > 0);
        
    });

    it('Should update an existing user', async () => {
        const storage = await phone0x.new(ADDR1, NODEIP1);
        await storage.addUser(ADDR3, USER3);

        const data1 = await storage.getUserCreds(ADDR3);
        console.log('getUserCreds of', ADDR3,': ', web3.utils.toAscii(data1));
     
        await storage.updateUser(ADDR3, USER2);

        const data2 = await storage.getUserCreds(ADDR3);
        console.log('getUserCreds of', ADDR3,': ', web3.utils.toAscii(data2));
    
        assert(data1.toString() !=  data2.toString());
        
    });

});