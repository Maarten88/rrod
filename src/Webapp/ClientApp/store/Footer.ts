import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface FooterState {
    isSubmitting: boolean;
    submitted: boolean;
    message?: string;
}

export interface EmailForm {
    email: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface SubmitEmailAction {
    type: 'SUBMIT_EMAIL'
}

interface EmailSubmittedAction {
    type: 'EMAIL_SUBMITTED',
    message: string;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SubmitEmailAction | EmailSubmittedAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    submitEmail: (form: EmailForm): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'SUBMIT_EMAIL' });
        let response = await fetch('/subscribe', {
            method: 'POST',
            body: 'email=' + form.email,
            headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded'
            })
        });
        let data = await response.json();
        dispatch({ type: 'EMAIL_SUBMITTED', message: data.message });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: FooterState = { isSubmitting: false, submitted: false };

export const reducer: Reducer<FooterState> = (state: FooterState, action: KnownAction) => {
    switch (action.type) {
        case 'SUBMIT_EMAIL':
            return {
                isSubmitting: true,
                submitted: false
            };
        case 'EMAIL_SUBMITTED':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                isSubmitting: false,
                submitted: true,
                message: action.message
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
