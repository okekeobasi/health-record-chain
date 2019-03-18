const assert = require("assert");
const ganache = require("ganache-cli");
const Web3 = require("web3");

const web3 = new Web3(ganache.provider());

const compiledFactory = require("../ethereum/build/HealthRecordFactory.json");
const compiledRecord = require("../ethereum/build/HealthRecord.json");

const gas = "3000000";

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
            gas
        });
    factory.setProvider(web3.currentProvider);

    //create a provider in the factory contract
    await factory.methods
        .HealthProvider(
            web3.utils.fromAscii("Vedic"),
            web3.utils.fromAscii("Lekki, Lagos")
        )
        .send({
            from: accounts[0],
            gas
        });

    //Deploy a Record
    await factory.methods
        .createHealthRecord(web3.utils.fromAscii("Christopher"))
        .send({
            from: accounts[1],
            gas
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
    it("deploys a factory and creates a provider", () => {
        assert.ok(factory.options.address);
        assert.ok(provider);
    });

    it("deploys a record", async () => {
        assert.ok(record.options.address);

        username = await record.methods.username().call();
        assert.equal(web3.utils.toUtf8(username), "Christopher");
    });

    it("allows a patient to create conditions", async () => {
        await record.methods
            .createCondition(
                web3.utils.fromAscii("Asthma"),
                web3.utils.fromAscii("present"),
                web3.utils.fromAscii("06/05/13"),
                web3.utils.fromAscii(""),
                web3.utils.fromAscii(""),
                accounts[0]
            )
            .send({
                from: accounts[1],
                gas
            });

        const condition = await record.methods.conditions(0).call();

        assert.equal("Asthma", web3.utils.toUtf8(condition.name));
    });

    it("allows a patient to create appointments", async () => {
        await record.methods
            .createAppointment(
                accounts[0],
                web3.utils.fromAscii("8/02/19"),
                web3.utils.fromAscii("checkup")
            )
            .send({
                from: accounts[1],
                gas
            });

        const appointment = await record.methods.appointments(0).call();

        assert.equal("checkup", web3.utils.toUtf8(appointment.purpose));
    });

    it("only allows patient/owner to create appointments", async () => {
        try {
            await record.methods
                .createAppointment(
                    accounts[0],
                    web3.utils.fromAscii("8/02/19"),
                    web3.utils.fromAscii("checkup")
                )
                .send({
                    from: accounts[0],
                    gas
                });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it("only allows owner to view appointments", async () => {
        try {
            //create the appointment
            await record.methods
                .createAppointment(
                    accounts[0],
                    web3.utils.fromAscii("8/02/19"),
                    web3.utils.fromAscii("checkup")
                )
                .send({
                    from: accounts[1],
                    gas
                });

            //call from a non-owner
            const appointment = await record.methods.getAppointment(0).call({
                from: accounts[0],
                gas
            });

            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it("adds the current owner to a provider struct", async () => {
        await record.methods.addPatientToProviderFactory(0).send({
            from: accounts[1],
            gas
        });

        const patientInProvider = factory.methods
            .getPatientOfProvider(0, accounts[1])
            .call();

        assert.ok(patientInProvider);
    });

    it("allows an account to create only one record", async () => {
        try {
            await factory.methods
                .createHealthRecord(web3.utils.fromAscii("Christopher"))
                .send({
                    from: accounts[1],
                    gas
                });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });

    it("allows a provider to approve an appointment", async () => {
        await record.methods
            .createAppointment(
                accounts[0],
                web3.utils.fromAscii("8/02/19"),
                web3.utils.fromAscii("blood test")
            )
            .send({
                from: accounts[1],
                gas
            });

        await record.methods.approveAppointment(0).send({
            from: accounts[0],
            gas
        });

        const appointments = await record.methods.getAppointment(0).call({
            from: accounts[1],
            gas
        });

        assert(appointments["3"]);
    });

    it("allows only a provider to approve an appointment", async () => {
        await record.methods
            .createAppointment(
                accounts[0],
                web3.utils.fromAscii("8/02/19"),
                web3.utils.fromAscii("blood test")
            )
            .send({
                from: accounts[1],
                gas
            });

        try {
            await record.methods.approveAppointment(0).send({
                from: accounts[1],
                gas
            });
            assert(false);
        } catch (err) {
            assert(err);
        }
    });
});
