import React, { Component } from "react";
import factory from "../ethereum/factory";
import Layout from "../components/Layout";
import { Link } from "../routes";
import { Card } from "semantic-ui-react";

class RecordIndex extends Component {
    static async getInitialProps() {
        try {
            const records = await factory.methods.getDeployedRecords().call();

            return { records };
        } catch (err) {
            const records = ["No Records Fetched"];
            console.log(err);

            return { records };
        }
    }

    renderRecords() {
        const items = this.props.records.map(address => {
            return {
                header: address,
                description: (
                    <div>
                        <Link route={`/records/${address}`}>
                            <a>View Record</a>
                        </Link>

                        <Link
                            route={`/provider/records/${address}/appointments`}
                        >
                            <a style={{ float: "right" }}>Provider</a>
                        </Link>
                    </div>
                ),
                fluid: true,
                style: {
                    overflowWrap: "break-word"
                }
            };
        });

        return <Card.Group items={items} />;
    }

    /*
        For the provider page to view the record, check if account is
        provider,
        @if route to custom view records with public function classes
        @else route back to /
    */

    render() {
        return (
            <Layout>
                <div>
                    <h3>Existing Health Records</h3>
                    {this.renderRecords()}
                </div>
            </Layout>
        );
    }
}

export default RecordIndex;
