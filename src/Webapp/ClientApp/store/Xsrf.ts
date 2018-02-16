import { fetch } from 'domain-task';
import { Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import * as Cookies from 'js-cookie';
import { ApiModel } from '../server/ApiModel';
import { XsrfModel } from '../server/Xsrf';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const SET_XSRF_TOKEN = 'SetXsrfTokenAction'

export interface XsrfState {
    token: string;
}

export interface SetXsrfTokenAction {
    type: 'SetXsrfTokenAction'
    payload: string
}

type KnownAction = SetXsrfTokenAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    refresh: (): AppThunkAction<KnownAction> => (dispatch, getState): Promise<void> => {
        return (async () => {
            let response = await fetch('/xsrfrefresh', {
                method: 'GET',
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }) as Response;

            if (response.ok) {
                let data = await response.json() as ApiModel<XsrfModel>;
                if (data.result && data.result.status === "OK") {
                    dispatch({ type: SET_XSRF_TOKEN, payload: data.value.xsrfToken });
                } else {
                    dispatch({ type: SET_XSRF_TOKEN, payload: undefined });
                }
            } else {
                dispatch({ type: SET_XSRF_TOKEN, payload: undefined });
            }
        })();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const DefaultSettings: XsrfState = { token: undefined };

export const reducer: Reducer<XsrfState> = (state: XsrfState = DefaultSettings, action: KnownAction) => {
    switch (action.type) {
        case SET_XSRF_TOKEN:
            return { token: action.payload };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            // const exhaustiveCheck: never = action;
            break;
    }
    return state;
};
