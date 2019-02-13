import React, { Component } from "react";
import Record from "../../ethereum/health-record";
import web3 from "../../ethereum/web3";
import { Link } from "../../routes";
import Layout from "../../components/Layout";
import RecordMenu from "../../components/RecordMenu";
import { Grid, Message, Card } from "semantic-ui-react";

class RecordShow extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            appointmentsLength: 0,
            conditionsLength: 0,
            medicationsLength: 0,
            errorMessage: "",
            isHidden: true
        };
    }

    async componentDidMount() {
        try {
            const record = Record(this.props.address);
            const account = window.web3.eth.defaultAccount;
            // const [account] = await web3.eth.getAccount();
            console.log("account ", account);

            const appointmentsLength = await record.methods
                .getAppointmentLength()
                .call({
                    from: account
                });
            const medicationsLength = await record.methods
                .getMedicationsLength()
                .call({
                    from: account
                });
            const conditionsLength = await record.methods
                .getConditionsLength()
                .call({
                    from: account
                });

            this.setState({
                appointmentsLength,
                conditionsLength,
                medicationsLength
            });
        } catch (err) {
            this.setState({
                errorMessage: err.message,
                isHidden: false
            });

            console.log(err.message);
        }
    }

    renderCards() {
        const {
            appointmentsLength,
            conditionsLength,
            medicationsLength
        } = this.state;

        const items = [
            {
                header: parseInt(appointmentsLength) || 0,
                meta: "Appointments",
                description: "Appointments set with Providers",
                style: {
                    overflowWrap: "break-word"
                }
            },
            {
                header: parseInt(conditionsLength) || 0,
                meta: "Conditions",
                description: "Health Conditions",
                style: {
                    overflowWrap: "break-word"
                }
            },
            {
                header: parseInt(medicationsLength) || 0,
                meta: "Medications",
                description: "Medications prescribed",
                style: {
                    overflowWrap: "break-word"
                }
            }
        ];

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <Grid style={{ marginTop: "10px" }}>
                    <Grid.Row>
                        <Grid.Column width={16} textAlign="center">
                            <h3>{this.props.address}</h3>
                        </Grid.Column>
                    </Grid.Row>

                    <Grid.Row>
                        <Grid.Column width={5}>
                            <RecordMenu address={this.props.address} />
                        </Grid.Column>

                        <Grid.Column width={11}>
                            <Grid.Row>
                                <Grid.Column>
                                    <div style={{ marginBottom: "10px" }}>
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
                                <Grid.Column>{this.renderCards()}</Grid.Column>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default RecordShow;
