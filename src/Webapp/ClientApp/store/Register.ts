import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { RegisterViewModel } from '../server/RegisterViewModel';
import * as Server from '../server/User';
import { browserHistory } from 'react-router';
import { LOGIN_SUCCESS, LoginSuccessAction } from './Login';

export const REGISTER_REQUEST = 'RegisterRequestAction';
export const REGISTER_SUCCESS = 'RegisterSuccessAction';
export const REGISTER_ERROR = 'RegisterErrorAction';

export interface RegisterState {
    requesting: boolean;
    registered: boolean;
    errors: any;
}

const DefaultRegisterState: RegisterState = {
    requesting: false,
    registered: false,
    errors: {}
}

interface RegisterRequestAction {
    type: 'RegisterRequestAction';
}

interface RegisterErrorAction {
    type: 'RegisterErrorAction';
}

interface RegisterSuccessAction {
    type: 'RegisterSuccessAction';
    payload: RegisterViewModel;
}

// TODO import Success and Invalid actions from server and handle them
type KnownAction = RegisterRequestAction | RegisterErrorAction | RegisterSuccessAction | LoginSuccessAction;

export const actionCreators = {

    register: (registerModel: RegisterViewModel): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: REGISTER_REQUEST });
        let xsrf = getState().session.xsrfToken;
        let response = <Response>await fetch('/account/register', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': xsrf
            },
            body: JSON.stringify(registerModel)
        });

        if (response.ok) {
            dispatch({ type: REGISTER_SUCCESS, payload: registerModel });
            dispatch({ type: LOGIN_SUCCESS });
            browserHistory.push('/');
        } else {
            dispatch({ type: REGISTER_ERROR });
        }

        console.log('register result', response);
    }
};


export const reducer: Reducer<RegisterState> = (state: RegisterState, action: KnownAction) => {
    switch (action.type) {
        case REGISTER_REQUEST:
            return { requesting: true, registered: false, errors: {} };
        case REGISTER_ERROR:
            return { requesting: false, registered: false, errors: {} };
        case REGISTER_SUCCESS:
            return { requesting: false, registered: false, errors: {} };
        case LOGIN_SUCCESS:
            return state;
        default:
            const exhaustiveCheck: never = action;
    }

    return state || DefaultRegisterState;
};
