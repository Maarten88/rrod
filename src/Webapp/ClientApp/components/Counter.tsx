import * as React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CounterStore from '../store/Counter';
import * as WeatherForecasts from '../store/WeatherForecasts';

type CounterProps = CounterStore.CounterState & typeof CounterStore.actionCreators;

class Counter extends React.Component<CounterProps, void> {
    componentWillMount() {
        // fetch current data from server
        this.props.request();
    }

    //componentWillReceiveProps(nextProps: CounterProps) {
    //    // This method runs when incoming props (e.g., route params) change
    //    this.props.request();
    //}


    public render() {
        return <div className="container">
            <h1>Counter</h1>

            <p>
                This is an example of a React component. It is connected real-time to the server: start the timer to view server-initiated updates, use "increment" to change the value clientside.
                Refresh the page to see that the value is also rendered serverside.
            </p>

            <p>Current count: <strong>{ this.props.count }</strong></p>

            <button className="btn btn-default" onClick={() => { this.props.increment() }}>Increment</button>
            <button className="btn btn-default" onClick={() => { this.props.decrement() }}>Decrement</button>
            <button className="btn btn-default" disabled={this.props.started} onClick={() => { this.props.start() }}>Start</button>
            <button className="btn btn-default" disabled={!this.props.started} onClick={() => { this.props.stop() }}>Stop</button>
        </div>;
    }
}

// Wire up the React component to the Redux store
export default connect(
    (state: ApplicationState) => state.counter, // Selects which state properties are merged into the component's props
    CounterStore.actionCreators                 // Selects which action creators are merged into the component's props
)(Counter);

// Set up HMR re-rendering.
if (module.hot) {
  module.hot.accept();
}
