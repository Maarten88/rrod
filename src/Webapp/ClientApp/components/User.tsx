import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as UserState from '../store/User';

type UserProps = UserState.UserModel & typeof UserState.actionCreators  

class User extends React.Component<UserProps, void> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        // this.props.getUser();
    }
    componentDidMount() {
        // This method runs when the component is first added to the page
        this.props.getUser();
    }

    public render() {
        return <div>
            <h1>User</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            <p>is authenticated: {this.props.isAuthenticated ? 'Yes!' : ':-(' }</p>
            <p>email: {this.props.email}</p>
        </div>;
    }
}

export default connect(
    (state: ApplicationState) => state.user, // Selects which state properties are merged into the component's props
    UserState.actionCreators                 // Selects which action creators are merged into the component's props
)(User);
