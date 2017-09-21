import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import * as signalR from '../lib/signalr-client';

export interface ConnectedAction {
    type: 'CONNECTED';
    payload: signalR.HubConnection;
}

export interface DisconnectedAction {
    type: 'DISCONNECTED';
}

export interface ConnectionState {
    connected: boolean;
    connection?: signalR.HubConnection;
}

const DefaultState = {
    connected: false
}
var x = 10;
type KnownAction = ConnectedAction | DisconnectedAction;

export const actionCreators = {

    stopListener: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        const state = getState();
        if (state.connection.connected && state.connection.connection) {
            dispatch({ type: 'DISCONNECTED' });
            state.connection.connection.stop();
        }
    },        
    startListener: (): AppThunkAction<KnownAction> => (dispatch, getState) => {

        const transportType = signalR.TransportType.WebSockets;
        const logger = new signalR.ConsoleLogger(signalR.LogLevel.Warning);
        const options = { transport: transportType, logging: logger };

        function getConnection(): signalR.HubConnection {
            const http = new signalR.HttpConnection("/actionsr", options);
            const connection = new signalR.HubConnection(http, options);
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

                function delay(time) {
                    return new Promise((resolve) => {
                        setTimeout(resolve, time);
                    });
                }

                function reconnect(initialTimeout: number, increment: number): Promise<any> {
                    // Create a new connection (it can't restart)
                    newConnection = getConnection();
                    return newConnection.start().then(() => {
                        console.log("signalR connection re-opened");
                        dispatch({ type: 'CONNECTED', payload: newConnection });
                    }).catch(function (err: Error) {
                        if (initialTimeout > 600 * 1000) { // stop trying if we get no connection
                            console.log(`To many retries - stop reconnecting`);
                            return Promise.resolve();
                        }
                        console.log(`Error trying to re-open signalR connection, waiting ${initialTimeout / 1000} sec before retrying...`);
                        return delay(initialTimeout).then(() => {
                            return reconnect(initialTimeout + increment, increment);
                        });
                    });
                }

                const state = getState();
                if (state.connection.connected) { // not if we expressly closed the connection (HMR)

                    if (e) {
                        console.log(`signalR connection closed with message "${e.message}"`);
                    } else {
                        console.log("signalR connection closed");
                    }
                    dispatch({ type: 'DISCONNECTED' });

                    reconnect(10000, 10000);
                }
            }

            return connection;
        }

        var newConnection = getConnection();
        newConnection.start().then(() => {
            console.log("signalR connection opened");
            dispatch({ type: 'CONNECTED', payload: newConnection });
            // connection.invoke('action', 'Hello')
        }).catch((err: Error) => {
            console.log(`Error opening SignalR websocket connection: ${err.message}`);
        });
    }
};

export const reducer: Reducer<ConnectionState> = (state: ConnectionState, action: KnownAction) => {
    switch (action.type) {
        case 'CONNECTED':
            return { connected: true, connection: action.payload };
        case 'DISCONNECTED':
            return { connected: false };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || DefaultState;
};

