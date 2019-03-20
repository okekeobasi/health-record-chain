import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0x1B13fD4Af490D91Dfbcaa7A67E8B393b197c66B7"
);

export default instance;
