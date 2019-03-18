import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0x7F04A44536001E31A16cfdf6779616adD56724c8"
);

export default instance;
