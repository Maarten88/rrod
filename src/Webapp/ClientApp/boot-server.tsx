import { INIT_SESSION } from './store/Session';
import { SET_XSRF_TOKEN } from './store/Xsrf';
import { LOGIN_SUCCESS } from './store/Login';
import * as React from 'react';
import { Provider } from 'react-redux';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { replace } from 'react-router-redux';
import { createMemoryHistory } from 'history';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { routes } from './routes';
import configureStore from './configureStore';
import ConnectionContainer from './containers/ConnectionContainer';
import { HeadCollector, HeadTag } from './lib/react-head';

// Warning: this result cannot be cached - content contains sessionId and XSRF tokens
// so the result can work basically even with javascript disabled.
export default createServerRenderer(params => {
    return new Promise<RenderResult>((resolve, reject) => {

        // console.log(`Node server: url = ${params.url}, origin=${params.origin}, baseUrl=${params.baseUrl}`);
        const store = configureStore(createMemoryHistory());

        // Prepare Redux store with in-memory history, and dispatch a navigation event
        // corresponding to the incoming URL
        // const basename = params.baseUrl.substring(0, params.baseUrl.length - 1); // Remove trailing slash
        // const urlAfterBasename = params.url.substring(basename.length);
        // store.dispatch(replace(urlAfterBasename));
        store.dispatch(replace(params.location));

        store.dispatch({ type: INIT_SESSION, payload: params.data.sessionId });
        store.dispatch({ type: SET_XSRF_TOKEN, payload: params.data.xsrfToken });

        if (params.data.isAuthenticated) {
            store.dispatch({ type: LOGIN_SUCCESS });
        }
        // Prepare an instance of the application and perform an inital render that will
        // cause any async tasks (e.g., data access) to begin
        const routerContext: any = {};
        const App = ({ headTags }: { headTags: React.ReactElement<any>[] }) => (
            <HeadCollector headTags={headTags}>
                <Provider store={store}>
                    <ConnectionContainer>
                        <StaticRouter context={routerContext} location={params.location.path} children={routes} />
                    </ConnectionContainer>
                </Provider>
            </HeadCollector>
        );

        // both headTags and the renderResult are discarded - it is just to kick off the promises and fetch required state
        renderToString(<App headTags={[]} />);

        // If there's a redirection, just send this information back to the host application
        if (routerContext.url) {
            resolve({
                redirectUrl: routerContext.url,
                statusCode: routerContext.status
            });
            return;
        }
        const InlineScript = ({ script }) => <script dangerouslySetInnerHTML={{ __html: script }} />

        const Aux = (props) => {
            return props.children;
        };

        const Html = ({ headTags, appString, state }) => (
            <html lang="en">
                <head>
                    <meta charSet="utf-8" />
                    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <link rel="stylesheet" href="/dist/main-client.css" />
                    <script src="https://cdn.polyfill.io/v2/polyfill.js?features=default,Array.prototype.includes,Symbol,Promise,WeakMap,Object.setPrototypeOf,Object.getPrototypeOf,Object.entries"></script>
                    <base href="/" />
                    {/* <InlineScript script="delete window.Symbol;" /> */}
                    {headTags}
                </head>
                <body>
                    <div id="react-app" dangerouslySetInnerHTML={{__html: appString}} />
                    <InlineScript script={"window.initialReduxState = " + JSON.stringify(state)} />
                    <script src="/dist/vendor.js"></script>
                    <script src="/dist/main-client.js"></script>
                </body>
            </html>
            );

        // Once any async tasks are done, we can perform the final render
        // We also send the redux store state, so the client can continue execution where the server left off
        params.domainTasks.then(() => {

            if (!routerContext.url) { // && (!routerContext.status || (routerContext.status >= 200 && routerContext.status < 300)))

                // Now that we have the state we can collect the head tags
                let headTags: React.ReactElement<any>[] = [];
                const appString = renderToString(<App headTags={headTags} />); 

                resolve({
                    html: renderToStaticMarkup(<Html headTags={headTags} appString={appString} state={store.getState()} />),
                    statusCode: routerContext.status
                });
            } else {
                resolve({
                    redirectUrl: routerContext.url,
                    statusCode: routerContext.status
                });
            }
        }, reject); // Also propagate any errors back into the host application
    });
});