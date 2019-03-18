import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

class MedicationRow extends Component {
    render() {
        const { Row, Cell } = Table;
        const { id, medication } = this.props;
        console.log("ion --- ", medication);

        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{web3.toUtf8(medication[0])}</Cell>
                <Cell>{web3.toUtf8(medication[1])}</Cell>
                <Cell>{web3.toUtf8(medication[2])}</Cell>
                <Cell>{web3.toUtf8(medication[3])}</Cell>
                <Cell>{web3.toUtf8(medication[4])}</Cell>
                <Cell>{medication[5]}</Cell>
                {medication[6] ? (
                    <Cell style={{ color: "green" }}>True</Cell>
                ) : (
                    <Cell style={{ color: "red" }}>False</Cell>
                )}
            </Row>
        );
    }
}

export default MedicationRow;
