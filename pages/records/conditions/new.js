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
import { DateTimeInput, DateInput } from "semantic-ui-calendar-react";

class ConditionNew extends Component {
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
        name: "",
        status: "",
        startDate: "",
        endDate: "",
        how_it_ended: "",
        provider: "",
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

        const {
            name,
            status,
            startDate,
            endDate,
            how_it_ended,
            provider
        } = this.state;
        const record = Record(this.props.address);

        this.setState({ loading: true, errorMessage: "" });

        try {
            const accounts = await web3.eth.getAccounts();

            await record.methods
                .createCondition(
                    web3.utils.fromAscii(name),
                    web3.utils.fromAscii(status),
                    web3.utils.fromAscii(startDate),
                    web3.utils.fromAscii(endDate),
                    web3.utils.fromAscii(how_it_ended),
                    provider
                )
                .send({
                    from: accounts[0]
                });
            Router.pushRoute(`/records/${this.props.address}/conditions`);
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        const { provider_options } = this.props;
        const { isLoading, value, results } = this.state;
        // console.log(provider_options);
        let today = new Date();

        return (
            <Layout>
                <h3>Add Condition</h3>
                <br />
                <p>Address</p>
                <Form
                    error={!!this.state.errorMessage}
                    onSubmit={this.onSubmit}
                >
                    <Form.Field>
                        <label>Name</label>
                        <Input name="name" onChange={this.handleChange} />
                    </Form.Field>

                    <Form.Field>
                        <label>Status</label>
                        <Select
                            name="status"
                            options={[
                                {
                                    text: "Cured",
                                    key: 0,
                                    value: "Cured"
                                },
                                {
                                    text: "Ongoing",
                                    key: 1,
                                    value: "Ongoing"
                                }
                            ]}
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Start Date:</label>
                        <DateInput
                            clearable
                            clearIcon={<Icon name="remove" color="red" />}
                            dateFormat="DD/MM/YY"
                            maxDate={today.getDate()}
                            name="startDate"
                            placeholder="Date Time"
                            value={this.state.startDate}
                            iconPosition="left"
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>End Date:</label>
                        <DateInput
                            clearable
                            clearIcon={<Icon name="remove" color="red" />}
                            dateFormat="DD/MM/YY"
                            maxDate={today.getDate()}
                            name="endDate"
                            placeholder="Date Time"
                            value={this.state.endDate}
                            iconPosition="left"
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>How it ended:</label>
                        <Input
                            name="how_it_ended"
                            onChange={this.handleChange}
                        />
                    </Form.Field>

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

                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />

                    <Button loading={this.state.loading} primary>
                        Add
                    </Button>
                </Form>
                <br />
            </Layout>
        );
    }
}

export default ConditionNew;
