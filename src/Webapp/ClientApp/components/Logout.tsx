import * as React from 'react';
import { connect } from 'react-redux'
import { ApplicationState } from '../store';
import * as LoginStore from '../store/Login';

type LogoutProps = LoginStore.LoginState & typeof LoginStore.actionCreators;

class Logout extends React.Component<LogoutProps> {

    componentWillMount() {
        this.props.logout();
    }

    render() {
        return null
    }
}

export default connect(
    (state: ApplicationState) => state.login, // Selects which state properties are merged into the component's props
    LoginStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Logout);
