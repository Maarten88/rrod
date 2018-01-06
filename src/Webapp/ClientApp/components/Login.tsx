import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Col, Row, Button, Checkbox, Form, FormGroup, FormControl, InputGroup, InputGroupAddon } from 'react-bootstrap';
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';
import { LoginInputModel } from '../server/LoginInputModel';
import { Redirect } from 'react-router-dom';

type LoginProps = LoginStore.LoginState & typeof LoginStore.actionCreators & RouteComponentProps<{}>;

class Login extends React.Component<LoginProps, LoginInputModel> {

    constructor(props: LoginProps) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleChange = (e: any) => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    login = (event: React.FormEvent<Form>) => {
        this.props.startLogin(this.state);
        event.preventDefault();
    }

    getValidationState = (): "success" | "warning" | "error" => {
        return null;
    }

    public renderLoggedIn() {
        return <Grid>
            <h1>Logged in as { this.props.userName }</h1>

           <Redirect to="/" />
        </Grid>;
    }

    public renderAnonymous() {
        return <Grid className="omb_login">
            <h3 className="omb_authTitle">Login or <Link to={'/Register'}>Register as new user</Link></h3>
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
                    <span className="omb_spanOr">or</span>
			    </Col>
            </Row>

            <Row>
                <Col xs={12} sm={6} smOffset={3} >
                    <Form className="omb_loginForm" onSubmit={this.login} autoComplete="off">
                        <FormGroup validationState={this.getValidationState()}>
                            <InputGroup>
                                <InputGroup.Addon><i className="fa fa-user" /></InputGroup.Addon>
                                <FormControl name="email" type="text" onChange={this.handleChange} placeholder="Email adres" />
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
                        <Checkbox>Keep me logged in</Checkbox>
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
        if (this.props.loggedin)
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
