const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/HealthRecordFactory.json");
const compiledRecord = require("../ethereum/build/HealthRecord.json");

let accounts;
let factory;
let provider;
let recordAddress;
let record;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();

    //JSON parse the factory ABI
    let factoryJson = JSON.parse(compiledFactory.interface);
    //deploy the factory
    factory = await new web3.eth.Contract(factoryJson)
        .deploy({
            data: compiledFactory.bytecode
        })
        .send({
            from: accounts[0],
            gas: "3000000"
        });
    factory.setProvider(web3.currentProvider);

    //create a provider in the factory contract
    await factory.methods.HealthProvider("Vedic", "Lekki, Lagos").send({
        from: accounts[0],
        gas: "3000000"
    });

    //Deploy a Record
    await factory.methods.createHealthRecord().send({
        from: accounts[1],
        gas: "3000000"
    });

    provider = await factory.methods.getProvider(0).call();

    //get address of deployed record
    [recordAddress] = await factory.methods.getDeployedRecords().call();

    //instantiate contract at deployed address
    record = await new web3.eth.Contract(
        JSON.parse(compiledRecord.interface),
        recordAddress
    );
});

describe("Health Records", () => {
    it("depoys a factory and creates a provider", () => {
        assert.ok(factory.options.address);
        assert.ok(provider);
    });
});
