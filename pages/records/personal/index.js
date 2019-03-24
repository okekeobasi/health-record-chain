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
    Responsive,
    Input,
    Icon,
    TextArea
} from "semantic-ui-react";
import RecordMenu from "../../../components/RecordMenu";
import web3 from "../../../ethereum/web3";
import { DateInput } from "semantic-ui-calendar-react";

class PerosnalIndex extends Component {
    static async getInitialProps(props) {
        return {
            address: props.query.address
        };
    }

    state = {
        date_of_birth: "",
        kin_name: "",
        kin_number: "",
        past_address: "",
        errorMessage: "",
        isHidden: true,
        loading: false
    };

    async componentWillMount() {
        try {
            const [account] = await web3.eth.getAccounts();
            const record = Record(this.props.address);

            const appointment_length = await record.methods
                .getAppointmentLength()
                .call({
                    from: account
                });

            let date_of_birth = await record.methods.date_of_birth().call();
            let kin_name = await record.methods.next_of_kin_name(0).call();
            let kin_number = await record.methods.next_of_kin_number(0).call();
            let past_address = await record.methods.past_address(0).call();

            date_of_birth = web3.utils.toUtf8(date_of_birth);
            kin_name = web3.utils.toUtf8(kin_name);
            kin_number = web3.utils.toUtf8(kin_number);
            past_address = web3.utils.toUtf8(past_address);

            this.setState({
                date_of_birth,
                kin_name,
                kin_number,
                past_address
            });
        } catch (err) {
            console.log(err.message);
            this.setState({
                errorMessage: err.message,
                isHidden: false
            });
        }
    }

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
        // console.log(value);
    };

    update = async event => {
        const {
            date_of_birth,
            kin_name,
            kin_number,
            past_address
        } = this.state;

        console.log(this.state);

        this.setState({ loading: true, errorMessage: "" });

        try {
            const [account] = await web3.eth.getAccounts();
            const record = Record(this.props.address);

            this.setState({
                errorMessage: "Please verify the next 4 transactions"
            });

            let batch = new web3.BatchRequest();

            batch.add(
                record.methods
                    .add_date_of_birth(web3.utils.fromAscii(date_of_birth))
                    .send({
                        from: account
                    })
            );
            batch.add(
                record.methods
                    .update_past_address(web3.utils.fromAscii(past_address))
                    .send({
                        from: account
                    })
            );
            batch.add(
                record.methods
                    .update_kin_name(web3.utils.fromAscii(kin_name))
                    .send({
                        from: account
                    })
            );
            batch.add(
                record.methods
                    .update_kin_number(web3.utils.fromAscii(kin_number))
                    .send({
                        from: account
                    })
            );

            batch.execute();

            this.setState({
                errorMessage: ""
            });
        } catch (err) {
            console.log(err);
            this.setState({
                errorMessage: err.message
            });
        }

        this.setState({ loading: false });
    };

    render() {
        const { Header, Row, HeaderCell, Body } = Table;
        let today = new Date();

        return (
            <Layout>
                <Message
                    error={!!this.state.errorMessage}
                    hidden={this.state.isHidden}
                    header="Oops!"
                    content={this.state.errorMessage}
                />
                <Responsive as={Segment}>
                    <Grid columns={2}>
                        <Grid.Column width={12}>
                            {!!this.state.date_of_birth ? (
                                <div>
                                    <b>Date of Birth:</b>
                                    <br />
                                    {this.state.date_of_birth} <br />
                                </div>
                            ) : (
                                <DateInput
                                    clearable
                                    clearIcon={
                                        <Icon name="remove" color="red" />
                                    }
                                    maxDate={today.getDate()}
                                    name="date_of_birth"
                                    onChange={this.handleChange}
                                />
                            )}
                        </Grid.Column>
                        <Grid.Column width={4}>
                            <Button
                                onClick={this.update}
                                positive
                                loading={this.state.loading}
                            >
                                Update
                            </Button>
                        </Grid.Column>
                    </Grid>
                </Responsive>
                <Grid columns={3}>
                    <Grid.Column>
                        <Responsive as={Segment}>
                            <RecordMenu address={this.props.address} />
                        </Responsive>
                    </Grid.Column>
                    <Grid.Column>
                        <Responsive as={Segment}>
                            <b>Known Addresses</b>
                            <br />
                            {this.state.past_address}
                            <br />
                            <TextArea
                                value={this.state.past_address}
                                onChange={event =>
                                    this.setState({
                                        past_address: event.target.value
                                    })
                                }
                            />
                        </Responsive>
                    </Grid.Column>
                    <Grid.Column>
                        <Responsive as={Segment}>
                            <b>Known Next of Kin</b>
                            <br />
                            {this.state.kin_name + ", " + this.state.kin_number}
                            <br />
                            <Input
                                placeholder="Name"
                                value={this.state.kin_name}
                                onChange={event =>
                                    this.setState({
                                        kin_name: event.target.value
                                    })
                                }
                            />
                            <Input
                                placeholder="Number"
                                value={this.state.kin_number}
                                onChange={event =>
                                    this.setState({
                                        kin_number: event.target.value
                                    })
                                }
                            />
                        </Responsive>
                    </Grid.Column>
                </Grid>
            </Layout>
        );
    }
}

export default PerosnalIndex;
