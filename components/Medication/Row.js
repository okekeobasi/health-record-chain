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
                <Cell>{medication[0]}</Cell>
                <Cell>{medication[1]}</Cell>
                <Cell>{medication[2]}</Cell>
                <Cell>{medication[3]}</Cell>
                <Cell>{medication[4]}</Cell>
                <Cell>{medication[5]}</Cell>
            </Row>
        );
    }
}

export default MedicationRow;
