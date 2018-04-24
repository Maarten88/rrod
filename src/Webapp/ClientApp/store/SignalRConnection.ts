import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import * as SignalR from '../lib/signalr';

export interface ConnectedAction {
    type: 'CONNECTED';
}

export interface DisconnectedAction {
    type: 'DISCONNECTED';
}

export interface ConnectionState {
    connected: boolean;
}

const DefaultState = {
    connected: false
}

var connection: SignalR.HubConnection;

type KnownAction = ConnectedAction | DisconnectedAction;

export const actionCreators = {

    stopListener: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        if (state.connection.connected && connection) {
            connection.stop();
            dispatch({ type: 'DISCONNECTED' });
        }
    },        
    startListener: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        const state = getState();
        if (state.connection.connected && connection)
            return;

        const transportType = SignalR.TransportType.WebSockets;
        /// const transportType = signalR.TransportType.LongPolling; // for IE9
        // const logger = new signalR.ConsoleLogger(signalR.LogLevel.Warning);
        // const options = { transport: transportType /*, logging: logger */};

        // const http = new signalR.HttpConnection("/actionsr", options);
        connection = new SignalR.HubConnection('/actionsr', { transport: transportType });

        connection.on('action', action => {
            if (action && action.type) {
                // console.log('action ' + action.type);
                dispatch(action);
            } 
        });

        connection.onclose((e: Error) => {
            dispatch({ type: 'DISCONNECTED' });
            connection = undefined;
        });

        connection.start().then(() => {
            dispatch({ type: 'CONNECTED' });
        }).catch((err: Error) => {
            console.log(`Error opening SignalR websocket connection: ${err.message}`);
        });
    }
};

export const reducer: Reducer<ConnectionState> = (state: ConnectionState, action: KnownAction) => {
    switch (action.type) {
        case 'CONNECTED':
            return { connected: true };
        case 'DISCONNECTED':
            return { connected: false };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || DefaultState;
};
