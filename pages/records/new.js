import react, { Component } from "react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import factory from "../../ethereum/factory";
import { Input, Form, Button, Message } from "semantic-ui-react";
import { Router } from "../../routes";

class RecordNew extends Component {
    state = {
        fullname: "",
        errorMessage: "",
        loading: false
    };

    onSubmit = async event => {
        event.preventDefault();

        this.setState({ loading: true, errorMessage: "" });

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods.createHealthRecord(this.state.fullname).send({
                from: accounts[0]
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
                <h3>Create Your Personal Health Chain</h3>

                <Form
                    onSubmit={this.onSubmit}
                    error={!!this.state.errorMessage}
                >
                    <Form.Field>
                        <label>Full Name</label>
                        <Input
                            value={this.state.fullname}
                            onChange={event => {
                                this.setState({ fullname: event.target.value });
                            }}
                        />
                    </Form.Field>

                    <Message
                        error
                        header="Oops!"
                        content={this.state.errorMessage}
                    />

                    <Button loading={this.state.loading} primary>
                        Create {this.state.fullname}!
                    </Button>
                </Form>
            </Layout>
        );
    }
}

export default RecordNew;
