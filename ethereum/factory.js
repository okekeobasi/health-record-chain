import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0x8794E44Da3588EBcFb32FE1348940B4908AeC89B"
);

export default instance;
