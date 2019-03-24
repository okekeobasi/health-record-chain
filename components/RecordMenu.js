import React, { Component } from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link, Router } from "../routes";

class RecordMenu extends Component {
    state = {
        activeItem: "",
        providerActive: false
    };

    static defaultProps = {
        providerActive: false
    };

    handleItemClick = (e, { name }) => {
        this.setState({ activeItem: name });

        if (this.props.providerActive) {
            Router.pushRoute(`/provider/records/${this.props.address}/${name}`);
        } else {
            Router.pushRoute(`/records/${this.props.address}/${name}`);
        }
    };

    userMenu = () => {
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
                    name="personal"
                    active={activeItem === "personal"}
                    onClick={this.handleItemClick}
                >
                    <Icon name="address card" />
                    Personal
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
    };

    providerMenu = () => {
        const { activeItem } = this.state;

        return (
            <Menu vertical>
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
    };

    render() {
        return this.props.providerActive
            ? this.providerMenu()
            : this.userMenu();
    }
}

export default RecordMenu;
