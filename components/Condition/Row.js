import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

class ConditionRow extends Component {
    render() {
        const { Row, Cell } = Table;
        const { id, condition } = this.props;
        console.log("ion --- ", condition);

        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{web3.toUtf8(condition[0])}</Cell>
                <Cell>{web3.toUtf8(condition[1])}</Cell>
                <Cell>{web3.toUtf8(condition[2])}</Cell>
                <Cell>{web3.toUtf8(condition[3])}</Cell>
                <Cell>{web3.toUtf8(condition[4])}</Cell>
                <Cell>{condition[5]}</Cell>
                {condition[6] ? (
                    <Cell style={{ color: "green" }}>True</Cell>
                ) : (
                    <Cell style={{ color: "red" }}>False</Cell>
                )}
            </Row>
        );
    }
}

export default ConditionRow;
