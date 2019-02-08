import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0xE3323C770f72191c6e46AF7D423F071281fA47Be"
);

export default instance;
