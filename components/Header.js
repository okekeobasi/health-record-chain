import React from "react";
import { Menu, Icon, Segment, Dropdown } from "semantic-ui-react";
import { Link, Router } from "../routes";

export default () => {
    return (
        <Segment inverted>
            <Menu style={{ marginTop: "10px" }} inverted secondary>
                <Link route="/">
                    <a className="item">HealthChain</a>
                </Link>

                <Menu.Menu position="right">
                    <Dropdown item text="Provider">
                        <Dropdown.Menu>
                            <Dropdown.Item
                                onClick={() => {
                                    Router.pushRoute("/provider/new");
                                }}
                            >
                                <Icon name="plus" /> New
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    <Link route="/">
                        <a className="item">Records</a>
                    </Link>
                    <Link route="/records/new">
                        <a className="item">
                            <Icon name="plus" />
                        </a>
                    </Link>
                </Menu.Menu>
            </Menu>
        </Segment>
    );
};
