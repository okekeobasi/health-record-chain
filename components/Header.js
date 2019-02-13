import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { Link } from "../routes";

export default () => {
    return (
        <Menu style={{ marginTop: "10px" }} inverted>
            <Link route="/">
                <a className="item">HealthChain</a>
            </Link>

            <Menu.Menu position="right">
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
    );
};
