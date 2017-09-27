import * as React from 'react';
import { connect } from 'react-redux'
import { ApplicationState } from '../store';
import { Redirect } from 'react-router-dom';
import * as LoginStore from '../store/Login';
import Fullscreen from '../lib/fullscreen'


type LogoutProps = LoginStore.LoginState & typeof LoginStore.actionCreators;

class Logout extends React.Component<LogoutProps> {

    componentDidMount() {
        this.props.logout();
    }

    render() {
        if (this.props.loggedin) {
            return (
                <Fullscreen>
                    <div className="container">Logging out....</div>
                </Fullscreen>
            );
        } else {
            return <Redirect to="/" />;
        }
    }
}

export default connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators
)(Logout);
