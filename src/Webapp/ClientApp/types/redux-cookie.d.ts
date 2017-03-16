import { Middleware } from 'redux';

declare module 'redux-cookie' {
    export const createCookieMiddleware: (cookies: any, prefix?: string) => any
}
