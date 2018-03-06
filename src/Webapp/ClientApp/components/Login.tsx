import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link, RouteComponentProps, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { Grid, Col, Row, Button, Checkbox, Form, FormGroup, FormControl, InputGroup, InputGroupAddon, HelpBlock } from 'react-bootstrap';
import { ApplicationState } from '../store/';
import * as LoginStore from '../store/Login';
import { LoginModel } from '../server/LoginModel';
import { HeadTag } from '../lib/react-head';

function head() {
    return <HeadTag key="title" tag="title">RROD - Login</HeadTag>;
}

type LoginProps = LoginStore.LoginState & typeof LoginStore.actionCreators & RouteComponentProps<{}>;

class Login extends React.Component<LoginProps, LoginModel> {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };
    }

    handleChange(e: React.ChangeEvent<any>) { // should be HTMLInputElement
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    private login(event: React.FormEvent<Form>) {
        this.props.login(this.state);
        event.preventDefault();
    }

    getValidationState(): "success" | "warning" | "error" {
        return null;
    }

    queryParam(name: string, location: string): string {
        var results = new RegExp(`[\?&]${name}=([^&#]*)`).exec(location);
        if (results == null) {
            return null;
        }
        else {
            return decodeURIComponent(results[1]) || null;
        }
    }

    renderLoggedIn() {
        var redirect: string;
        // const query = new URLSearchParams(this.props.location.search);
        const returnUrl = this.queryParam('returnUrl', this.props.location.search);
        const isAbsolute = new RegExp('^([a-z]+://|//)', 'i');
        if (returnUrl && !isAbsolute.test(returnUrl)) {
            redirect = returnUrl;
        } else {
            redirect = "/";
        }

        if (redirect === this.props.history.location.pathname)
            return null;

        return (<Grid>
            <Redirect to={redirect} />
        </Grid>);
    }

    renderAnonymous() {
        return <Grid className="omb_login">
            {head()}
            <h2 className="omb_authTitle">Login or <Link to={'/Register'}>Register</Link></h2>
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
                    <Form className="omb_loginForm" onSubmit={(e) => this.login(e)} autoComplete="off">
                        <FormGroup validationState={this.getValidationState()}>
                            <InputGroup>
                                <InputGroup.Addon><i className="fa fa-user" /></InputGroup.Addon>
                                <FormControl name="email" type="text" onChange={(e) => this.handleChange(e)} placeholder="Email" />
                            </InputGroup>
                            <FormControl.Feedback />
                        </FormGroup>

                        <FormGroup validationState={this.props.loginError ? "error" : null}>
                            <InputGroup>
                                <InputGroup.Addon><i className="fa fa-lock" /></InputGroup.Addon>
                                <FormControl name="password" type="password" onChange={(e) => this.handleChange(e)} placeholder="Password" />
                            </InputGroup>
                            <HelpBlock>{this.props.loginError}</HelpBlock>
                        </FormGroup>

                        <Button className="btn btn-lg btn-primary btn-block" type="submit">Login</Button>
                    </Form>
                </Col>
            </Row>

            <Row>
                <Col xs={12} sm={6} smOffset={3} >
                    <Row>
                        <Col sm={6}>
                            <Checkbox>Remember me</Checkbox>
                        </Col>
                        <Col sm={6} className="omb_forgotPwd">
                            <div className="pull-right">
                                <Link to="#">Forgot Password?</Link>
                            </div>
                        </Col>
                    </Row>
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
