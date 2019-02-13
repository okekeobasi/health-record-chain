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
                <Cell>{condition[0]}</Cell>
                <Cell>{condition[1]}</Cell>
                <Cell>{condition[2]}</Cell>
                <Cell>{condition[3]}</Cell>
                <Cell>{condition[4]}</Cell>
                <Cell>{condition[5]}</Cell>
            </Row>
        );
    }
}

export default ConditionRow;
