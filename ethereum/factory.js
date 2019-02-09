import web3 from "./web3";
import HealthRecordFactory from "./build/HealthRecordFactory.json";

const instance = new web3.eth.Contract(
    JSON.parse(HealthRecordFactory.interface),
    "0x9DA6e27C3F061b97752901946568b9B6d3Fc3d8f"
);

export default instance;
