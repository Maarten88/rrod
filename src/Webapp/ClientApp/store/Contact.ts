import { fetch } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import { ContactModel } from '../server/Contact'
import { push } from 'react-router-redux';
import { ApiModel } from '../server/ApiModel';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

//export interface ContactModel {
//    firstName?: string;
//    lastName?: string;
//    email?: string;
//    phone?: string;
//    message?: string;
//}

export interface ContactState {
    form: ContactModel;
    isSubmitting: boolean;
    submitted: boolean;
    result?: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface SubmitContactFormAction {
    type: 'SUBMIT_CONTACT_FORM'
    payload: ContactModel
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
        form: ContactModel,
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

    submitContactForm: (form: ContactModel) => (dispatch, getState) => {
        return (async () => {
            dispatch({ type: 'SUBMIT_CONTACT_FORM', payload: form });
            const xsrf = getState().xsrf.token;
            const formData = Object.entries(form).map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`).join('&');
            const response: Response = await fetch('/contact', {
                method: 'POST',
                credentials: 'include',
                redirect: 'error',
                headers: new Headers({
                    'X-XSRF-TOKEN': xsrf,
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
                }),
                body: formData
            });
            try {
                const data = await response.json() as ApiModel<ContactModel>;
                if (data.result.status === "OK") {
                    dispatch({ type: 'CONTACT_FORM_RECIEVED', payload: { form: data.value, result: data.result.message } });

                    setTimeout(() => {
                        dispatch(push('/'));
                        dispatch({ type: 'RESET_CONTACT_FORM' });
                    }, 2000);
                }
                else {
                    dispatch({ type: 'CONTACT_FORM_ERROR', payload: { form, errors: data.result.errors, result: data.result.message } });
                }
            } catch (error) {
                dispatch({ type: 'CONTACT_FORM_ERROR', payload: { form, result: response.statusText || error } });
            }

        })();
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: ContactState = { isSubmitting: false, submitted: false, form: { email: '' } };

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
