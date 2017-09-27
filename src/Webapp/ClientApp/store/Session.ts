import { Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const INIT_SESSION = 'InitSessionAction'

export interface SessionState {
    id: string;
}

export interface InitSessionAction {
    type: 'InitSessionAction'
    payload: string
}

type KnownAction = InitSessionAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    initialize: (id: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        // var id = document.getElementById('session').dataset['id'];
        dispatch({ type: INIT_SESSION, payload: id });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const DefaultSettings: SessionState = { id: undefined };

export const reducer: Reducer<SessionState> = (state: SessionState = DefaultSettings, action: KnownAction) => {
    switch (action.type) {
        case INIT_SESSION:
            return { id: action.payload };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            // const exhaustiveCheck: never = action;
            break;
    }
    return state;
};
