import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Grid, Col, Row, Button, Checkbox, Form, FormGroup, FormControl, InputGroup, InputGroupAddon, ControlLabel } from 'react-bootstrap';
import { ApplicationState } from '../store';
import * as RegisterStore from '../store/Register';

type RegisterProps = RegisterStore.RegisterState & typeof RegisterStore.actionCreators;

interface RegisterState {
    userName: string;
    password: string;
}

class Register extends React.Component<RegisterProps, RegisterState> {

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
    private register(event: React.FormEvent<Form>) {
        this.props.register({ email: this.state.userName, password: this.state.password, confirmPassword: this.state.password });
        event.preventDefault();
    }

    @autobind
    getValidationState(): "success" | "warning" | "error" {
        return null;
    }

    public render() {
        return <Grid>
            <h1>Register new account</h1>
            <hr/>
            <Form horizontal onSubmit={this.register} autoComplete="on">
                <FormGroup name="userName" validationState={this.getValidationState()}>
                    <Col componentClass={ControlLabel} sm={2}>
                        Email
                    </Col>
                    <Col sm={10}>
                        <FormControl name="userName" type="text" onChange={this.handleChange} placeholder="Email" />
                        <FormControl.Feedback />
                    </Col>
                </FormGroup>

                <FormGroup name="password">
                    <Col componentClass={ControlLabel} sm={2}>
                        Password
                    </Col>
                    <Col sm={10}>
                        <FormControl name="password" type="password" onChange={this.handleChange} placeholder="Password" />
                    </Col>
                    <FormControl.Feedback />
                </FormGroup>

                <FormGroup>
                    <Col smOffset={2} sm={10}>
                        <Button className="btn btn-primary" type="submit">Register</Button>
                    </Col>
                </FormGroup>
            </Form>
        </Grid>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.register, // Selects which state properties are merged into the component's props
    RegisterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Register);
