import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Record from "../../../ethereum/health-record";
import { Table, Button, Grid, Message } from "semantic-ui-react";
import RecordMenu from "../../../components/RecordMenu";
import AppointmentRow from "../../../components/Appointment/Row";

class AppointmentIndex extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    state = {
        appointmentsLength: 0,
        appointments: [],
        errorMessage: "",
        isHidden: true
    };

    async componentDidMount() {
        try {
            const record = Record(this.props.address);
            const account = window.web3.eth.defaultAccount;

            const appointmentsLength = await record.methods
                .getAppointmentLength()
                .call({
                    from: account
                });

            const appointments = await Promise.all(
                Array(parseInt(appointmentsLength))
                    .fill()
                    .map((element, index) => {
                        return record.methods.getAppointment(index).call({
                            from: account
                        });
                    })
                    .reverse()
            );

            console.log(appointmentsLength, appointments);

            this.setState({
                appointmentsLength,
                appointments
            });
        } catch (err) {
            console.log(err.message);
            this.setState({
                errorMessage: err.message,
                isHidden: false
            });
        }
    }

    renderRows() {
        return this.state.appointments.map((appointment, index) => {
            console.log("i --- ", index);
            console.log("app --- ", appointment);
            return (
                <AppointmentRow
                    id={index}
                    key={index}
                    appointment={appointment}
                />
            );
        });
    }

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        return (
            <Layout>
                <Grid style={{ marginTop: "10px" }}>
                    <Grid.Row>
                        <Grid.Column width={16} textAlign="center">
                            <h3>Appointments</h3>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={5}>
                            <RecordMenu address={this.props.address} />
                        </Grid.Column>

                        <Grid.Column width={11}>
                            <Grid.Row>
                                <Grid.Column>
                                    <div style={{ marginBottom: "5px" }}>
                                        <Message
                                            error={!!this.state.errorMessage}
                                            hidden={this.state.isHidden}
                                            header="Oops!"
                                            content={this.state.errorMessage}
                                        />
                                    </div>
                                </Grid.Column>
                            </Grid.Row>

                            <Grid.Row>
                                <Grid.Column>
                                    <Link
                                        route={`/records/${
                                            this.props.address
                                        }/appointments/new`}
                                    >
                                        <a>
                                            <Button
                                                primary
                                                floated="right"
                                                style={{ marginBottom: 10 }}
                                            >
                                                Add
                                            </Button>
                                        </a>
                                    </Link>
                                    <Table size="small">
                                        <Header>
                                            <Row>
                                                <HeaderCell>ID</HeaderCell>
                                                <HeaderCell>
                                                    Provider
                                                </HeaderCell>
                                                <HeaderCell>Date</HeaderCell>
                                                <HeaderCell>Purpose</HeaderCell>
                                                <HeaderCell>
                                                    Verified
                                                </HeaderCell>
                                            </Row>
                                        </Header>
                                        <Body>{this.renderRows()}</Body>
                                    </Table>
                                    <div>
                                        Found {this.state.appointmentsLength}{" "}
                                        appointments
                                    </div>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default AppointmentIndex;
