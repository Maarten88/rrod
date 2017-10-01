import { fetch } from 'domain-task';
import { Action, Reducer } from 'redux';
import { LoginInputModel } from '../server/LoginInputModel';
import { LoginResponseModel } from '../server/LoginResponseModel';
import { AppThunkAction } from './';
import * as Cookies from 'js-cookie';
import { actionCreators as XsrfActionCreators } from './Xsrf';
import { push } from 'react-router-redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface LoginState {
    loggedin: boolean;
    userId?: string;
    userName?: string;
    imageUrl?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.
// Use @typeName and isActionType for type detection that works even after serialization/deserialization.

export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

interface StartLoginAction      { type: 'START_LOGIN' }
interface LoginSuccessAction    { type: 'LOGIN_SUCCESS' }
interface LoginFailedAction     { type: 'LOGIN_FAILED' }
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
    loginSuccess: () => (dispatch, getState) => {
        return (async () => {
            // Get updated xsrf token
            await dispatch(XsrfActionCreators.refresh());
            // Get updated menu; we may get extra options based on our role
            // dispatch(NavMenuActionCreators.fetchMenu());
    
            dispatch({ type: 'LOGIN_SUCCESS' });
            
            // Navigate home -- we'll do that with a Redirect component render
            // dispatch(push('/'));
        })();
    },
    startLogin: (loginInput: LoginInputModel) => (dispatch, getState) => {
        dispatch({ type: 'START_LOGIN' });

        return (async () => {
            var xsrf = getState().xsrf.token;
            let response = <Response>await fetch('/account/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': xsrf
                },
                body: JSON.stringify(loginInput)
            });

            if (response.ok) {
                await dispatch(actionCreators.loginSuccess());
            } else {
                // TODO: display error
                dispatch({ type: 'LOGIN_FAILED' });
            }
        })();
    },
    logout: () => (dispatch, getState) => {

        dispatch({ type: 'START_LOGOUT' });

        return (async () => {
            var xsrf = getState().xsrf.token;
            let response = <Response>await fetch('/account/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'X-XSRF-TOKEN': xsrf
                }
            });

            if (response.ok) {
                // Get updated xsrf token. this actioncreator returns a promise, so we can await the call
                await dispatch(XsrfActionCreators.refresh());
                
                // wait a second to see the transition
                await new Promise(resolve => setTimeout(() => resolve(), 1000));

                dispatch({ type: 'LOGOUT_SUCCESS' });
                // Get updated menu; we may get extra options based on our role
                // dispatch(NavMenuActionCreators.fetchMenu());
                // dispatch(push('/'));
            } else {
                dispatch({ type: 'LOGOUT_FAILED' });
            }
        })();
    }

    //login: (uid: string, pwd: string) => async (dispatch, getState) => {

    //    dispatch({ type: 'START_LOGIN' });
    //    var data = {
    //        username: uid,
    //        password: pwd,
    //        client_id: "https://projectatenta.local/",
    //        client_secret: "secret_secret_secret",
    //        // redirect_uri: "https://projectatenta.local/signin-oidc",
    //        grant_type: "password",
    //        // specify the resource, to match the audience in the jwt bearer middleware
    //        resource: "https://account.projectatenta.local/",
    //        // offline_access: indicate refresh token is required
    //        // profile: include custom fields
    //        // email: include email address
    //        scope: "offline_access profile email"
    //    };
    //    var body = "";
    //    for (var key in data) {
    //        if (body.length) {
    //            body += "&";
    //        }
    //        body += key + "=";
    //        body += encodeURIComponent(data[key]);
    //    }

    //    let response = await fetch('https://account.projectatenta.local/connect/token', {
    //        method: 'POST',
    //        body: body,
    //        headers: new Headers({
    //            'Content-Type': 'application/x-www-form-urlencoded'
    //        })
    //    });
    //    if (response.ok) {
    //        let json = await response.json();
    //        let token = decodeToken(json.access_token);
    //        dispatch({ type: 'LOGGEDIN', userId: token.uid, userName: token.unique_name });
    //    }
    //},
    // logout: () => <StartLogoutAction>{ type: 'LOGOUT' }
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
            return { loggedin: false };
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
