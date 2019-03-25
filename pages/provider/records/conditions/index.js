import React, { Component } from "react";
import Layout from "../../../../components/Layout";
import factory from "../../../../ethereum/factory";
import web3 from "../../../../ethereum/web3";
import { Link } from "../../../../routes";
import Record from "../../../../ethereum/health-record";
import {
    Table,
    Button,
    Grid,
    Message,
    Segment,
    Responsive
} from "semantic-ui-react";
import RecordMenu from "../../../../components/RecordMenu";

class ConditionIndex extends Component {
    static async getInitialProps(props) {
        let providers;
        let providerLength;

        try {
            const record = Record(props.query.address);

            providerLength = await factory.methods.getProviderLength().call();

            providers = await Promise.all(
                Array(parseInt(providerLength))
                    .fill()
                    .map((element, index) => {
                        return factory.methods.providers(index).call();
                    })
                    .reverse()
            );

            // console.log(appointmentsLength, appointments);
        } catch (err) {
            console.log(err.message);
        }

        return {
            address: props.query.address,
            providers,
            providerLength
        };
    }

    state = {
        account: "",
        conditions: [],
        appointments_map: [],
        loading: false,
        errorMessage: "",
        isHidden: true
    };

    /*
    async componentWillMount() {
        const { appointments } = this.props;
        const [account] = await web3.eth.getAccounts();
        let appointments_map = [];

        for (let i = 0; i < appointments.length; i++) {
            console.log(appointments[i].provider);
            if (appointments[i].provider !== account) {
            } else {
                appointments_map.push({
                    index: i,
                    data: appointments[i]
                });
            }
        }

        this.setState({ appointments_map });
    }
    */

    async componentDidMount() {
        try {
            const [account] = await web3.eth.getAccounts();
            const record = Record(this.props.address);

            const { providers } = this.props;

            const isProvider = providers.map(provider => {
                return provider.provider == account;
            });

            if (!isProvider.includes(true)) {
                this.setState({
                    errorMessage: "Invalid Provider Address",
                    isHidden: false
                });
            } else {
                const conditionsLength = await record.methods
                    .getConditionsLength()
                    .call({
                        from: account
                    });

                console.log(conditionsLength);

                const conditions = await Promise.all(
                    Array(parseInt(conditionsLength))
                        .fill()
                        .map((element, index) => {
                            return record.methods.getConditions(index).call({
                                from: account
                            });
                        })
                );
                this.setState({ conditions, account });
            }
        } catch (err) {
            console.log(err.message);
            this.setState({
                errorMessage: err.message,
                isHidden: false
            });
        }
    }

    onApprove = async event => {
        event.persist();
        console.log(event.target.value);
        this.setState({ loading: true });

        try {
            const [account] = await web3.eth.getAccounts();
            const record = Record(this.props.address);

            await record.methods.approveCondition(event.target.value).send({
                from: account
            });

            this.forceUpdate();
        } catch (err) {
            this.setState({
                errorMessage: err.message,
                isHidden: false
            });
        }
        this.setState({ loading: false });
    };

    onDecline = async event => {};

    renderRows() {
        const { Row, Cell } = Table;
        const { conditions } = this.state;

        return conditions.map((condition, key) => {
            console.log("data----  ", condition);
            return (
                <Row>
                    <Cell>{key}</Cell>
                    <Cell>{web3.utils.toUtf8(condition[0])}</Cell>
                    <Cell>{web3.utils.toUtf8(condition[1])}</Cell>
                    <Cell>{web3.utils.toUtf8(condition[2])}</Cell>
                    <Cell>{web3.utils.toUtf8(condition[3])}</Cell>
                    <Cell>{web3.utils.toUtf8(condition[4])}</Cell>
                    <Cell>{condition[5]}</Cell>
                    {condition[6] ? (
                        <Cell>
                            <Button
                                basic
                                onClick={this.onApprove}
                                value={key}
                                loading={this.state.loading}
                                disabled
                            >
                                Approve
                            </Button>
                        </Cell>
                    ) : (
                        <Cell>
                            {condition[5] == this.state.account ? (
                                <Button
                                    color="green"
                                    basic
                                    onClick={this.onApprove}
                                    loading={this.state.loading}
                                    value={key}
                                >
                                    Approve
                                </Button>
                            ) : (
                                <Button
                                    basic
                                    onClick={this.onApprove}
                                    value={key}
                                    loading={this.state.loading}
                                    disabled
                                >
                                    Approve
                                </Button>
                            )}
                        </Cell>
                    )}
                </Row>
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
                            <h3>Conditions</h3>
                        </Grid.Column>
                    </Grid.Row>

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
                        <Segment.Group>
                            <Responsive as={Segment}>
                                <Grid.Column width={3}>
                                    <RecordMenu
                                        providerActive={true}
                                        address={this.props.address}
                                    />
                                </Grid.Column>
                            </Responsive>
                        </Segment.Group>
                    </Grid.Row>
                    <Grid.Row>
                        <Segment.Group>
                            <Responsive as={Segment}>
                                <Grid.Column width={11}>
                                    <Grid.Row>
                                        <Grid.Column>
                                            <Table size={"small"}>
                                                <Header>
                                                    <Row>
                                                        <HeaderCell>
                                                            ID
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            Name
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            Status
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            Start Date
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            End Date
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            How it ended
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            Provider
                                                        </HeaderCell>
                                                        <HeaderCell>
                                                            Verify
                                                        </HeaderCell>
                                                    </Row>
                                                </Header>
                                                <Body>{this.renderRows()}</Body>
                                            </Table>
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid.Column>
                            </Responsive>
                        </Segment.Group>
                    </Grid.Row>
                </Grid>
            </Layout>
        );
    }
}

export default ConditionIndex;
