import React, { Component } from "react";
import _ from "lodash";
import web3 from "../../../ethereum/web3";
import factory from "../../../ethereum/factory";
import Record from "../../../ethereum/health-record";
import { Router } from "../../../routes";
import Layout from "../../../components/Layout";
import {
    Form,
    Input,
    Message,
    Select,
    Button,
    Icon,
    Search
} from "semantic-ui-react";
import { DateTimeInput } from "semantic-ui-calendar-react";

class AppointmentNew extends Component {
    static async getInitialProps(props) {
        let provider_options = {};
        const { address } = props.query;

        try {
            const providersLength = await factory.methods
                .getProviderLength()
                .call();

            const providers = await Promise.all(
                Array(parseInt(providersLength))
                    .fill()
                    .map((element, index) => {
                        return factory.methods.providers(index).call();
                    })
            );

            provider_options = providers.map((provider, index) => {
                return {
                    text: provider.provider,
                    key: index,
                    value: provider.provider,
                    title: provider.provider,
                    description: web3.utils.toUtf8(provider.name)
                };
            });
        } catch (err) {
            console.log(err.message);
        }

        return { provider_options, address };
    }

    state = {
        provider: "",
        dateTime: "",
        purpose: "",
        errorMessage: "",
        loading: false,
        isLoading: false,
        value: "",
        results: []
    };

    componentWillMount() {
        this.resetComponent();
    }

    resetComponent = () =>
        this.setState({ isLoading: false, value: "", results: [] });

    handleResultSelect = (e, { result }) =>
        this.setState({ value: result.title, provider: result.title });

    handleSearchChange = (e, { value }) => {
        this.setState({ isLoading: true, value });

        setTimeout(() => {
            if (this.state.value.length < 1) return this.resetComponent();

            const re = new RegExp(_.escapeRegExp(this.state.value), "i");
            const isMatch = result => re.test(result.value);

            this.setState({
                isLoading: false,
                results: _.filter(this.props.provider_options, isMatch)
            });
        }, 300);
    };

    handleChange = (event, { name, value }) => {
        if (this.state.hasOwnProperty(name)) {
            this.setState({ [name]: value });
        }
        // console.log(value);
    };

    onSubmit = async event => {
        event.preventDefault();

        const { provider, dateTime, purpose } = this.state;
        console.log(this.state);

        this.setState({ loading: true, errorMessage: "" });

        try {
            const [account] = await web3.eth.getAccounts();
            const record = Record(this.props.address);

            await record.methods
                .createAppointment(
                    provider,
                    web3.utils.fromAscii(dateTime),
                    web3.utils.fromAscii(purpose)
                )
                .send({
                    from: account
                });

            await record.methods.setProviders(provider).send({ from: account });

            Router.pushRoute(`/records/${this.props.address}/appointments`);
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        const { isLoading, value, results } = this.state;
        const { provider_options } = this.props;
        // console.log(provider_options);
        let today = new Date();

        return (
            <Layout>
                <h3>Add Appointments</h3>
                <br />
                <p>Address</p>
                <Form
                    error={!!this.state.errorMessage}
                    onSubmit={this.onSubmit}
                >
                    <Form.Field>
                        <label>Provider</label>
                        <Search
                            loading={isLoading}
                            onResultSelect={this.handleResultSelect}
                            onSearchChange={_.debounce(
                                this.handleSearchChange,
                                500,
                                { leading: true }
                            )}
                            results={results}
                            value={value}
                            {...this.props}
                            name="provider"
                            fluid
                        />

                        {/* <Select
                            name="provider"
                            options={provider_options}
                            onChange={this.handleChange}
                        /> */}
                    </Form.Field>

                    <Form.Field>
                        <label>Date</label>
                        <DateTimeInput
                            clearable
                            clearIcon={<Icon name="remove" color="red" />}
                            dateFormat="DD/MM/YY"
                            maxDate={today.getDate()}
                            name="dateTime"
                            placeholder="Date Time"
                            value={this.state.dateTime}
                            iconPosition="left"
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Purpose</label>
                        <Input name="purpose" onChange={this.handleChange} />
                    </Form.Field>

                    <Message
                        error
                        header="!!"
                        content={this.state.errorMessage}
                    />

                    <Button loading={this.state.loading} primary>
                        Add
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default AppointmentNew;
