import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Grid, Col, Row, Button, Checkbox, Form, FormGroup, FormControl, InputGroup, InputGroupAddon } from 'react-bootstrap';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

type LoginProps = LoginStore.LoginState & typeof LoginStore.actionCreators;

interface LoginState {
    userName: string;
    password: string;
}

class Login extends React.Component<LoginProps, LoginState> {

    constructor() {
        super();
        this.state = {
            userName: '',
            password: ''
        };
    }

    @autobind
    handleChange(e: any) {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    @autobind
    private login(event: React.FormEvent<Form>) {
        this.props.login({ email: this.state.userName, password: this.state.password, rememberLogin: true, returnUrl: '/' });
        event.preventDefault();
    }

    @autobind
    getValidationState(): "success" | "warning" | "error" {
        return null;
    }

    public renderLoggedIn() {
        return <Grid>
            <h1>U bent ingelogd!</h1>

            <form action="~/account" method="post">
                <button className="btn btn-lg btn-warning" type="submit">Query the resource controller</button>
            </form>

            <a className="btn btn-lg btn-danger" href="/signout">Sign out</a>
        </Grid>
    }

    public renderAnonymous() {
        return <Grid className="omb_login">
            <h3 className="omb_authTitle">Login of <Link to={'/Register'}>Registreer</Link></h3>
            <Row className="omb_socialButtons">
                <Col xs={4} sm={2} smOffset={3} >
                    <Link to="#" className="btn btn-lg btn-block omb_btn-facebook">
                        <i className="fa fa-facebook visible-xs"></i>
                        <span className="hidden-xs">Facebook</span>
                    </Link>
                </Col>
                <Col xs={4} sm={2} >
                    <Link to="#" className="btn btn-lg btn-block omb_btn-twitter">
                        <i className="fa fa-twitter visible-xs"></i>
                        <span className="hidden-xs">Twitter</span>
                    </Link>
                </Col>
                <Col xs={4} sm={2} >
                    <Link to="#" className="btn btn-lg btn-block omb_btn-google">
                        <i className="fa fa-google-plus visible-xs"></i>
                        <span className="hidden-xs">Google+</span>
                    </Link>
                </Col>
            </Row>

            <Row className="omb_loginOr">
                <Col xs={12} sm={6} smOffset={3} >
                    <hr className="omb_hrOr" />
                    <span className="omb_spanOr">of</span>
			    </Col>
            </Row>

            <Row>
                <Col xs={12} sm={6} smOffset={3} >
                    <Form className="omb_loginForm" onSubmit={this.login} autoComplete="off">
                        <FormGroup validationState={this.getValidationState()}>
                            <InputGroup>
                                <InputGroup.Addon><i className="fa fa-user" /></InputGroup.Addon>
                                <FormControl name="userName" type="text" onChange={this.handleChange} placeholder="Login Naam" />
                            </InputGroup>
                            <FormControl.Feedback />
                        </FormGroup>

                        <FormGroup>
                            <InputGroup>
                                <InputGroup.Addon><i className="fa fa-lock" /></InputGroup.Addon>
                                <FormControl name="password" type="password" onChange={this.handleChange} placeholder="Password" />
                            </InputGroup>
                            <FormControl.Feedback />
                        </FormGroup>

                        <Button className="btn btn-lg btn-primary btn-block" type="submit">Inloggen</Button>
    				</Form>
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={3} smOffset={3}>
                    <FormGroup>
                        <Checkbox>Onthou mij</Checkbox>
                    </FormGroup>
    			</Col>
                <Col xs={12} sm={3}>
                    <p className="omb_forgotPwd">
                        <Link to="#">Password vergeten?</Link>
                    </p>
                </Col>
            </Row>	    
        </Grid>
    }

    public render() {
        if (this.props.authenticated)
            return this.renderLoggedIn();
        else
            return this.renderAnonymous();
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Login);
