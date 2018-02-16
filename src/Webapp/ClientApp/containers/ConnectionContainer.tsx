import * as React from 'react';
import { connect } from 'react-redux';
import { ConnectionState, actionCreators } from '../store/SignalRConnection';
import { ApplicationState } from '../store/';

type ConnectionProps = ConnectionState & typeof actionCreators & { children: React.ReactNode };

class ConnectionContainer extends React.Component<ConnectionProps> {

    componentDidMount() {
        this.props.startListener();
    }

    componentWillUnmount() {
        this.props.stopListener();
    }

    render() {
        return <div>{this.props.children}</div>;
    }
}

export default connect(
    (state: ApplicationState) => state.connection,
    { ...actionCreators }
)(ConnectionContainer);
