import * as React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Well, Panel, PanelGroup, Button, FormGroup, Form, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { ApplicationState } from '../store';
import * as ContactStore from '../store/Contact';
import { ContactModel } from '../server/Contact';
import { HeadTag } from '../lib/react-head';

type ContactProps = ContactStore.ContactState & { xsrfToken: string } & typeof ContactStore.actionCreators;

const initialForm: ContactModel = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
}

class Contact extends React.Component<ContactProps, ContactModel> {

    constructor(props: ContactProps) {
        super(props);
        this.state = { ...initialForm, ...props.form };
    }


    componentWillReceiveProps(nextProps: ContactProps) {
        if (this.state !== nextProps.form)
            this.setState(nextProps.form)
    }

    handleChange = (e: any) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    submit = (event: React.FormEvent<Form>) => {
        this.props.submitContactForm(this.state);
        event.preventDefault();
    }

    public render() {
        return <Grid>
            <HeadTag key="title" tag="title">RROD - Contact</HeadTag>
            <HeadTag key="meta:description" tag="meta" name="description" content="Contact page. This shows a universal webform" />
            
            <h1>Contact us</h1>
            <Row>
                <Col md={6}>
                    <Well bsSize="sm">
                        <Form horizontal method="post" onSubmit={this.submit}>
                            <input type="hidden" name="requestVerificationToken" defaultValue={this.props.xsrfToken} />
                            <fieldset>
                                <legend className="text-center header">Contact</legend>
                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="firstName" type="text" onChange={this.handleChange} value={this.state.firstName} placeholder="First name" />
                                    </Col>
                                </FormGroup>
                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="lastName" type="text" onChange={this.handleChange} value={this.state.lastName} placeholder="Last name" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="email" type="text" onChange={this.handleChange} value={this.state.email} placeholder="Email" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl name="phone" type="text" onChange={this.handleChange} value={this.state.phone} placeholder="Phone" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col md={10} mdOffset={1}>
                                        <FormControl componentClass="textarea" name="message" rows={7} onChange={this.handleChange} value={this.props.form.message} placeholder="Enter a message here. We'll get back to you within two business days" />
                                    </Col>
                                </FormGroup>

                                <FormGroup>
                                    <Col md={11} className="text-center">
                                        <Button type="submit" bsSize="lg" bsStyle="primary" disabled={this.props.isSubmitting}>{this.props.isSubmitting ? "Spinner" : "Send"}</Button>
                                    </Col>
                                </FormGroup>
                                <hr />
                                <FormGroup>
                                    <Col md={11} className="text-center">
                                        <FormControl.Static>{this.props.submitted ? this.props.result : ""}</FormControl.Static>
                                    </Col>
                                </FormGroup>

                            </fieldset>
                        </Form>
                    </Well>
                </Col>
                <Col md={6}>
                    <Panel>
                        <Panel.Heading>
                            <h3>Adres</h3>
                        </Panel.Heading>
                        <div className="text-center header">
                            <div>
                                Street address<br />
                                City<br />
                                Country<br />
                                Email<br />
                            </div>
                            <hr />
                            <div id="map1" className="map">
                                <a href="https://www.google.nl/maps/dir//Your%020Address">
                                    <img className="img-responsive" src='/images/Map.png' />
                                </a>
                            </div>
                        </div>
                    </Panel>
                </Col>
            </Row>
            <h2>This demo was built by</h2>
            <h4>Maarten Sikkema</h4>
        </Grid>

    }
}

export default connect(
    (state: ApplicationState) => {
        return { ...state.contact, xsrfToken: state.xsrf.token }
    }, 
    ContactStore.actionCreators
)(Contact);
