import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import { Navbar, Nav, NavItem, NavDropdown, MenuItem } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

const logo = require('../images/logo.svg') as string;

interface NavMenuProps {
    isAuthenticated: boolean;
    roles: string[];
}

class NavMenu extends React.Component<NavMenuProps> {
    public render() {
        return <Navbar fixedTop={true}>
            <Navbar.Header>
                <Navbar.Brand>
                    <Link className='navbar-brand' to={'/'}><img src={ logo } alt="RROD Logo" />RROD</Link>
                </Navbar.Brand>
                <Navbar.Toggle />
            </Navbar.Header>
            <Navbar.Collapse>
                <Nav pullRight>
                    <LinkContainer to="/contact">
                        <NavItem eventKey={1}>Contact</NavItem>
                    </LinkContainer>
                    <LinkContainer to="/counter">
                        <NavItem eventKey={3}>Counter</NavItem>
                    </LinkContainer>
                    <NavDropdown eventKey={2} title="Login" id="nav-dropdown">
                        <LinkContainer to="/login">
                            <MenuItem disabled={this.props.isAuthenticated} eventKey={2.1}>Login</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/register">
                            <MenuItem disabled={this.props.isAuthenticated} eventKey={2.2}>Register</MenuItem>
                        </LinkContainer>
                        <LinkContainer to="/user">
                            <MenuItem eventKey={2.3}>User Profile</MenuItem>
                        </LinkContainer>
                        <MenuItem divider />
                        <LinkContainer to="/logout">
                            <MenuItem disabled={!this.props.isAuthenticated} eventKey={2.4}>Logout</MenuItem>
                        </LinkContainer>
                    </NavDropdown>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    }
}

export default connect(
    (state: ApplicationState) => { return { isAuthenticated: state.login.loggedin, roles: [] }; }, // Selects which state properties are merged into the component's props
    {}                 // Selects which action creators are merged into the component's props
)(NavMenu);