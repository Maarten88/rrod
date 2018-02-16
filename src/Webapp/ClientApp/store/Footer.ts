import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { ApiModel } from '../server/ApiModel';
import { SubscribeModel } from '../server/Subscribe'
import { push, RouterAction } from 'react-router-redux';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface FooterState {
    email: string;
    isSubmitting: boolean;
    submitted: boolean;
    message?: string;
    error?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface SubmitEmailAction {
    type: 'SUBMIT_EMAIL';
    payload: {
        email: string;
    }
}

interface ResetEmailAction {
    type: 'RESET_EMAIL'
}

interface EmailSubmittedAction {
    type: 'EMAIL_SUBMITTED',
    payload: {
        message: string;
    }
}

interface EmailErrorAction {
    type: 'EMAIL_ERROR',
    payload: {
        error: string;
    }
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SubmitEmailAction | EmailSubmittedAction | ResetEmailAction | EmailErrorAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    submitEmail: (form: SubscribeModel) => (dispatch, getState) => {
        return (async () => {
            dispatch({ type: 'SUBMIT_EMAIL', payload: { email: form.email } });
            const formData = Object.entries(form).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            const xsrf = getState().xsrf.token;
            let response: Response = await fetch('/subscribe', {
                method: 'POST',
                credentials: 'include',
                redirect: 'error',
                headers: new Headers({
                    'X-XSRF-TOKEN': xsrf,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                }),
                body: formData
            });
            if (response.ok) {
                try {
                    let data: ApiModel<SubscribeModel> = await response.json();
                    if (data.result.status === "OK") {
                        dispatch({ type: 'EMAIL_SUBMITTED', payload: { message: data.result.message } });

                        setTimeout(() => {
                            dispatch(push('/'));
                            dispatch({ type: 'RESET_EMAIL' });
                        }, 2000);
                    }
                    else {
                        dispatch({ type: 'EMAIL_ERROR', payload: { error: data.result.message } });
                    }
                } catch (error) {
                    dispatch({ type: 'EMAIL_ERROR', payload: { error } });
                }
            } else {
                dispatch({ type: 'EMAIL_ERROR', payload: { error: response.statusText } });
            }
        })();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: FooterState = { email: '', isSubmitting: false, submitted: false };

export const reducer: Reducer<FooterState> = (state: FooterState, action: KnownAction) => {
    switch (action.type) {

        case 'SUBMIT_EMAIL':
            return {
                email: action.payload.email,
                isSubmitting: true,
                submitted: false
            };

        case 'EMAIL_SUBMITTED':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                email: '',
                isSubmitting: false,
                submitted: true,
                message: action.payload.message,
            };

        case 'RESET_EMAIL':
            return unloadedState;

        case 'EMAIL_ERROR':
            return {
                email: state.email,
                isSubmitting: false,
                submitted: false,
                error: action.payload.error
            };

        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
