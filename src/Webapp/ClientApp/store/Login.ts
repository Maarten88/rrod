import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { LoginInputModel } from '../server/LoginInputModel';
import { browserHistory } from 'react-router';
import { actionCreators as userActionCreators, GetUserReceivedAction, GetUserRequestAction, UserModel }  from './User';
import { LogoutInputModel } from '../server/LogoutInputModel';

export const LOGIN_REQUEST = 'LoginRequestAction';
export const LOGIN_SUCCESS = 'LoginSuccessAction';
export const LOGIN_INVALID = 'LoginInvalidAction';
export const LOGIN_ERROR = 'LoginErrorAction';
export const LOGOUT_REQUEST = 'LogoutRequestAction';
export const LOGOUT_SUCCESS = 'LogoutSuccessAction';
export const LOGOUT_ERROR = 'LogoutErrorAction';

export interface LoginState {
    authenticating: boolean;
    authenticated: boolean;
}

const DefaultLoginState: LoginState = {
    authenticating: false,
    authenticated: false
}

interface LoginRequestAction {
    type: 'LoginRequestAction';
}

interface LoginErrorAction {
    type: 'LoginErrorAction';
}

export interface LoginSuccessAction {
    type: 'LoginSuccessAction';
}

interface LoginInvalidAction {
    type: 'LoginInvalidAction';
}

interface LogoutErrorAction {
    type: 'LogoutErrorAction';
}

interface AuthenticatedAction {
    type: 'AuthenticatedAction';
    idToken: any;
    authToken: string;
}

interface LogoutRequestAction {
    type: 'LogoutRequestAction';
}

interface LogoutSuccessAction {
    type: 'LogoutSuccessAction';
}

// TODO import Success and Invalid actions from server and handle them
type KnownAction = LoginRequestAction | LoginErrorAction | LoginSuccessAction | LoginInvalidAction | LogoutRequestAction | LogoutErrorAction | LogoutSuccessAction;

export const actionCreators = {

    login: (loginInput: LoginInputModel): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: LOGIN_REQUEST });

        var xsrf = getState().session.xsrfToken;
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
            dispatch({ type: LOGIN_SUCCESS });
            dispatch(userActionCreators.getUser() as any);
            browserHistory.push('/');
        } else {
            // TODO: display error
            dispatch({ type: LOGIN_ERROR });
        }
    },
    logout: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: LOGIN_REQUEST });

        var xsrf = getState().session.xsrfToken;
        let response = <Response>await fetch('/account/logout', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'X-XSRF-TOKEN': xsrf
            }
        });

        if (response.ok) {
            dispatch({ type: LOGOUT_SUCCESS });
            browserHistory.push('/');
        } else {
            dispatch({ type: LOGOUT_ERROR });
        }
    }

};


export const reducer: Reducer<LoginState> = (state: LoginState, action: KnownAction) => {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { authenticating: true, authenticated: false };
        case LOGIN_ERROR:
            return { authenticating: false, authenticated: false };
        case LOGIN_SUCCESS:
            return { authenticating: false, authenticated: true };
        case LOGIN_INVALID:
            return { authenticating: false, authenticated: false };
        case LOGOUT_REQUEST:
            return { authenticating: true, authenticated: true };
        case LOGOUT_ERROR:
            return { authenticating: false, authenticated: true };
        case LOGOUT_SUCCESS:
            return { authenticating: false, authenticated: false };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || DefaultLoginState;
};
