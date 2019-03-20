import React, { Component } from "react";
import Layout from "../../../components/Layout";
import { Link } from "../../../routes";
import Record from "../../../ethereum/health-record";
import {
    Table,
    Button,
    Grid,
    Message,
    Segment,
    Responsive
} from "semantic-ui-react";
import RecordMenu from "../../../components/RecordMenu";
import ConditionRow from "../../../components/Condition/Row";

class ConditionsIndex extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    state = {
        conditionsLength: 0,
        conditions: [],
        errorMessage: "",
        isHidden: true
    };

    async componentDidMount() {
        try {
            const record = Record(this.props.address);
            const account = window.web3.eth.defaultAccount;

            const conditionsLength = await record.methods
                .getConditionsLength()
                .call({
                    from: account
                });

            const conditions = await Promise.all(
                Array(parseInt(conditionsLength))
                    .fill()
                    .map((element, index) => {
                        return record.methods.getConditions(index).call({
                            from: account
                        });
                    })
                    .reverse()
            );

            console.log(conditionsLength, conditions);

            this.setState({
                conditionsLength,
                conditions
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
        return this.state.conditions.map((condition, index) => {
            console.log("i --- ", index);
            console.log("app --- ", condition);
            return (
                <ConditionRow id={index} key={index} condition={condition} />
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
                        <Segment.Group>
                            <Responsive as={Segment}>
                                <Grid.Column>
                                    <RecordMenu
                                        address={this.props.address}
                                        error={!!this.state.errorMessage}
                                    />
                                </Grid.Column>
                            </Responsive>
                        </Segment.Group>

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
                                        }/conditions/new`}
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
                                                <HeaderCell>Status</HeaderCell>
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
                                                    Verified
                                                </HeaderCell>
                                            </Row>
                                        </Header>
                                        <Body>{this.renderRows()}</Body>
                                    </Table>
                                    <div>
                                        Found {this.state.conditionsLength}{" "}
                                        conditions
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

export default ConditionsIndex;
