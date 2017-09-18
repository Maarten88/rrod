import * as React from 'react';
import { Link } from 'react-router-dom';
import { Grid } from 'react-bootstrap';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as UserState from '../store/User';

type UserProps = UserState.UserModel & typeof UserState.actionCreators  

class User extends React.Component<UserProps> {
    componentWillMount() {
        // This method runs when the component is first added to the page
        // this.props.getUser();
    }
    componentDidMount() {
        // This method runs when the component is first added to the page
        this.props.getUser();
    }

    public render() {
        return <Grid>
            <h1>User</h1>
            <p>This component demonstrates fetching data from the server and working with URL parameters.</p>
            <p>User is authenticated: {this.props.isAuthenticated ? 'Yes! :-)' : 'No :-(' }</p>
            <p>User email: {this.props.email}</p>
        </Grid>;
    }
}

export default connect(
    (state: ApplicationState) => state.user, // Selects which state properties are merged into the component's props
    UserState.actionCreators                 // Selects which action creators are merged into the component's props
)(User);
