import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { UserModel } from '../server/UserModel';
import { LOGIN_SUCCESS, LOGOUT_SUCCESS } from './Login';
import * as Server from '../server/User';

export const GETUSER_REQUEST = 'GetUserRequestAction';
export const GETUSER_RECEIVED = 'GetUserReceivedAction';

const DefaultUserModel: UserModel = {
    isAuthenticated: false,
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    userId: undefined
};

export interface GetUserRequestAction {
    type: 'GetUserRequestAction';
}

export interface GetUserReceivedAction {
    type: 'GetUserReceivedAction';
    payload: UserModel;
}

export { UserModel };


// TODO import Success and Invalid actions from server and handle them
type KnownAction = GetUserRequestAction | GetUserReceivedAction;

export const actionCreators = {

    getUser: () => async (dispatch, getState) => {
        let fetchTask = fetch('/account/getuser', {
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then(response => response.json() as Promise<UserModel>)
            .then(userModel => {
                dispatch({ type: GETUSER_RECEIVED, payload: userModel });
                if (userModel.isAuthenticated) {
                    dispatch({ type: LOGIN_SUCCESS });
                } else {
                    dispatch({ type: LOGOUT_SUCCESS });
                }
            });

        addTask(fetchTask);
        dispatch({ type: GETUSER_REQUEST });
    }
};


export const reducer: Reducer<UserModel> = (state: UserModel, action: KnownAction) => {
    switch (action.type) {
        case GETUSER_REQUEST:
            return state;
        case GETUSER_RECEIVED:
            return action.payload;
        default:
            const exhaustiveCheck: never = action;
    }

    return state || DefaultUserModel;
};
