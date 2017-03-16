import { Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';
import Cookies from 'js-cookie';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

export const INIT_SESSION = 'InitConfigAction'

export interface SettingsState {
    id: string;
    xsrfToken: string;
}

interface InitConfigAction {
    type: 'InitConfigAction'
    payload: SettingsState
}
//interface ConfigAction2 {
//    type: 'INIT_CONFIG2'
//    payload: SettingsState
//}

type KnownAction = InitConfigAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {

    initialize: (settings?: SettingsState): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        // var saved = Cookies.getJSON('settings');
        var xsrfToken = document.getElementById('xsrf-token').dataset['xsrfToken'];
        var id = document.getElementById('session').dataset['id'];
        dispatch({ type: INIT_SESSION, payload: settings || { xsrfToken: xsrfToken, id: id } });
        // Cookies.set('settings', getState().settings, { expires: 365 });
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const DefaultSettings: SettingsState = { xsrfToken: undefined, id: undefined };

export const reducer: Reducer<SettingsState> = (state: SettingsState, action: KnownAction) => {
    switch (action.type) {
        case INIT_SESSION:
            return action.payload;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            // const exhaustiveCheck: never = action;
            break;
    }
    return state || DefaultSettings;
};
