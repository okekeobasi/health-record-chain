const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("./build/HealthRecordFactory.json");

const provider = new HDWalletProvider(
    "vibrant glide pipe nut say grass hand leg boring jump patch enable",
    "https://rinkeby.infura.io/v3/978c393cf622480ca18f84573bb9c503"
);
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account", accounts[0]);

    const result = await new web3.eth.Contract(
        JSON.parse(compiledFactory.interface)
    )
        .deploy({ data: compiledFactory.bytecode })
        .send({ from: accounts[0], gas: "6000000" });

    console.log("Contract deployed to", result.options.address);
};

deploy();
