import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";

export default class AppointmentRow extends Component {
    render() {
        const { Row, Cell } = Table;
        const { id, appointment } = this.props;
        return (
            <Row>
                <Cell>{id}</Cell>
                <Cell>{appointment[0]}</Cell>
                <Cell>{web3.toUtf8(appointment[1])}</Cell>
                <Cell>{web3.toUtf8(appointment[2])}</Cell>
                {appointment[3] ? (
                    <Cell style={{ color: "green" }}>True</Cell>
                ) : (
                    <Cell style={{ color: "red" }}>False</Cell>
                )}
            </Row>
        );
    }
}
