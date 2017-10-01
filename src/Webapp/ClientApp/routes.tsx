import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Counter from './components/Counter';
import User from './components/User';

export const routes = <Layout>
    <Route exact path='/' component={ Home } />
    <Route path='/contact' component={ Contact } />
    <Route path='/counter' component={ Counter } />
    <Route path='/register' component={ Register } />
    <Route path='/login' component={ Login } />
    <Route path='/logout' component={ Logout } />
    <Route path='/user' component={ User } />
</Layout>;
