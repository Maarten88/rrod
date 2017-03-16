import 'babel-polyfill';
import './css/site.scss';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import routes from './routes';
import configureStore from './configureStore';
import { ApplicationState }  from './store';
// import { actionCreators as sessionActionCreators } from './store/Session';
import { actionCreators as webSocketActionCreators } from './store/WebsocketConnection';

// Get the application-wide store instance, prepopulating with state from the server where available.
const initialState = (window as any).initialReduxState as ApplicationState;
const store = configureStore(initialState);
const history = syncHistoryWithStore(browserHistory, store);

// This code starts up the React app when it runs in a browser. It sets up the routing configuration
// and injects the app into a DOM element.
const container = document.getElementById('react-app')

ReactDOM.render(
    <Provider store={store}>
        <Router history={ history } children={ routes } />
    </Provider>
    , container);

setTimeout(async () => {
    await store.dispatch(webSocketActionCreators.startListener()); 
});

