import react, { Component } from "react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import { Input, Form, Button, Message } from "semantic-ui-react";
import { Router } from "../../routes";

class RecordNew extends Component {
    state = {
        provider_name: "",
        location: "",
        errorMessage: "",
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: "" });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .HealthProvider(
                    web3.utils.fromAscii(this.state.provider_name),
                    web3.utils.fromAscii(this.state.location)
                )
                .send({
                    from: accounts[0],
                    value: web3.utils.toWei(".25", "ether")
                });

            Router.pushRoute("/");
        } catch (err) {
            this.setState({ errorMessage: err.message });
        }

        this.setState({ loading: false });
    };

    render() {
        return (
            <Layout>
                <h3>Register your Healthcare Provider</h3>

                <Form
                    onSubmit={this.onSubmit}
                    error={!!this.state.errorMessage}
                >
                    <Form.Field>
                        <label>Provider Name</label>
                        <Input
                            value={this.state.provider_name}
                            onChange={event => {
                                this.setState({
                                    provider_name: event.target.value
                                });
                            }}
                        />
                    </Form.Field>

                    <Form.Field>
                        <label>Location</label>
                        <Input
                            value={this.state.location}
                            onChange={event => {
                                this.setState({ location: event.target.value });
                            }}
                        />
                    </Form.Field>

                    <pre style={{ color: "red" }}>Cost .25 ether</pre>

                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />

                    <Button loading={this.state.loading} primary>
                        Create {this.state.provider_name}!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RecordNew;
