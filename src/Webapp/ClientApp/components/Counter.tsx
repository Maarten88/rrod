import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState }  from '../store';
import * as CounterStore from '../store/Counter';
import Transition from "react-transition-group/Transition";
import * as Animated from 'animated/lib/targets/react-dom';
import { HeadTag } from '../lib/react-head';

type CounterProps = CounterStore.CounterState & typeof CounterStore.actionCreators;
interface CounterState {
    animate: any;
}

interface CountProps {
    count: number;
}
interface CountState {
    count: number;
    animate: any;
}
class Count extends React.Component<CountProps, CountState> {

    listener: string;
    constructor(props: CountProps) {
        super(props);
        this.state = {
            count: props.count,
            animate: new Animated.Value(1)
        };
    }

    componentDidMount() {
        this.listener = this.state.animate.addListener((state) => {
            // we wait until the animation is almost halfway 
            // before letting the new value show
            if (state.value > 0.4) {
                this.setState({count: this.props.count});
            }
        });
    }
    componentWillUnmount() {
        if (this.listener) {
            this.state.animate.removeListener(this.listener);
        }
    }
    componentWillReceiveProps(nextProps: CountProps) {
        // console.log("componentWillReceiveProps", nextProps, this.props);
        if (nextProps.count !== this.props.count) {
            this.state.animate.setValue(0);
            Animated.spring(this.state.animate, { toValue: 1 }).start(() => {
                // This is to make really sure the displayed value is changed;
                // this state update is also done in the listener, which should 
                // make this change before we are here at the end of the animation
                if (this.state.count !== nextProps.count)
                    this.setState({count: nextProps.count});
            });
        }
    }

    render() {
        const style: React.CSSProperties = {
            transformStyle: "preserve-3d",
            // perspective: "100%",
            // opacity: this.state.animate,
            transform: Animated.template`
                rotateX(${this.state.animate.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["90deg", "0deg"]
                })})` as string
        };        
        return (
            <Transition timeout={5000}>
                <Animated.div style={style}>
                    <div className="count">
                            { this.state.count }
                    </div>
                </Animated.div>
            </Transition>        
        );
    }
}

class Counter extends React.Component<CounterProps, CounterState> {
    componentWillMount() {
        // fetch current data from server
        this.props.request();
    }

    public render() {
        return <div className="container">
            <HeadTag key="title" tag="title">RROD - Counter Page</HeadTag>
            <HeadTag key="meta:description" tag="meta" name="description" content="This page demos the classical Redux Counter sample, adding a realtime eventsourcing actor backend" />
     
            <h1>Counter</h1>

            <p>
                This is an example of a React component. It is connected real-time to the server: start the timer to view server-initiated updates, use "increment" to change the value clientside.
                Refresh the page to see that the value is also rendered serverside.
            </p>

            <div className="row">
                <div className="col-xs-12">
                    <div className="counter">
                        <div className="count-header">Current count</div>
                        <Count count={this.props.count} />
                        </div>
                    </div>
                </div>
            <br />
            
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

