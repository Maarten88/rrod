import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface ContactForm {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    message?: string;
}

export interface ContactState {
    form: ContactForm;
    isSubmitting: boolean;
    submitted: boolean;
    result?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface SubmitContactFormAction {
    type: 'SUBMIT_CONTACT_FORM'
    payload: ContactForm
}

interface ContactFormRecievedAction {
    type: 'CONTACT_FORM_RECIEVED',
    payload: {
        result: string;
    }
}

interface ContactFormErrorAction {
    type: 'CONTACT_FORM_ERROR',
    payload: {
        form: ContactForm,
        result: string;
    }
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = SubmitContactFormAction | ContactFormRecievedAction | ContactFormErrorAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    submitContactForm: (form: ContactForm): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        dispatch({ type: 'SUBMIT_CONTACT_FORM', payload: form });
        let response = await fetch('/contact', {
            method: 'POST',
            body: JSON.stringify(form),
            headers: new Headers({
                'Content-Type': 'application/json'
            })
        });
        let data = await response.json();
        if (data.result.status === "OK")
            dispatch({ type: 'CONTACT_FORM_RECIEVED', payload: { result: data.message } });
        else
            dispatch({ type: 'CONTACT_FORM_ERROR', payload: { form: form, result: data.message } });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ContactState = { isSubmitting: false, submitted: false, form: {} };

export const reducer: Reducer<ContactState> = (state: ContactState, action: KnownAction) => {
    switch (action.type) {
        case 'SUBMIT_CONTACT_FORM':
            return {
                form: action.payload,
                isSubmitting: true,
                submitted: false
            };
        case 'CONTACT_FORM_RECIEVED':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                form: { firstName: '', lastName: '', email: '', phone: '', message: '' },
                isSubmitting: false,
                submitted: true,
                result: action.payload.result
            };
        case 'CONTACT_FORM_ERROR':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            return {
                form: action.payload.form,
                isSubmitting: false,
                submitted: true,
                result: action.payload.result
            };
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            // const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
