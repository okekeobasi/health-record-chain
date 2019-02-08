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

    provider = await factory.methods.providers(0).call();

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

    it("deploys a record", () => {
        assert.ok(record.options.address);
    });

    it("allows a patient to create conditions", async () => {
        await record.methods
            .createCondition(
                "Asthma",
                "present",
                "06/05/13",
                "",
                "",
                accounts[0]
            )
            .send({
                from: accounts[1],
                gas: "3000000"
            });

        const condition = await record.methods.conditions(0).call();

        assert.equal("Asthma", condition.name);
    });

    it("allows a patient to create appointments", async () => {
        await record.methods
            .createAppointment(accounts[0], "8/02/19", "checkup")
            .send({
                from: accounts[1],
                gas: "3000000"
            });

        const appointment = await record.methods.appointments(0).call();

        assert.equal("checkup", appointment.purpose);
    });

    it("only allows patient/owner to create appointments", async () => {
        try {
            await record.methods
                .createAppointment(accounts[0], "8/02/19", "checkup")
                .send({
                    from: accounts[0],
                    gas: "3000000"
                });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});
