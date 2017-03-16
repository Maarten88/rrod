import React, { Component } from 'react';

export function HOCBaseRender<Props, State, ComponentState>(
    Comp: new () => Component<Props & State, ComponentState>): React.ComponentClass<Props & State> {
    return class HOCBase extends Component<Props & State, State> {
        render() {
            return <Comp {...this.props} {...this.state} />;
        }
    }
}
export function HOCMounted<Props, ComponentState>(
    Comp: new () => Component<Props, ComponentState>, onMount: () => void, onUnmount: () => void) {
    return class HOCWrapper extends HOCBaseRender<Props, undefined, ComponentState>(Comp) {
        // ... Implementation
        componentWillMount() {
            onMount.call(this);
        }
        componentWillUnmount() {
            onUnmount.call(this);
        }
    }
}

export function HOCStateToProps<Props, State, ComponentState>(
    Comp: new () => Component<Props & State, ComponentState>, getState: () => State) {
    return class HOCWrapper extends HOCBaseRender<Props, State, ComponentState>(Comp) {
        // ... Implementation
        constructor() {
            super();
            this.state = getState();
        }
    }
}