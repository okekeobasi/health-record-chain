import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0x56B7B51AF158cfc9D1f3d7ad34fDB2A6a0fb5398"
);

export default instance;
