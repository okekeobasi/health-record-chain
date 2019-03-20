import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0xd398A512567Ab8DBB58c765Fe1d634B807b17967"
);

export default instance;
