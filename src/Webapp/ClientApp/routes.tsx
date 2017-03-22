import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Counter from './components/Counter';
import User from './components/User';

export default <Route component={ Layout }>
    <Route path='/' components={{ body: Home }} />
    <Route path='/contact' components={{ body: Contact }} />
    <Route path='/counter' components={{ body: Counter }} />
    <Route path='/register' components={{ body: Register }} />
    <Route path='/login' components={{ body: Login }} />
    <Route path='/logout' components={{ body: Logout }} />
    <Route path='/user' components={{ body: User }} />
</Route>;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
