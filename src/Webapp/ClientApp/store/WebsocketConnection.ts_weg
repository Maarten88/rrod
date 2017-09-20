import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

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

        var uri = (window.location.protocol === "http:" ? "ws://" : "wss://") + window.location.host + "/actions";
        var socket = new WebSocket(uri);
        socket.onopen = function (e) {
            console.log("opened " + uri);
            dispatch({ type: 'CONNECTED' });
        };
        socket.onclose = function (e) {
            console.log("closed");
            dispatch({ type: 'DISCONNECTED' });
            socket = null;
        };

        socket.onmessage = function (e) {
            console.log("Received: " + e.data);
            var action = JSON.parse(e.data);
            if (action && action.type) {
                dispatch(action);
            } else {
                console.log('websocket received unknown data!')
            }
        };

        socket.onerror = function (e: ErrorEvent) {
            if (e.error)
                console.log("Error: " + e.error);
        };
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