import { fetch } from 'domain-task';
import { Action, Reducer } from 'redux';
import { LoginModel } from '../server/LoginModel';
import { AppThunkAction } from './';
import * as Cookies from 'js-cookie';
import { actionCreators as XsrfActionCreators } from './Xsrf';
import { push } from 'react-router-redux';
import { ApiModel } from 'ClientApp/server/ApiModel';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LoginState {
    loggedin: boolean;
    userId?: string;
    loginError?: string;
    userName?: string;
    imageUrl?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';

interface StartLoginAction      { type: 'START_LOGIN' }
interface LoginSuccessAction    { type: 'LOGIN_SUCCESS' }
interface LoginFailedAction     { type: 'LOGIN_FAILED', payload: { error: string }  }
interface StartLogoutAction     { type: 'START_LOGOUT' }
interface LogoutSuccessAction   { type: 'LOGOUT_SUCCESS' }
interface LogoutFailedAction    { type: 'LOGOUT_FAILED' }


// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = | StartLoginAction | LoginSuccessAction | LoginFailedAction | StartLogoutAction | LogoutSuccessAction | LogoutFailedAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    // login: () => <LoginAction>{ type: 'START_LOGIN' },
    login: (loginInput: LoginModel) => (dispatch, getState) => {

        return (async () => {
            dispatch({ type: 'START_LOGIN' });

            try {

                const xsrf = getState().xsrf.token;
                const response = <Response>await fetch('/account/login', {
                    method: 'POST',
                    credentials: 'include',
                    headers: new Headers({
                        'Content-Type': 'application/json',
                        'X-XSRF-TOKEN': xsrf
                    }),
                    body: JSON.stringify(loginInput)
                });

                if (response.ok) {
                    // Get updated xsrf token
                    dispatch(XsrfActionCreators.refresh());
                    // Get updated menu; we may get extra options based on our role
                    // dispatch(NavMenuActionCreators.fetchMenu());
                    // will redirect
                    dispatch({ type: 'LOGIN_SUCCESS' });

                    dispatch(push(loginInput.returnUrl || '/'));
                } else {
                    const model: ApiModel<LoginModel> = await response.json();
                    dispatch({ type: 'LOGIN_FAILED', payload: { error: model.result.message || "Login failed" } });
                }
            }
            catch (e) {
                dispatch({ type: 'LOGIN_FAILED', payload: { error: e.message || "Login error" } });
            }
        })();
    },
    logout: () => (dispatch, getState) => {
        return (async () => {
            dispatch({ type: 'START_LOGOUT' });

            var xsrf = getState().xsrf.token;
            let response = <Response>await fetch('/account/logout', {
                method: 'POST',
                credentials: 'include',
                headers: new Headers({
                    'X-XSRF-TOKEN': xsrf
                })
            });

            if (response.ok) {
                // Get updated xsrf token
                dispatch(XsrfActionCreators.refresh());
                // Get updated menu; we may get extra options based on our role
                // dispatch(NavMenuActionCreators.fetchMenu());
                // dispatch(push('/'));
                dispatch({ type: 'LOGOUT_SUCCESS' });

                dispatch(push('/'));

            } else {
                dispatch({ type: 'LOGOUT_FAILED' });
            }
        })();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

export const reducer: Reducer<LoginState> = (state: LoginState, action: KnownAction) => {
    switch (action.type) {
        case 'START_LOGIN':
            return { loggedin: false };
        case 'LOGIN_SUCCESS':
            return { loggedin: true };
        case 'LOGIN_FAILED':
            return { ...state, loggedIn: false, loginError: action.payload.error };
        case 'START_LOGOUT':
            return { loggedin: true };
        case 'LOGOUT_SUCCESS':
            return { loggedin: false };
        case 'LOGOUT_FAILED':
            return { loggedin: true };

        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    // For unrecognized actions (or in cases where actions have no effect), must return the existing state
    //  (or default initial state if none was supplied)
    return state || { loggedin: false };
};
