import { fetch, addTask } from 'domain-task';
import { Action, Reducer } from 'redux';
import { AppThunkAction } from './';
import * as Server from '../server/Counter';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface CounterState extends Server.CounterState {
    transitioning: boolean;
}

var DefaultCounterState: CounterState = {
    count: 0,
    started: false,
    transitioning: false
};

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.
const REQUEST_COUNTER = 'RequestCounterAction';
const RECEIVE_COUNTER = 'ReceiveCounterAction';

interface RequestCounterAction { type: 'RequestCounterAction' }
interface ReceiveCounterAction { type: 'ReceiveCounterAction', payload: Server.CounterState }

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCounterAction | ReceiveCounterAction | Server.CounterStartedAction | Server.CounterStoppedAction | Server.DecrementCounterAction | Server.IncrementCounterAction | Server.StartCounterAction | Server.StopCounterAction | Server.SyncCounterStateAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

async function postEffect(url: string, xsrfToken: string, data: any = {}) {
    let response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        cache: "no-cache",
        headers: new Headers({
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken
        }),
        body: JSON.stringify(data)
    });
    return response;
}

export const actionCreators = {
    request: (): AppThunkAction<KnownAction> => (dispatch, getState) => {
        dispatch({ type: REQUEST_COUNTER });
        var state = getState();
        let fetchTask = fetch('/counterstate?id=' + state.session.id, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json() as Promise<CounterState>)
            .then(data => {
                dispatch({ type: RECEIVE_COUNTER, payload: data });
            })
            .catch((error) => {
                console.log('server has no initial counter data');
            });

        addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
    },
    increment: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: Server.INCREMENT_COUNTER });
        var state = getState();
        let response = await postEffect('/incrementcounter', state.xsrf.token);
        console.log(response);
    },
    decrement: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: Server.DECREMENT_COUNTER });
        var state = getState();
        let response = await postEffect('/decrementcounter', state.xsrf.token);
        console.log(response);
    },
    start: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: Server.START_COUNTER });
        var state = getState();
        let response = await postEffect('/startcounter', state.xsrf.token);
        console.log(response);
    },
    stop: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: Server.STOP_COUNTER });
        var state = getState();
        let response = await postEffect('/stopcounter', state.xsrf.token);
        console.log(response);
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<CounterState> = (state: CounterState, action: KnownAction) => {
    switch (action.type) {
        case REQUEST_COUNTER:
            return { ...state, transitioning: true };
        case RECEIVE_COUNTER:
            return { ...DefaultCounterState, ...action.payload };
        case Server.INCREMENT_COUNTER:
            return { ...state, count: state.count + 1 };
        case Server.DECREMENT_COUNTER:
            return { ...state, count: state.count - 1 };
        case Server.START_COUNTER:
            return { ...state, transitioning: true };
        case Server.COUNTER_STARTED:
            return { ...state, transitioning: false, started: true };
        case Server.STOP_COUNTER:
            return { ...state, transitioning: true };
        case Server.COUNTER_STOPPED:
            return { ...state, transitioning: false, started: false };
        case Server.SYNC_COUNTER_STATE:
            return { ...action.payload.counterState, transitioning: false };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || DefaultCounterState;
};
