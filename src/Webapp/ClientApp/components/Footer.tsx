import * as React from 'react';
import { connect } from 'react-redux';
import { Button, FormGroup, Form, ControlLabel, FormControl, HelpBlock } from 'react-bootstrap';
import { ApplicationState } from '../store';
import * as FooterState from '../store/Footer';


type FooterProps = FooterState.FooterState & typeof FooterState.actionCreators;

class Footer extends React.Component<FooterProps, FooterState.EmailForm> {

    constructor(props: FooterProps) {
        super(props);
        this.state = {
            email: ''
        };
        this.handleChange = this.handleChange.bind(this);
    }

    getValidationState = (): "success" | "warning" | "error" => {
        var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
        return emailRegex.test(this.state.email) ? "success" : null;
    }

    handleChange = (e: any) => {
        this.setState({ email: e.target.value });
    }

    submitEmail = (event : React.FormEvent<Form>) => {
        this.props.submitEmail(this.state);
        event.preventDefault();
    }

    submitDisabled = () => {
        return this.props.isSubmitting || this.getValidationState() !== "success";
    }

    public render() {
        return <footer>
            <div className="container">
                <div className="row">
                    <h1>Share the vision!</h1>
                    <div className="header-deveider"></div>
                    <p className="wow fadeInUp">
                        Footer text here.
                    </p>
                </div>

                <div className="row">
                {
                    this.props.submitted
                    ?
                        <div className="subscription-message">{this.props.message}</div>
                    :
                        <Form inline onSubmit={this.submitEmail}>
                        <FormGroup
                            controlId="formBasicText"
                            validationState={this.getValidationState()}
                            >
                            <FormControl
                                type="text"
                                value={ this.state.email }
                                placeholder="Enter your email address"
                                onChange={ this.handleChange }
                                />
                            <FormControl.Feedback />
                        </FormGroup>
                        <Button type="submit" disabled={ this.submitDisabled() }>Keep me informed</Button>
                    </Form>
                }
                </div>

                <div className="row" id="share">
                    <ul className="socials-links">
                            <li><a href="https://www.facebook.com/YourFbPage"><i className="fa fa-facebook-square"></i></a></li>
                            <li><a href="https://twitter.com/YourTwitterHandle"><i className="fa fa-twitter-square"></i></a></li>
                            <li><a href="https://nl.linkedin.com/in/YourLinkedInProfile"><i className="fa fa-linkedin-square"></i></a></li>
                    </ul>
                    <p className="copyright">
                        © 2016 MIT Licenced
                    </p>
                </div>
            </div>
        </footer>
    }
}

export default connect(
    (state: ApplicationState) => state.footer, // Selects which state properties are merged into the component's props
    FooterState.actionCreators                 // Selects which action creators are merged into the component's props
)(Footer);
