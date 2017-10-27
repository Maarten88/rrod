import * as React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom'
import Layout from './components/Layout';
import Home from './components/Home';
import Contact from './components/Contact';
import Login from './components/Login';
import Logout from './components/Logout';
import Register from './components/Register';
import Counter from './components/Counter';
import User from './components/User';
import * as TransitionGroup from "react-transition-group/TransitionGroup";
import * as CSSTransition from "react-transition-group/CSSTransition";

export const routes = <Layout>
    <Route 
        render={({ location }) => { 
            const currentKey = location.pathname.split('/')[1] || '/';
            const timeout = { enter: 300, exit: 200 };
            return (
				<TransitionGroup component="div">
                    <CSSTransition key={currentKey} timeout={timeout} classNames="fade" appear>
                        <section className="animated-page-wrapper">
                            <Switch location={location}>
                                <Route exact path='/' render={() => <Home/> } />
                                <Route path='/contact' render={() => <Contact/> } />
                                <Route path='/counter' component={ Counter } />
                                <Route path='/register' component={ Register } />
                                <Route path='/login' component={ Login } />
                                <Route path='/logout' component={ Logout } />
                                <Route path='/user' component={ User } />
                            </Switch>
                        </section>
                    </CSSTransition>
                </TransitionGroup>);
            }
        }
    />
</Layout>;
