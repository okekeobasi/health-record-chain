import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Record from "../../../ethereum/health-record";
import { Table, Button, Grid, Message } from "semantic-ui-react";
import RecordMenu from "../../../components/RecordMenu";
import MedicationRow from "../../../components/Medication/Row";

class MedicationsIndex extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    state = {
        medicationsLength: 0,
        medications: [],
        errorMessage: "",
        isHidden: true
    };

    async componentDidMount() {
        try {
            const record = Record(this.props.address);
            const account = window.web3.eth.defaultAccount;

            const medicationsLength = await record.methods
                .getMedicationsLength()
                .call({
                    from: account
                });

            const medications = await Promise.all(
                Array(parseInt(medicationsLength))
                    .fill()
                    .map((element, index) => {
                        return record.methods.getMedications(index).call({
                            from: account
                        });
                    })
                    .reverse()
            );

            console.log(medicationsLength, medications);

            this.setState({
                medicationsLength,
                medications
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
        return this.state.medications.map((medication, index) => {
            console.log("i --- ", index);
            console.log("app --- ", medication);
            return (
                <MedicationRow id={index} key={index} medication={medication} />
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
                            <h3>Medications</h3>
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
                                        }/medications/new`}
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
                                    <Table collapsing={true} size={"small"}>
                                        <Header>
                                            <Row>
                                                <HeaderCell>ID</HeaderCell>
                                                <HeaderCell>Name</HeaderCell>
                                                <HeaderCell>
                                                    Strength
                                                </HeaderCell>
                                                <HeaderCell>Reason</HeaderCell>
                                                <HeaderCell>
                                                    Start Date
                                                </HeaderCell>
                                                <HeaderCell>
                                                    End Date
                                                </HeaderCell>
                                                <HeaderCell>
                                                    Provider
                                                </HeaderCell>
                                                <HeaderCell>
                                                    Verified
                                                </HeaderCell>
                                            </Row>
                                        </Header>
                                        <Body>{this.renderRows()}</Body>
                                    </Table>
                                    <div>
                                        Found {this.state.medicationsLength}{" "}
                                        medications
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

export default MedicationsIndex;
