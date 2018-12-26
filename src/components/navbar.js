import React from 'react';
import PropTypes from 'prop-types';
import deamonStatus from "../services/api"
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav, InputGroup, Input,
	NavItem,
	NavLink,
	UncontrolledDropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem
} from 'reactstrap';

export default class NavBar extends React.Component {
	constructor(props) {
		super(props);

		this.toggle = this.toggle.bind(this);
		this.state = {
			isOpen: false,
		};

	}


	toggle() {
		this.setState({
			isOpen: !this.state.isOpen
		});
	}
	render() {
		return (
			<div>
				<Navbar style={{ backgroundColor: "#60a839" }} dark expand="md">
					<div className="container">
						<NavbarBrand href="/">
							<img src="https://scrapy.org/favicons/apple-touch-icon-180x180.png" height="30px" alt="" />
							&nbsp;Scrapyd Ui</NavbarBrand>
						<NavbarToggler onClick={this.toggle} />
						<Collapse isOpen={this.state.isOpen} navbar>
							<Nav className="ml-auto" navbar>
								<NavItem>
									<NavLink href="https://github.com/reactstrap/reactstrap">GitHub{!this.state.isNewHostValid}</NavLink>
								</NavItem>
								<UncontrolledDropdown nav inNavbar>
									<DropdownToggle nav caret>
										Options
                </DropdownToggle>
									<DropdownMenu right>
										<DropdownItem>
											Option 1
                  </DropdownItem>
										<DropdownItem>
											Option 2
                  </DropdownItem>
										<DropdownItem divider />
										<DropdownItem>
											Reset
                  </DropdownItem>
									</DropdownMenu>
								</UncontrolledDropdown>
							</Nav>
						</Collapse>
					</div>
				</Navbar>
			</div>
		);
	}
}
NavBar.prototypes = {
	onHostChange: PropTypes.func.isRequired,
}