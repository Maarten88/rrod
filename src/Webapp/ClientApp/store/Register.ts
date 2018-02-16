import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { push } from 'react-router-redux';
import { AppThunkAction } from './';
import { RegisterModel } from '../server/RegisterModel'
import { ApiModel } from '../server/ApiModel'
import { ApiResult } from '../server/ApiResult'
import * as Cookies from 'js-cookie';
import { actionCreators as XsrfActionCreators } from './Xsrf';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface RegisterState {
    form: RegisterModel;
    isSubmitting: boolean;
    result: ApiResult;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface ResetRegistrationFormAction {
    type: 'RESET_REGISTRATION'
}


interface SubmitRegistrationFormAction {
    type: 'SUBMIT_REGISTRATION'
    payload: RegisterModel
}

interface RegistrationSuccessAction {
    type: 'REGISTRATION_SUCCESS',
    payload: {
        result: ApiResult;
    }
}

interface RegistrationFailedAction {
    type: 'REGISTRATION_FAILED',
    payload: {
        result: ApiResult;
    }
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = ResetRegistrationFormAction | SubmitRegistrationFormAction | RegistrationSuccessAction | RegistrationFailedAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    submitRegistrationForm: (form: RegisterModel) => (dispatch, getState) => {

        return (async () => {
            dispatch({ type: 'SUBMIT_REGISTRATION', payload: form });
            let response = await fetch('/account/register', {
                method: 'POST',
                credentials: 'include',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'X-XSRF-TOKEN': getState().xsrf.token
                }),
                body: JSON.stringify(form)
            }) as Response;

            if (response.ok) {
                let data = await response.json() as ApiModel<RegisterModel>;
                if (data.result.status === "OK") {
                    dispatch({ type: 'REGISTRATION_SUCCESS', payload: { result: data.result } });

                    // our xsrf token will now be invalid, update it to the new one
                    await dispatch(XsrfActionCreators.refresh());

                    // redirect to home after 2 secs
                    setTimeout(() => {
                        dispatch(push('/'));
                        dispatch({ type: 'RESET_REGISTRATION' });
                    }, 2000);
                }
                else {
                    dispatch({ type: 'REGISTRATION_FAILED', payload: { result: data.result } });
                }
            }
            else {
                dispatch({ type: 'REGISTRATION_FAILED', payload: { result: { status: "Error", success: false, message: "Kan registratie niet verzenden" } } });
            }
        })();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: RegisterState = { isSubmitting: false, form: { email: '', password: '', confirmPassword: '' }, result: undefined };

export const reducer: Reducer<RegisterState> = (state: RegisterState, action: KnownAction) => {
    switch (action.type) {

        case 'RESET_REGISTRATION':
            return unloadedState;
        case 'SUBMIT_REGISTRATION':
            return {
                form: action.payload,
                isSubmitting: true,
                result: undefined
            };
        case 'REGISTRATION_SUCCESS':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                form: unloadedState.form,
                isSubmitting: false,
                result: action.payload.result
            };
        case 'REGISTRATION_FAILED':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                form: state.form,
                isSubmitting: false,
                result: action.payload.result
            };

        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
