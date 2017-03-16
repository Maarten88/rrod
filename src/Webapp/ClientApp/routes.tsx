import * as React from 'react';
import { Router, Route, HistoryBase } from 'react-router';
import { Layout } from './components/Layout';
import Home from './components/Home';
import Contact from './components/Contact';
import FetchData from './components/FetchData';
import Login from './components/Login';
import Register from './components/Register';
import Counter from './components/Counter';
import User from './components/User';

export default <Route component={ Layout }>
    <Route path='/' components={{ body: Home }} />
    <Route path='/login' components={{ body: Login }} />
    <Route path='/register' components={{ body: Register }} />
    <Route path='/contact' components={{ body: Contact }} />
    <Route path='/counter' components={{ body: Counter }} />
    <Route path='/user' components={{ body: User }} />
    <Route path='/fetchdata' components={{ body: FetchData }}>
        <Route path='(:startDateIndex)' /> { /* Optional route segment that does not affect NavMenu highlighting */ }
    </Route>
</Route>;

// Enable Hot Module Replacement (HMR)
if (module.hot) {
    module.hot.accept();
}
