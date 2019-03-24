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

class MedicationNew extends Component {
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
        strength: "",
        dosage: "",
        how_often: "",
        reason: "",
        startDate: "",
        endDate: "",
        provider: "",
        strength_ext: "",
        dosage_ext: "",
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

        let {
            name,
            strength,
            dosage,
            how_often,
            reason,
            startDate,
            endDate,
            provider,
            dosage_ext,
            strength_ext
        } = this.state;

        const record = Record(this.props.address);

        this.setState({ loading: true, errorMessage: "" });

        try {
            const [account] = await web3.eth.getAccounts();
            dosage = dosage + " " + dosage_ext;
            strength = strength + " " + strength_ext;

            await record.methods
                .createMedication(
                    web3.utils.fromAscii(name),
                    web3.utils.fromAscii(strength),
                    web3.utils.fromAscii(dosage),
                    how_often,
                    web3.utils.fromAscii(reason),
                    web3.utils.fromAscii(startDate),
                    web3.utils.fromAscii(endDate),
                    provider
                )
                .send({
                    from: account
                });

            await record.methods.setProviders(provider).send({ from: account });

            Router.pushRoute(`/records/${this.props.address}/medications`);
        } catch (err) {
            console.log(err);
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    strengthOptions() {
        return [
            {
                value: "cfuperml",
                text: "Colony forming units per milliliter (cfu/ml)",
                key: 0
            },
            { value: "iu", text: "International unit (iu)", key: 1 },
            { value: "mcg", text: "Micrograms (mcg)", key: 2 },
            { value: "meq", text: "Milliequivalent (meq)", key: 3 },
            {
                value: "meqperml",
                text: "Milliequivalent per milliliter (meq/ml)",
                key: 4
            },
            { value: "mg", text: "Milligram (mg)", key: 5 },
            {
                value: "mgperml",
                text: "Milligram per milliliter (mg/ml)",
                key: 6
            },
            { value: "ml", text: "Milliliter (ml)", key: 7 },
            { value: "percent", text: "Percent (%)", key: 8 },
            { value: "unt", text: "Unit (unt)", key: 9 },
            {
                value: "untperml",
                text: "Units per milliliter (unt/ml)",
                key: 10
            }
        ];
    }

    dosageOptions() {
        return [
            { value: "Applicatorfuls", text: "Applicatorfuls", key: 0 },
            { value: "Bags", text: "Bags", key: 1 },
            { value: "Bars", text: "Bars", key: 2 },
            { value: "Capsules", text: "Capsules", key: 3 },
            { value: "Doses", text: "Doses", key: 4 },
            { value: "Dropperfuls", text: "Dropperfuls", key: 5 },
            { value: "Drops", text: "Drops", key: 6 },
            { value: "g", text: "Grams (g)", key: 7 },
            { value: "Inhalations", text: "Inhalations", key: 8 },
            { value: "Lozenges", text: "Lozenges", key: 9 },
            { value: "mcg", text: "Micrograms (mcg)", key: 10 },
            { value: "mg", text: "Milligrams (mg)", key: 11 },
            { value: "ml", text: "Milliliters (ml)", key: 12 },
            { value: "Packets", text: "Packets", key: 13 },
            { value: "Pads", text: "Pads", key: 14 },
            { value: "Patches", text: "Patches", key: 15 },
            { value: "Percent", text: "Percent (%)", key: 16 },
            { value: "Puffs", text: "Puffs", key: 17 },
            { value: "Scoops", text: "Scoops", key: 18 },
            { value: "Shots", text: "Shots", key: 19 },
            { value: "Sprays", text: "Sprays", key: 20 },
            { value: "Suppositories", text: "Suppositories", key: 21 },
            { value: "Syringe", text: "Syringe", key: 22 },
            { value: "tbsp", text: "Tablespoons (tbsp)", key: 23 },
            { value: "Tablets", text: "Tablets", key: 24 },
            { value: "tsp", text: "Teaspoons (tsp)", key: 25 },
            { value: "Units", text: "Units (U)", key: 26 }
        ];
    }

    render() {
        const { provider_options } = this.props;
        const { isLoading, value, results } = this.state;
        // console.log(provider_options);
        let today = new Date();

        return (
            <Layout>
                <h3>Add Medication</h3>
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

                    <Form.Group inline widths="equal">
                        <Form.Input
                            fluid
                            label="Strength"
                            name="strength"
                            type="number"
                            placeholder="ex: 500"
                            onChange={this.handleChange}
                        />
                        <Form.Select
                            fluid
                            label="ext"
                            name="strength_ext"
                            placeholder="ex: mg"
                            options={this.strengthOptions()}
                            onChange={this.handleChange}
                        />
                    </Form.Group>

                    <Form.Group inline widths="equal">
                        <Form.Input
                            fluid
                            label="Dosage"
                            name="dosage"
                            type="number"
                            placeholder="ex: 1"
                            onChange={this.handleChange}
                        />
                        <Form.Select
                            fluid
                            label="ext"
                            name="dosage_ext"
                            placeholder="ex: tablet"
                            options={this.dosageOptions()}
                            onChange={this.handleChange}
                        />
                    </Form.Group>

                    <Form.Field>
                        <label>How Often</label>
                        <Input
                            label="per day"
                            name="how_often"
                            type="number"
                            onChange={this.handleChange}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Reason</label>
                        <Input name="reason" onChange={this.handleChange} />
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
                        {/* <Select
                            name="provider"
                            options={provider_options}
                            onChange={this.handleChange}
                        /> */}
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
                <br />
            </Layout>
        );
    }
}

export default MedicationNew;
