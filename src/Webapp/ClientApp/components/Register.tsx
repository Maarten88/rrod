import * as React from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Grid, Row, Col, Well, Panel, PanelGroup, Button, FormGroup, Form, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { ApplicationState } from '../store/index';
import * as RegisterStore from '../store/Register';
import Footer from './Footer';
import { RegisterModel } from '../server/RegisterModel'

type RegisterProps = RegisterStore.RegisterState & typeof RegisterStore.actionCreators & RouteComponentProps<{}>;

const initialForm: RegisterModel = {
    email: '',
    password: '',
    confirmPassword: ''
}

class Register extends React.Component<RegisterProps, RegisterModel> {

    constructor(props: RegisterProps) {
        super(props);
        this.state = { ...initialForm, ...props.form };
    }


    componentWillReceiveProps(nextProps: RegisterProps) {
        if (this.state !== nextProps.form)
            this.setState(nextProps.form)
    }

    handleChange = (e: any) => {
        this.setState({ ...this.state, [e.target.name]: e.target.value });
    }

    submit = (event: React.FormEvent<Form>) => {
        this.props.submitRegistrationForm(this.state);
        event.preventDefault();
    }

    render() {
        if (this.props.result && this.props.result.success) {
            return <Redirect to="/" />;
        } else {
            return this.renderForm();
        }
    }

    renderForm() { // TODO errorhandling
        return <Grid fluid>
            <Row>
                <Grid>
                    <h1>New user</h1>
                    <Well bsSize="sm">
                        <Form horizontal action="/contact" method="post" onSubmit={this.submit}>
                            <fieldset>
                                <legend className="text-center header">Register your account</legend>
                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="email" type="text" onChange={this.handleChange} value={this.state.email} placeholder="email@domain.com" />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="password" type="password" onChange={this.handleChange} value={this.state.password} placeholder="Password" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="confirmPassword" type="password" onChange={this.handleChange} value={this.state.confirmPassword} placeholder="Confirm password" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col md={11} className="text-center">
                                        <Button type="submit" bsSize="lg" bsStyle="primary" disabled={this.props.isSubmitting}>{ this.props.isSubmitting ? "Spinner" : "Register" }</Button>
                                    </Col>
                                </FormGroup>
                            </fieldset>
                        </Form>
                    </Well>
                </Grid>
            </Row>
            <br />
            {/* <Row id="footer">
                <Footer />
            </Row> */}
        </Grid>
    }
}

export default connect(
    (state: ApplicationState) => state.register, // Selects which state properties are merged into the component's props
    RegisterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Register);
