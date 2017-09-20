import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import * as signalR from '@aspnet/signalr-client';

export interface ConnectedAction {
    type: 'CONNECTED'
}

export interface DisconnectedAction {
    type: 'DISCONNECTED'
}

export interface ConnectionState {
    connected: boolean;
}

const DefaultState = {
    connected: false
}

type KnownAction = ConnectedAction | DisconnectedAction;

export const actionCreators = {

    startListener: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {

        let transportType = signalR.TransportType.WebSockets;
        let logger = new signalR.ConsoleLogger(signalR.LogLevel.Trace);
        let http = new signalR.HttpConnection("/actionsr", { transport: transportType, logging: logger });
        let connection = new signalR.HubConnection(http, { transport: transportType, logging: logger });
        // let connection = new signalR.HubConnection('/actionsr');

        connection.on('action', action => {
            console.log(action);
            if (action && action.type) {
                dispatch(action);
            } else {
                console.log('websocket received unknown data!')
            }
        });
        
        connection.onClosed = (e: Error) => {
            if (e) {
                console.log(`signalR connection closed with message "${e.message}"`);
            } else {
                console.log("signalR connection closed");
            }
            dispatch({ type: 'DISCONNECTED' });

            // TODO: try to reopen here in a settimeout loop
        }

        connection.start().then(() => {
            console.log("signalR connection opened");
            dispatch({ type: 'CONNECTED' });
            connection.invoke('action', 'Hello')
        }).catch(err => {
            console.log(err, 'red');
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