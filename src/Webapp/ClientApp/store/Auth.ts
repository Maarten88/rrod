import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

export const TOKEN_REQUEST = 'TokenRequestAction';
export const TOKEN_RECEIVED = 'TokenReceivedAction';
export const TOKEN_ERROR = 'TokenErrorAction';

export interface AuthState {
    requesting: boolean;
    accessToken?: string;
    refreshToken?: string;
    expires?: Date
}

const DefaultAuthState: AuthState = {
    requesting: false
}

interface TokenRequestAction {
    type: 'TokenRequestAction';
}

interface TokenErrorAction {
    type: 'TokenErrorAction';
}

interface TokenResultModel {
    accessToken: string;
    refreshToken: string;
    expires: Date
}

interface TokenReceivedAction {
    type: 'TokenReceivedAction';
    payload: TokenResultModel
}

// TODO import Success and Invalid actions from server and handle them
type KnownAction = TokenRequestAction | TokenReceivedAction | TokenErrorAction;

export const actionCreators = {

    getToken: (): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: TOKEN_REQUEST });

        var xsrf = getState().session.xsrfToken;
        let response = <Response>await fetch('/connect/token', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': xsrf
            },
            body: ""
        });

        if (response.ok) {
            var result: TokenResultModel = await response.json();
            dispatch({ type: TOKEN_RECEIVED, payload: result });

        } else {
            // TODO: display error
            dispatch({ type: TOKEN_ERROR });
        }
    }
};


export const reducer: Reducer<AuthState> = (state: AuthState, action: KnownAction) => {
    switch (action.type) {
        case TOKEN_REQUEST:
            return { ...state, requesting: true };
        case TOKEN_RECEIVED:
            return { requesting: false, accessToken: action.payload.accessToken };
        case TOKEN_ERROR:
            return { ...state, requesting: false };
        default:
            const exhaustiveCheck: never = action;
    }

    return state || DefaultAuthState;
};
