import * as Counter from './Counter';
import * as Footer from './Footer';
import * as Contact from './Contact';
import * as Session from './Session';
import * as Connection from './SignalRConnection';
import * as Login from './Login';
import * as User from './User';
import * as Register from './Register';
import * as Xsrf from './Xsrf';
import { RouterState } from 'react-router-redux';
import { ReducersMapObject } from 'redux';

// The top-level state object
export interface ApplicationState {
    session: Session.SessionState,
    xsrf: Xsrf.XsrfState,
    connection: Connection.ConnectionState,
    user: User.UserModel,
    login: Login.LoginState,
    register: Register.RegisterState,
    counter: Counter.CounterState,
    footer: Footer.FooterState,
    contact: Contact.ContactState,
    router: RouterState
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers: ReducersMapObject<ApplicationState> = {
    session: Session.reducer,
    connection: Connection.reducer,
    xsrf: Xsrf.reducer,
    user: User.reducer,
    login: Login.reducer,
    register: Register.reducer,
    counter: Counter.reducer,
    footer: Footer.reducer,
    contact: Contact.reducer,
    router: undefined // RouterReducer is added in createStore
};


// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
