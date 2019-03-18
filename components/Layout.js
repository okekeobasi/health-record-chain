import React from "react";
import Head from "next/head";
import Header from "./Header";
import { Container } from "semantic-ui-react";

export default props => {
    return (
        <Container>
            <Head>
                <link
                    rel="stylesheet"
                    href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.1/dist/semantic.min.css"
                />
                <title>HealthChain</title>
            </Head>

            <Header />
            {props.children}
        </Container>
    );
};
