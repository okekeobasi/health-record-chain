import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, Router } from "../routes";

class RecordMenu extends Component {
    state = {
        activeItem: ""
    };

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });
        Router.pushRoute(`/records/${this.props.address}/${name}`);
    };

    render() {
        const { activeItem } = this.state;

        return (
            <Menu vertical>
                <Menu.Item
                    name="records"
                    active={activeItem === "records"}
                    onClick={event => {
                        Router.pushRoute(`/records/${this.props.address}`);
                    }}
                >
                    <Icon name="home" />
                    Home
                </Menu.Item>

                <Menu.Item
                    name="appointments"
                    active={activeItem === "appointments"}
                    onClick={this.handleItemClick}
                >
                    <Icon name="calendar alternate outline" />
                    Appointments
                </Menu.Item>

                <Menu.Item
                    name="conditions"
                    active={activeItem === "conditions"}
                    onClick={this.handleItemClick}
                >
                    <Icon name="user md" />
                    Conditions
                </Menu.Item>

                <Menu.Item
                    name="medications"
                    active={activeItem === "medications"}
                    onClick={this.handleItemClick}
                >
                    <Icon name="medkit" />
                    Medications
                </Menu.Item>
            </Menu>
        );
    }
}

export default RecordMenu;
