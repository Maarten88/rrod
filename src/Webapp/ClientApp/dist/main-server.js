(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 47);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("tslib");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("react-redux");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("domain-task");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("react-bootstrap");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("react-router");

/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__User__ = __webpack_require__(8);
/* unused harmony export LOGIN_REQUEST */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LOGIN_SUCCESS; });
/* unused harmony export LOGIN_INVALID */
/* unused harmony export LOGIN_ERROR */
/* unused harmony export LOGOUT_REQUEST */
/* unused harmony export LOGOUT_SUCCESS */
/* unused harmony export LOGOUT_ERROR */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return actionCreators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return reducer; });
var _this = this;





var LOGIN_REQUEST = 'LoginRequestAction';
var LOGIN_SUCCESS = 'LoginSuccessAction';
var LOGIN_INVALID = 'LoginInvalidAction';
var LOGIN_ERROR = 'LoginErrorAction';
var LOGOUT_REQUEST = 'LogoutRequestAction';
var LOGOUT_SUCCESS = 'LogoutSuccessAction';
var LOGOUT_ERROR = 'LogoutErrorAction';
var DefaultLoginState = {
    authenticating: false,
    authenticated: false
};
var actionCreators = {
    login: function login(loginInput) {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var xsrf, response;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dispatch({ type: LOGIN_REQUEST });
                                xsrf = getState().session.xsrfToken;
                                _context.next = 4;
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/account/login', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-XSRF-TOKEN': xsrf
                                    },
                                    body: JSON.stringify(loginInput)
                                });

                            case 4:
                                response = _context.sent;

                                if (response.ok) {
                                    dispatch({ type: LOGIN_SUCCESS });
                                    dispatch(__WEBPACK_IMPORTED_MODULE_3__User__["b" /* actionCreators */].getUser());
                                    __WEBPACK_IMPORTED_MODULE_2_react_router__["browserHistory"].push('/');
                                } else {
                                    dispatch({ type: LOGIN_ERROR });
                                }

                            case 6:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    },
    logout: function logout() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                var xsrf, response;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                dispatch({ type: LOGIN_REQUEST });
                                xsrf = getState().session.xsrfToken;
                                _context2.next = 4;
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/account/logout', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'X-XSRF-TOKEN': xsrf
                                    }
                                });

                            case 4:
                                response = _context2.sent;

                                if (response.ok) {
                                    dispatch({ type: LOGOUT_SUCCESS });
                                    __WEBPACK_IMPORTED_MODULE_2_react_router__["browserHistory"].push('/');
                                } else {
                                    dispatch({ type: LOGOUT_ERROR });
                                }

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        };
    }
};
var reducer = function reducer(state, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return { authenticating: true, authenticated: false };
        case LOGIN_ERROR:
            return { authenticating: false, authenticated: false };
        case LOGIN_SUCCESS:
            return { authenticating: false, authenticated: true };
        case LOGIN_INVALID:
            return { authenticating: false, authenticated: false };
        case LOGOUT_REQUEST:
            return { authenticating: true, authenticated: true };
        case LOGOUT_ERROR:
            return { authenticating: false, authenticated: true };
        case LOGOUT_SUCCESS:
            return { authenticating: false, authenticated: false };
        default:
            var exhaustiveCheck = action;
    }
    return state || DefaultLoginState;
};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("core-decorators");

/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* unused harmony export GETUSER_REQUEST */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GETUSER_RECEIVED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return actionCreators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return reducer; });
var _this = this;



var GETUSER_REQUEST = 'GetUserRequestAction';
var GETUSER_RECEIVED = 'GetUserReceivedAction';
var DefaultUserModel = {
    isAuthenticated: false,
    email: undefined,
    firstName: undefined,
    lastName: undefined,
    phoneNumber: undefined,
    userId: undefined
};
var actionCreators = {
    getUser: function getUser() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var fetchTask;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                fetchTask = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/account/getuser', {
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    }
                                }).then(function (response) {
                                    return response.json();
                                }).then(function (userModel) {
                                    dispatch({ type: GETUSER_RECEIVED, payload: userModel });
                                });

                                __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["addTask"])(fetchTask);
                                dispatch({ type: GETUSER_REQUEST });

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};
var reducer = function reducer(state, action) {
    switch (action.type) {
        case GETUSER_REQUEST:
            return state;
        case GETUSER_RECEIVED:
            return action.payload;
        default:
            var exhaustiveCheck = action;
    }
    return state || DefaultUserModel;
};

/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* unused harmony export TOKEN_REQUEST */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TOKEN_RECEIVED; });
/* unused harmony export TOKEN_ERROR */
/* unused harmony export actionCreators */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return reducer; });
var _this = this;



var TOKEN_REQUEST = 'TokenRequestAction';
var TOKEN_RECEIVED = 'TokenReceivedAction';
var TOKEN_ERROR = 'TokenErrorAction';
var DefaultAuthState = {
    requesting: false
};
var actionCreators = {
    getToken: function getToken() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var xsrf, response, result;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dispatch({ type: TOKEN_REQUEST });
                                xsrf = getState().session.xsrfToken;
                                _context.next = 4;
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/connect/token', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-XSRF-TOKEN': xsrf
                                    },
                                    body: ""
                                });

                            case 4:
                                response = _context.sent;

                                if (!response.ok) {
                                    _context.next = 12;
                                    break;
                                }

                                _context.next = 8;
                                return response.json();

                            case 8:
                                result = _context.sent;

                                dispatch({ type: TOKEN_RECEIVED, payload: result });
                                _context.next = 13;
                                break;

                            case 12:
                                dispatch({ type: TOKEN_ERROR });

                            case 13:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};
var reducer = function reducer(state, action) {
    switch (action.type) {
        case TOKEN_REQUEST:
            return Object.assign({}, state, { requesting: true });
        case TOKEN_RECEIVED:
            return { requesting: false, accessToken: action.payload.accessToken };
        case TOKEN_ERROR:
            return Object.assign({}, state, { requesting: false });
        default:
            var exhaustiveCheck = action;
    }
    return state || DefaultAuthState;
};

/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return actionCreators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return reducer; });
var _this = this;




var actionCreators = {
    submitContactForm: function submitContactForm(form) {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var response, data;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dispatch({ type: 'SUBMIT_CONTACT_FORM', payload: form });
                                _context.next = 3;
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/contact', {
                                    method: 'POST',
                                    body: JSON.stringify(form),
                                    headers: new Headers({
                                        'Content-Type': 'application/json'
                                    })
                                });

                            case 3:
                                response = _context.sent;
                                _context.next = 6;
                                return response.json();

                            case 6:
                                data = _context.sent;

                                if (data.result.status === "OK") dispatch({ type: 'CONTACT_FORM_RECIEVED', payload: { result: data.message } });else dispatch({ type: 'CONTACT_FORM_ERROR', payload: { form: form, result: data.message } });

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};

var unloadedState = { isSubmitting: false, submitted: false, form: {} };
var reducer = function reducer(state, action) {
    switch (action.type) {
        case 'SUBMIT_CONTACT_FORM':
            return {
                form: action.payload,
                isSubmitting: true,
                submitted: false
            };
        case 'CONTACT_FORM_RECIEVED':
            return {
                form: { firstName: '', lastName: '', email: '', phone: '', message: '' },
                isSubmitting: false,
                submitted: true,
                result: action.payload.result
            };
        case 'CONTACT_FORM_ERROR':
            return {
                form: action.payload.form,
                isSubmitting: false,
                submitted: true,
                result: action.payload.result
            };
        default:
            var exhaustiveCheck = action;
    }
    return state || unloadedState;
};

/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__server_Counter__ = __webpack_require__(32);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return actionCreators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return reducer; });
var _this = this;




var DefaultCounterState = {
    count: 0,
    started: false,
    transitioning: false
};

var REQUEST_COUNTER = 'RequestCounterAction';
var RECEIVE_COUNTER = 'ReceiveCounterAction';

function postActionToServer(action, xsrfToken) {
    return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var response;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/action', {
                            method: 'POST',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                                'X-XSRF-TOKEN': xsrfToken
                            },
                            body: JSON.stringify(action)
                        });

                    case 2:
                        response = _context.sent;
                        return _context.abrupt('return', response);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
}
var actionCreators = {
    request: function request() {
        return function (dispatch, getState) {
            dispatch({ type: REQUEST_COUNTER });
            var state = getState();
            var fetchTask = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/counterstate?id=' + state.session.id, {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                dispatch({ type: RECEIVE_COUNTER, payload: data });
            }).catch(function (error) {
                console.log('server has no initial counter data');
            });
            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["addTask"])(fetchTask);
        };
    },
    increment: function increment() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee2() {
                var state, response;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                dispatch({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["a" /* INCREMENT_COUNTER */] });
                                state = getState();
                                _context2.next = 4;
                                return postActionToServer({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["a" /* INCREMENT_COUNTER */] }, state.session.xsrfToken);

                            case 4:
                                response = _context2.sent;

                                console.log(response);

                            case 6:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
        };
    },
    decrement: function decrement() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee3() {
                var state, response;
                return regeneratorRuntime.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                dispatch({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["b" /* DECREMENT_COUNTER */] });
                                state = getState();
                                _context3.next = 4;
                                return postActionToServer({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["b" /* DECREMENT_COUNTER */] }, state.session.xsrfToken);

                            case 4:
                                response = _context3.sent;

                                console.log(response);

                            case 6:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            }));
        };
    },
    start: function start() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee4() {
                var state, response;
                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                dispatch({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["c" /* START_COUNTER */] });
                                state = getState();
                                _context4.next = 4;
                                return postActionToServer({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["c" /* START_COUNTER */] }, state.session.xsrfToken);

                            case 4:
                                response = _context4.sent;

                                console.log(response);

                            case 6:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));
        };
    },
    stop: function stop() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee5() {
                var state, response;
                return regeneratorRuntime.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                dispatch({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["d" /* STOP_COUNTER */] });
                                state = getState();
                                _context5.next = 4;
                                return postActionToServer({ type: __WEBPACK_IMPORTED_MODULE_2__server_Counter__["d" /* STOP_COUNTER */] }, state.session.xsrfToken);

                            case 4:
                                response = _context5.sent;

                                console.log(response);

                            case 6:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            }));
        };
    }
};

var reducer = function reducer(state, action) {
    switch (action.type) {
        case REQUEST_COUNTER:
            return Object.assign({}, state, { transitioning: true });
        case RECEIVE_COUNTER:
            return Object.assign({}, DefaultCounterState, action.payload);
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["a" /* INCREMENT_COUNTER */]:
            return Object.assign({}, state, { count: state.count + 1 });
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["b" /* DECREMENT_COUNTER */]:
            return Object.assign({}, state, { count: state.count - 1 });
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["c" /* START_COUNTER */]:
            return Object.assign({}, state, { transitioning: true });
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["e" /* COUNTER_STARTED */]:
            return Object.assign({}, state, { transitioning: false, started: true });
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["d" /* STOP_COUNTER */]:
            return Object.assign({}, state, { transitioning: true });
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["f" /* COUNTER_STOPPED */]:
            return Object.assign({}, state, { transitioning: false, started: false });
        case __WEBPACK_IMPORTED_MODULE_2__server_Counter__["g" /* SYNC_COUNTER_STATE */]:
            return Object.assign({}, action.payload.counterState, { transitioning: false });
        default:
            var exhaustiveCheck = action;
    }

    return state || DefaultCounterState;
};

/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return actionCreators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return reducer; });
var _this = this;




var actionCreators = {
    submitEmail: function submitEmail(form) {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var response, data;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dispatch({ type: 'SUBMIT_EMAIL' });
                                _context.next = 3;
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/subscribe', {
                                    method: 'POST',
                                    body: 'email=' + form.email,
                                    headers: new Headers({
                                        'Content-Type': 'application/x-www-form-urlencoded'
                                    })
                                });

                            case 3:
                                response = _context.sent;
                                _context.next = 6;
                                return response.json();

                            case 6:
                                data = _context.sent;

                                dispatch({ type: 'EMAIL_SUBMITTED', message: data.message });

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};

var unloadedState = { isSubmitting: false, submitted: false };
var reducer = function reducer(state, action) {
    switch (action.type) {
        case 'SUBMIT_EMAIL':
            return {
                isSubmitting: true,
                submitted: false
            };
        case 'EMAIL_SUBMITTED':
            return {
                isSubmitting: false,
                submitted: true,
                message: action.message
            };
        default:
            var exhaustiveCheck = action;
    }
    return state || unloadedState;
};

/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_domain_task___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_domain_task__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Login__ = __webpack_require__(6);
/* unused harmony export REGISTER_REQUEST */
/* unused harmony export REGISTER_SUCCESS */
/* unused harmony export REGISTER_ERROR */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return actionCreators; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return reducer; });
var _this = this;





var REGISTER_REQUEST = 'RegisterRequestAction';
var REGISTER_SUCCESS = 'RegisterSuccessAction';
var REGISTER_ERROR = 'RegisterErrorAction';
var DefaultRegisterState = {
    requesting: false,
    registered: false,
    errors: {}
};
var actionCreators = {
    register: function register(registerModel) {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var xsrf, response;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                dispatch({ type: REGISTER_REQUEST });
                                xsrf = getState().session.xsrfToken;
                                _context.next = 4;
                                return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_domain_task__["fetch"])('/account/register', {
                                    method: 'POST',
                                    credentials: 'include',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'X-XSRF-TOKEN': xsrf
                                    },
                                    body: JSON.stringify(registerModel)
                                });

                            case 4:
                                response = _context.sent;

                                if (response.ok) {
                                    dispatch({ type: REGISTER_SUCCESS, payload: registerModel });
                                    dispatch({ type: __WEBPACK_IMPORTED_MODULE_3__Login__["a" /* LOGIN_SUCCESS */] });
                                    __WEBPACK_IMPORTED_MODULE_2_react_router__["browserHistory"].push('/');
                                } else {
                                    dispatch({ type: REGISTER_ERROR });
                                }
                                console.log('register result', response);

                            case 7:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};
var reducer = function reducer(state, action) {
    switch (action.type) {
        case REGISTER_REQUEST:
            return { requesting: true, registered: false, errors: {} };
        case REGISTER_ERROR:
            return { requesting: false, registered: false, errors: {} };
        case REGISTER_SUCCESS:
            return { requesting: false, registered: false, errors: {} };
        case __WEBPACK_IMPORTED_MODULE_3__Login__["a" /* LOGIN_SUCCESS */]:
            return state;
        default:
            var exhaustiveCheck = action;
    }
    return state || DefaultRegisterState;
};

/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return INIT_SESSION; });
/* unused harmony export actionCreators */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return reducer; });
var _this = this;



function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : r & 0x3 | 0x8;
        return v.toString(16);
    });
}
var INIT_SESSION = 'InitConfigAction';

var actionCreators = {
    initialize: function initialize(settings) {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var xsrfToken, id;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                xsrfToken = document.getElementById('xsrf-token').dataset['xsrfToken'];
                                id = document.getElementById('session').dataset['id'];

                                dispatch({ type: INIT_SESSION, payload: settings || { xsrfToken: xsrfToken, id: id } });

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};

var DefaultSettings = { xsrfToken: undefined, id: undefined };
var reducer = function reducer(state, action) {
    switch (action.type) {
        case INIT_SESSION:
            return action.payload;
        default:
            break;
    }
    return state || DefaultSettings;
};

/***/ }),
/* 15 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom_server__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_dom_server___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_dom_server__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aspnet_prerendering__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_aspnet_prerendering___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_aspnet_prerendering__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__routes__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__configureStore__ = __webpack_require__(27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__store_User__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__store_Login__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__store_Auth__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__store_Session__ = __webpack_require__(14);












/* harmony default export */ __webpack_exports__["default"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_aspnet_prerendering__["createServerRenderer"])(function (params) {
    return new Promise(function (resolve, reject) {
        __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_react_router__["match"])({ routes: __WEBPACK_IMPORTED_MODULE_5__routes__["a" /* default */], location: params.location }, function (error, redirectLocation, renderProps) {
            if (error) {
                throw error;
            }

            if (redirectLocation) {
                resolve({ redirectUrl: redirectLocation.pathname });
                return;
            }

            if (!renderProps) {
                throw new Error('The location \'' + params.url + '\' doesn\'t match any route configured in react-router.');
            }

            var store = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6__configureStore__["a" /* default */])();
            store.dispatch({ type: __WEBPACK_IMPORTED_MODULE_10__store_Session__["a" /* INIT_SESSION */], payload: { xsrfToken: params.data.xsrfToken, id: params.data.sessionId } });
            if (params.data.isAuthenticated) {
                store.dispatch({ type: __WEBPACK_IMPORTED_MODULE_8__store_Login__["a" /* LOGIN_SUCCESS */] });
                store.dispatch({ type: __WEBPACK_IMPORTED_MODULE_9__store_Auth__["a" /* TOKEN_RECEIVED */], payload: { accessToken: params.data.accessToken } });
                store.dispatch({ type: __WEBPACK_IMPORTED_MODULE_7__store_User__["a" /* GETUSER_RECEIVED */], payload: params.data.userModel });
            }
            var app = __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_1_react_redux__["Provider"],
                { store: store },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_router__["RouterContext"], renderProps)
            );

            __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_dom_server__["renderToString"])(app);

            params.domainTasks.then(function () {
                resolve({
                    html: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_dom_server__["renderToString"])(app),
                    globals: { initialReduxState: store.getState() }
                });
            }, reject);
        });
    });
});

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_decorators__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_decorators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_decorators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__store_Contact__ = __webpack_require__(10);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







var initialForm = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
};

var Contact = function (_React$Component) {
    _inherits(Contact, _React$Component);

    function Contact(props) {
        _classCallCheck(this, Contact);

        var _this = _possibleConstructorReturn(this, (Contact.__proto__ || Object.getPrototypeOf(Contact)).call(this, props));

        _this.state = Object.assign({}, initialForm, props.form);
        return _this;
    }

    _createClass(Contact, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.state !== nextProps.form) this.setState(nextProps.form);
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            this.setState(_defineProperty({}, e.target.name, e.target.value));
        }
    }, {
        key: 'submit',
        value: function submit(event) {
            this.props.submitContactForm(this.state);
            event.preventDefault();
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Grid"],
                null,
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'h1',
                    null,
                    'Contact us'
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Row"],
                    { className: 'row' },
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                        { md: 6 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Well"],
                            { bsSize: 'sm' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Form"],
                                { horizontal: true, onSubmit: this.submit },
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'fieldset',
                                    null,
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        'legend',
                                        { className: 'text-center header' },
                                        'Contact'
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 10, mdOffset: 1 },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { name: 'firstName', type: 'text', onChange: this.handleChange, value: this.state.firstName, placeholder: 'First name' })
                                        )
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 10, mdOffset: 1 },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { name: 'lastName', type: 'text', onChange: this.handleChange, value: this.state.lastName, placeholder: 'Last name' })
                                        )
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 10, mdOffset: 1 },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { name: 'email', type: 'text', onChange: this.handleChange, value: this.state.email, placeholder: 'Email' })
                                        )
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 10, mdOffset: 1 },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { name: 'phone', type: 'text', onChange: this.handleChange, value: this.state.phone, placeholder: 'Phone' })
                                        )
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 10, mdOffset: 1 },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { componentClass: 'textarea', name: 'message', rows: 7, onChange: this.handleChange, value: this.props.form.message, placeholder: 'Enter a message here. We\'ll get back to you within two business days' })
                                        )
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 11, className: 'text-center' },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Button"],
                                                { type: 'submit', bsSize: 'lg', bsStyle: 'primary', disabled: this.props.isSubmitting },
                                                this.props.isSubmitting ? "Spinner" : "Send"
                                            )
                                        )
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('hr', null),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                                            { md: 11, className: 'text-center' },
                                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"].Static,
                                                null,
                                                this.props.submitted ? this.props.result : ""
                                            )
                                        )
                                    )
                                )
                            )
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                        { md: 6 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Panel"],
                            { header: __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'h3',
                                    null,
                                    'Adres'
                                ) },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'div',
                                { className: 'text-center header' },
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'div',
                                    null,
                                    'Street address',
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('br', null),
                                    'City',
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('br', null),
                                    'Country',
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('br', null),
                                    'Email',
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('br', null)
                                ),
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('hr', null),
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'div',
                                    { id: 'map1', className: 'map' },
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        'a',
                                        { href: 'https://www.google.nl/maps/dir//Your%020Address' },
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('img', { className: 'img-responsive', src: '/images/Map.png' })
                                    )
                                )
                            )
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'h2',
                    null,
                    'This demo was built by'
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'h4',
                    null,
                    'Maarten Sikkema'
                )
            );
        }
    }]);

    return Contact;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Contact.prototype, "handleChange", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Contact.prototype, "submit", null);
/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(function (state) {
    return state.contact;
}, __WEBPACK_IMPORTED_MODULE_5__store_Contact__["b" /* actionCreators */])(Contact);

/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store_Counter__ = __webpack_require__(11);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Counter = function (_React$Component) {
    _inherits(Counter, _React$Component);

    function Counter() {
        _classCallCheck(this, Counter);

        return _possibleConstructorReturn(this, (Counter.__proto__ || Object.getPrototypeOf(Counter)).apply(this, arguments));
    }

    _createClass(Counter, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.request();
        }
    }, {
        key: 'render',
        value: function render() {
            var _this2 = this;

            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                'div',
                { className: 'container' },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'h1',
                    null,
                    'Counter'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'p',
                    null,
                    'This is an example of a React component. It is connected real-time to the server: start the timer to view server-initiated updates, use "increment" to change the value clientside. Refresh the page to see that the value is also rendered serverside.'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'p',
                    null,
                    'Current count: ',
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                        'strong',
                        null,
                        this.props.count
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'button',
                    { className: 'btn btn-default', onClick: function onClick() {
                            _this2.props.increment();
                        } },
                    'Increment'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'button',
                    { className: 'btn btn-default', onClick: function onClick() {
                            _this2.props.decrement();
                        } },
                    'Decrement'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'button',
                    { className: 'btn btn-default', disabled: this.props.started, onClick: function onClick() {
                            _this2.props.start();
                        } },
                    'Start'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'button',
                    { className: 'btn btn-default', disabled: !this.props.started, onClick: function onClick() {
                            _this2.props.stop();
                        } },
                    'Stop'
                )
            );
        }
    }]);

    return Counter;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(function (state) {
    return state.counter;
}, __WEBPACK_IMPORTED_MODULE_2__store_Counter__["b" /* actionCreators */])(Counter);

if (false) {
    module.hot.accept();
}

/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_decorators__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_decorators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_decorators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__store_Footer__ = __webpack_require__(12);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }








var Footer = function (_React$Component) {
    _inherits(Footer, _React$Component);

    function Footer() {
        _classCallCheck(this, Footer);

        var _this = _possibleConstructorReturn(this, (Footer.__proto__ || Object.getPrototypeOf(Footer)).call(this));

        _this.state = {
            email: ''
        };
        _this.handleChange = _this.handleChange.bind(_this);
        return _this;
    }

    _createClass(Footer, [{
        key: 'getValidationState',
        value: function getValidationState() {
            var emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            return emailRegex.test(this.state.email) ? "success" : null;
        }
    }, {
        key: 'handleChange',
        value: function handleChange(e) {
            this.setState({ email: e.target.value });
        }
    }, {
        key: 'submitEmail',
        value: function submitEmail(event) {
            this.props.submitEmail(this.state);
            event.preventDefault();
        }
    }, {
        key: 'submitDisabled',
        value: function submitDisabled() {
            return this.props.isSubmitting || this.getValidationState() !== "success";
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                'footer',
                null,
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'div',
                    { className: 'container' },
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        'div',
                        { className: 'row' },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'h1',
                            null,
                            'Share the vision!'
                        ),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('div', { className: 'header-deveider' }),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'p',
                            { className: 'wow fadeInUp' },
                            'Footer text here.'
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        'div',
                        { className: 'row' },
                        this.props.submitted ? __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'div',
                            { className: 'subscription-message' },
                            this.props.message
                        ) : __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Form"],
                            { inline: true, onSubmit: this.submitEmail },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                                { controlId: 'formBasicText', validationState: this.getValidationState() },
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { type: 'text', value: this.state.email, placeholder: 'Enter your email address', onChange: this.handleChange }),
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"].Feedback, null)
                            ),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Button"],
                                { type: 'submit', disabled: this.submitDisabled() },
                                'Keep me informed'
                            )
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        'div',
                        { className: 'row', id: 'share' },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'ul',
                            { className: 'socials-links' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'li',
                                null,
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'a',
                                    { href: 'https://www.facebook.com/YourFbPage' },
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-facebook-square' })
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'li',
                                null,
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'a',
                                    { href: 'https://twitter.com/YourTwitterHandle' },
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-twitter-square' })
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'li',
                                null,
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    'a',
                                    { href: 'https://nl.linkedin.com/in/YourLinkedInProfile' },
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-linkedin-square' })
                                )
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'p',
                            { className: 'copyright' },
                            '\xA9 2016 MIT Licenced'
                        )
                    )
                )
            );
        }
    }]);

    return Footer;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Footer.prototype, "getValidationState", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Footer.prototype, "handleChange", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Footer.prototype, "submitEmail", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Footer.prototype, "submitDisabled", null);
/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(function (state) {
    return state.footer;
}, __WEBPACK_IMPORTED_MODULE_5__store_Footer__["b" /* actionCreators */])(Footer);

/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_scroll__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_scroll___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_scroll__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_scroll_effect__ = __webpack_require__(30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__lib_fullscreen__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Footer__ = __webpack_require__(19);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







var Home = function (_React$Component) {
    _inherits(Home, _React$Component);

    function Home() {
        _classCallCheck(this, Home);

        return _possibleConstructorReturn(this, (Home.__proto__ || Object.getPrototypeOf(Home)).apply(this, arguments));
    }

    _createClass(Home, [{
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                'div',
                { className: 'container-fluid' },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_3__lib_fullscreen__["a" /* default */],
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                        'div',
                        { className: 'row', id: 'hero' },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                            'div',
                            { className: 'container' },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                'div',
                                { id: 'tagline' },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_2__lib_scroll_effect__["a" /* default */],
                                    { animate: 'bounceIn' },
                                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                        'h1',
                                        { className: 'home-intro-text' },
                                        'Demo!'
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                        'h1',
                                        { className: 'home-intro-text' },
                                        '...React, Redux, Orleans and Dotnet'
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                        'h3',
                                        { className: 'home-intro-text' },
                                        'Introducing the ',
                                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                            __WEBPACK_IMPORTED_MODULE_1_react_scroll__["Link"],
                                            { to: 'demo', href: '#', smooth: true, duration: 700, offset: -50 },
                                            'RROD'
                                        ),
                                        ' stack'
                                    )
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                'div',
                                { className: 'down-link' },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_1_react_scroll__["Link"],
                                    { to: 'demo', href: '#', className: 'icon-link', smooth: true, duration: 700, offset: -50 },
                                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]('i', { className: 'fa fa-arrow-circle-down custom' })
                                )
                            )
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_scroll__["Element"], { name: 'demo' }),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'div',
                    { className: 'row', id: 'footer' },
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4__Footer__["a" /* default */], null)
                )
            );
        }
    }]);

    return Home;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = Home;

/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__NavMenu__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__lib_route_transition__ = __webpack_require__(29);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Layout; });
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var Layout = function (_React$Component) {
    _inherits(Layout, _React$Component);

    function Layout() {
        _classCallCheck(this, Layout);

        return _possibleConstructorReturn(this, (Layout.__proto__ || Object.getPrototypeOf(Layout)).apply(this, arguments));
    }

    _createClass(Layout, [{
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                'div',
                null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1__NavMenu__["a" /* default */], null),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_2__lib_route_transition__["a" /* default */],
                    { pathname: typeof window !== 'undefined' ? window.location.pathname : '', children: this.props.body },
                    this.props.body
                )
            );
        }
    }]);

    return Layout;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_decorators__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_core_decorators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_core_decorators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_react_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__store_Login__ = __webpack_require__(6);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }









var Login = function (_React$Component) {
    _inherits(Login, _React$Component);

    function Login() {
        _classCallCheck(this, Login);

        var _this = _possibleConstructorReturn(this, (Login.__proto__ || Object.getPrototypeOf(Login)).call(this));

        _this.state = {
            userName: '',
            password: ''
        };
        return _this;
    }

    _createClass(Login, [{
        key: 'handleChange',
        value: function handleChange(e) {
            this.setState(Object.assign({}, this.state, _defineProperty({}, e.target.name, e.target.value)));
        }
    }, {
        key: 'login',
        value: function login(event) {
            this.props.login({ email: this.state.userName, password: this.state.password, rememberLogin: true, returnUrl: '/' });
            event.preventDefault();
        }
    }, {
        key: 'getValidationState',
        value: function getValidationState() {
            return null;
        }
    }, {
        key: 'renderLoggedIn',
        value: function renderLoggedIn() {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Grid"],
                null,
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'h1',
                    null,
                    'U bent ingelogd!'
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'form',
                    { action: '~/account', method: 'post' },
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        'button',
                        { className: 'btn btn-lg btn-warning', type: 'submit' },
                        'Query the resource controller'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'a',
                    { className: 'btn btn-lg btn-danger', href: '/signout' },
                    'Sign out'
                )
            );
        }
    }, {
        key: 'renderAnonymous',
        value: function renderAnonymous() {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Grid"],
                { className: 'omb_login' },
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'h3',
                    { className: 'omb_authTitle' },
                    'Login of ',
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_2_react_router__["Link"],
                        { to: '/Register' },
                        'Registreer'
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Row"],
                    { className: 'omb_socialButtons' },
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 4, sm: 2, smOffset: 3 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_2_react_router__["Link"],
                            { to: '#', className: 'btn btn-lg btn-block omb_btn-facebook' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-facebook visible-xs' }),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'span',
                                { className: 'hidden-xs' },
                                'Facebook'
                            )
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 4, sm: 2 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_2_react_router__["Link"],
                            { to: '#', className: 'btn btn-lg btn-block omb_btn-twitter' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-twitter visible-xs' }),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'span',
                                { className: 'hidden-xs' },
                                'Twitter'
                            )
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 4, sm: 2 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_2_react_router__["Link"],
                            { to: '#', className: 'btn btn-lg btn-block omb_btn-google' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-google-plus visible-xs' }),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                'span',
                                { className: 'hidden-xs' },
                                'Google+'
                            )
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Row"],
                    { className: 'omb_loginOr' },
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 12, sm: 6, smOffset: 3 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('hr', { className: 'omb_hrOr' }),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'span',
                            { className: 'omb_spanOr' },
                            'of'
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Row"],
                    null,
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 12, sm: 6, smOffset: 3 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Form"],
                            { className: 'omb_loginForm', onSubmit: this.login, autoComplete: 'off' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormGroup"],
                                { validationState: this.getValidationState() },
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["InputGroup"],
                                    null,
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["InputGroup"].Addon,
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-user' })
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormControl"], { name: 'userName', type: 'text', onChange: this.handleChange, placeholder: 'Login Naam' })
                                ),
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormControl"].Feedback, null)
                            ),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormGroup"],
                                null,
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["InputGroup"],
                                    null,
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["InputGroup"].Addon,
                                        null,
                                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('i', { className: 'fa fa-lock' })
                                    ),
                                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormControl"], { name: 'password', type: 'password', onChange: this.handleChange, placeholder: 'Password' })
                                ),
                                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormControl"].Feedback, null)
                            ),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Button"],
                                { className: 'btn btn-lg btn-primary btn-block', type: 'submit' },
                                'Inloggen'
                            )
                        )
                    )
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Row"],
                    null,
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 12, sm: 3, smOffset: 3 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["FormGroup"],
                            null,
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Checkbox"],
                                null,
                                'Onthou mij'
                            )
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_5_react_bootstrap__["Col"],
                        { xs: 12, sm: 3 },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            'p',
                            { className: 'omb_forgotPwd' },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_2_react_router__["Link"],
                                { to: '#' },
                                'Password vergeten?'
                            )
                        )
                    )
                )
            );
        }
    }, {
        key: 'render',
        value: function render() {
            if (this.props.authenticated) return this.renderLoggedIn();else return this.renderAnonymous();
        }
    }]);

    return Login;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_4_core_decorators__["autobind"]], Login.prototype, "handleChange", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_4_core_decorators__["autobind"]], Login.prototype, "login", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_4_core_decorators__["autobind"]], Login.prototype, "getValidationState", null);

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_react_redux__["connect"])(function (state) {
    return state.login;
}, __WEBPACK_IMPORTED_MODULE_6__store_Login__["c" /* actionCreators */])(Login);

/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store_Login__ = __webpack_require__(6);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }





var Logout = function (_React$Component) {
    _inherits(Logout, _React$Component);

    function Logout() {
        _classCallCheck(this, Logout);

        return _possibleConstructorReturn(this, (Logout.__proto__ || Object.getPrototypeOf(Logout)).apply(this, arguments));
    }

    _createClass(Logout, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            this.props.logout();
        }
    }, {
        key: 'render',
        value: function render() {
            return null;
        }
    }]);

    return Logout;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_redux__["connect"])(function (state) {
    return state.login;
}, __WEBPACK_IMPORTED_MODULE_2__store_Login__["c" /* actionCreators */])(Logout);

/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var logo = __webpack_require__(35);

var NavMenu = function (_React$Component) {
    _inherits(NavMenu, _React$Component);

    function NavMenu() {
        _classCallCheck(this, NavMenu);

        return _possibleConstructorReturn(this, (NavMenu.__proto__ || Object.getPrototypeOf(NavMenu)).apply(this, arguments));
    }

    _createClass(NavMenu, [{
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Navbar"],
                { fixedTop: true },
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Navbar"].Header,
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Navbar"].Brand,
                        null,
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_1_react_router__["Link"],
                            { className: 'navbar-brand', to: '/' },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"]('img', { src: logo, alt: 'RROD Logo' }),
                            'RROD'
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Navbar"].Toggle, null)
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Navbar"].Collapse,
                    null,
                    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["Nav"],
                        { pullRight: true },
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__["LinkContainer"],
                            { to: '/contact' },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["NavItem"],
                                { eventKey: 1 },
                                'Contact'
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__["LinkContainer"],
                            { to: '/counter' },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["NavItem"],
                                { eventKey: 3 },
                                'Counter'
                            )
                        ),
                        __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["NavDropdown"],
                            { eventKey: 2, title: 'Login', id: 'nav-dropdown' },
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__["LinkContainer"],
                                { to: '/login' },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["MenuItem"],
                                    { disabled: this.props.isAuthenticated, eventKey: 2.1 },
                                    'Login'
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__["LinkContainer"],
                                { to: '/register' },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["MenuItem"],
                                    { disabled: this.props.isAuthenticated, eventKey: 2.2 },
                                    'Register'
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__["LinkContainer"],
                                { to: '/user' },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["MenuItem"],
                                    { eventKey: 2.3 },
                                    'User Profile'
                                )
                            ),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["MenuItem"], { divider: true }),
                            __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_router_bootstrap__["LinkContainer"],
                                { to: '/logout' },
                                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                                    __WEBPACK_IMPORTED_MODULE_3_react_bootstrap__["MenuItem"],
                                    { disabled: !this.props.isAuthenticated, eventKey: 2.4 },
                                    'Logout'
                                )
                            )
                        )
                    )
                )
            );
        }
    }]);

    return NavMenu;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(function (state) {
    return { isAuthenticated: state.login.authenticated, roles: [] };
}, {})(NavMenu);

/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_decorators__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_core_decorators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_core_decorators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_react_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__store_Register__ = __webpack_require__(13);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }








var Register = function (_React$Component) {
    _inherits(Register, _React$Component);

    function Register() {
        _classCallCheck(this, Register);

        var _this = _possibleConstructorReturn(this, (Register.__proto__ || Object.getPrototypeOf(Register)).call(this));

        _this.state = {
            userName: '',
            password: ''
        };
        return _this;
    }

    _createClass(Register, [{
        key: 'handleChange',
        value: function handleChange(e) {
            this.setState(Object.assign({}, this.state, _defineProperty({}, e.target.name, e.target.value)));
        }
    }, {
        key: 'register',
        value: function register(event) {
            this.props.register({ email: this.state.userName, password: this.state.password, confirmPassword: this.state.password });
            event.preventDefault();
        }
    }, {
        key: 'getValidationState',
        value: function getValidationState() {
            return null;
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Grid"],
                null,
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    'h1',
                    null,
                    'Register new account'
                ),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"]('hr', null),
                __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                    __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Form"],
                    { horizontal: true, onSubmit: this.register, autoComplete: 'on' },
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                        { name: 'userName', validationState: this.getValidationState() },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                            { componentClass: __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["ControlLabel"], sm: 2 },
                            'Email'
                        ),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                            { sm: 10 },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { name: 'userName', type: 'text', onChange: this.handleChange, placeholder: 'Email' }),
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"].Feedback, null)
                        )
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                        { name: 'password' },
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                            { componentClass: __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["ControlLabel"], sm: 2 },
                            'Password'
                        ),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                            { sm: 10 },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"], { name: 'password', type: 'password', onChange: this.handleChange, placeholder: 'Password' })
                        ),
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](__WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormControl"].Feedback, null)
                    ),
                    __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                        __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["FormGroup"],
                        null,
                        __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                            __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Col"],
                            { smOffset: 2, sm: 10 },
                            __WEBPACK_IMPORTED_MODULE_1_react__["createElement"](
                                __WEBPACK_IMPORTED_MODULE_4_react_bootstrap__["Button"],
                                { className: 'btn btn-primary', type: 'submit' },
                                'Register'
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Register;
}(__WEBPACK_IMPORTED_MODULE_1_react__["Component"]);

__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Register.prototype, "handleChange", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Register.prototype, "register", null);
__WEBPACK_IMPORTED_MODULE_0_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_3_core_decorators__["autobind"]], Register.prototype, "getValidationState", null);

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(function (state) {
    return state.register;
}, __WEBPACK_IMPORTED_MODULE_5__store_Register__["b" /* actionCreators */])(Register);

/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_bootstrap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store_User__ = __webpack_require__(8);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var User = function (_React$Component) {
    _inherits(User, _React$Component);

    function User() {
        _classCallCheck(this, User);

        return _possibleConstructorReturn(this, (User.__proto__ || Object.getPrototypeOf(User)).apply(this, arguments));
    }

    _createClass(User, [{
        key: 'componentWillMount',
        value: function componentWillMount() {}
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.props.getUser();
        }
    }, {
        key: 'render',
        value: function render() {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                __WEBPACK_IMPORTED_MODULE_1_react_bootstrap__["Grid"],
                null,
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'h1',
                    null,
                    'User'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'p',
                    null,
                    'This component demonstrates fetching data from the server and working with URL parameters.'
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'p',
                    null,
                    'User is authenticated: ',
                    this.props.isAuthenticated ? 'Yes! :-)' : 'No :-('
                ),
                __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                    'p',
                    null,
                    'User email: ',
                    this.props.email
                )
            );
        }
    }]);

    return User;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_react_redux__["connect"])(function (state) {
    return state.user;
}, __WEBPACK_IMPORTED_MODULE_3__store_User__["b" /* actionCreators */])(User);

/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux__ = __webpack_require__(45);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_redux_thunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_redux_thunk__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_redux__ = __webpack_require__(43);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react_router_redux___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react_router_redux__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store__ = __webpack_require__(34);
/* harmony export (immutable) */ __webpack_exports__["a"] = configureStore;




function configureStore(initialState) {
    var windowIfDefined = typeof window === 'undefined' ? null : window;

    var devToolsExtension = windowIfDefined && windowIfDefined.devToolsExtension;
    var createStoreWithMiddleware = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["compose"])(__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["applyMiddleware"])(__WEBPACK_IMPORTED_MODULE_1_redux_thunk___default.a), devToolsExtension ? devToolsExtension() : function (f) {
        return f;
    })(__WEBPACK_IMPORTED_MODULE_0_redux__["createStore"]);

    var allReducers = buildRootReducer(__WEBPACK_IMPORTED_MODULE_3__store__["a" /* reducers */]);
    var store = createStoreWithMiddleware(allReducers, initialState);

    if (false) {
        module.hot.accept('./store', function () {
            var nextRootReducer = require('./store');
            store.replaceReducer(buildRootReducer(nextRootReducer.reducers));
        });
    }
    return store;
}
function buildRootReducer(allReducers) {
    return __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0_redux__["combineReducers"])(Object.assign({}, allReducers, { routing: __WEBPACK_IMPORTED_MODULE_2_react_router_redux__["routerReducer"] }));
}

/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }


var getDimensions = function getDimensions() {
    return { height: window.innerHeight - 50 + 'px' };
};

var FullScreen = function (_React$Component) {
    _inherits(FullScreen, _React$Component);

    function FullScreen(props) {
        _classCallCheck(this, FullScreen);

        var _this = _possibleConstructorReturn(this, (FullScreen.__proto__ || Object.getPrototypeOf(FullScreen)).call(this, props));

        _this.state = { height: '100vh' };
        _this.handleResize = _this.handleResize.bind(_this);
        return _this;
    }

    _createClass(FullScreen, [{
        key: 'handleResize',
        value: function handleResize() {
            this.setState(getDimensions());
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.handleResize();
            window.addEventListener('resize', this.handleResize);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            window.removeEventListener('resize', this.handleResize);
        }
    }, {
        key: 'render',
        value: function render() {
            var child = __WEBPACK_IMPORTED_MODULE_0_react__["cloneElement"](__WEBPACK_IMPORTED_MODULE_0_react__["Children"].only(this.props.children), { style: { height: this.state.height } });

            return child;
        }
    }]);

    return FullScreen;
}(__WEBPACK_IMPORTED_MODULE_0_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = FullScreen;

/***/ }),
/* 29 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_motion__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_motion___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_motion__);


var willEnter = function willEnter() {
    return {
        opacity: 0,
        scale: 0.97
    };
};
var willLeave = function willLeave() {
    return {
        opacity: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_motion__["spring"])(0),
        scale: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_motion__["spring"])(1.00)
    };
};
var getStyles = function getStyles() {
    return {
        opacity: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_motion__["spring"])(1),
        scale: __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_react_motion__["spring"])(1)
    };
};
var RouteTransition = function RouteTransition(_ref) {
    var child = _ref.children,
        pathname = _ref.pathname;
    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
        __WEBPACK_IMPORTED_MODULE_1_react_motion__["TransitionMotion"],
        { styles: [{
                key: pathname,
                style: getStyles(),
                data: { child: child }
            }], willEnter: willEnter, willLeave: willLeave },
        function (interpolated) {
            return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                'div',
                null,
                interpolated.map(function (_ref2) {
                    var key = _ref2.key,
                        style = _ref2.style,
                        data = _ref2.data;
                    return __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
                        'div',
                        { key: key + '-transition', style: Object.assign({}, styles.wrapper, { opacity: style.opacity, transform: 'scale(' + style.scale + ')' }) },
                        data.child
                    );
                })
            );
        }
    );
};
var styles = {
    wrapper: {
        position: 'absolute',
        width: '100%'
    }
};
/* harmony default export */ __webpack_exports__["a"] = RouteTransition;

/***/ }),
/* 30 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_debounce__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_debounce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_debounce__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_tslib__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom__ = __webpack_require__(39);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_react_dom___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_react_dom__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_classnames__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_classnames___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_classnames__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_decorators__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_core_decorators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_core_decorators__);


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }







;

var ScrollEffect = function (_React$Component) {
    _inherits(ScrollEffect, _React$Component);

    function ScrollEffect() {
        _classCallCheck(this, ScrollEffect);

        var _this = _possibleConstructorReturn(this, (ScrollEffect.__proto__ || Object.getPrototypeOf(ScrollEffect)).call(this));

        _this.state = {
            animated: false
        };
        return _this;
    }

    _createClass(ScrollEffect, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.handleScroll(undefined);
            this.scrollHandler = __WEBPACK_IMPORTED_MODULE_0_lodash_debounce___default()(this.handleScroll.bind(this), 200, { trailing: true });
            window.addEventListener('scroll', this.scrollHandler);
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            this.scrollHandler.cancel();
            window.removeEventListener('scroll', this.scrollHandler);
        }
    }, {
        key: 'singleAnimate',
        value: function singleAnimate() {
            var _this2 = this;

            setTimeout(function () {
                _this2.props.callback();
            }, (this.props.duration | 1) * 1000);
        }
    }, {
        key: 'queueAnimate',
        value: function queueAnimate() {
            var _this3 = this;

            var element = __WEBPACK_IMPORTED_MODULE_3_react_dom__["findDOMNode"](this);
            var checkClass = function checkClass(el) {
                return el.className === _this3.props.queueClass;
            };
            var number = 0;
            var setClass = function setClass(el) {
                el.style.visibility = "hidden";
                setTimeout(function () {
                    el.style.visibility = "visible";
                    el.className = el.className + ' animated ' + _this3.props.animate;
                }, number * (_this3.props.queueDuration * 1000));
                number++;
            };
            var findClass = function findClass(element) {
                Array.prototype.forEach.call(element.childNodes, function (child) {
                    findClass(child);
                    if (checkClass(child)) {
                        setClass(child);
                    }
                });
            };

            findClass(element);

            setTimeout(function () {
                _this3.props.callback();
            }, this.props.duration * 1000 * number);
        }
    }, {
        key: 'handleScroll',
        value: function handleScroll(e) {
            if (!this.state.animated) {
                var element = __WEBPACK_IMPORTED_MODULE_3_react_dom__["findDOMNode"](this);
                var elementPositionY = element.getBoundingClientRect().top + document.body.scrollTop,
                    scrollPositionY = window.scrollY,
                    windowHeight = window.innerHeight;
                if (scrollPositionY + windowHeight * .95 >= elementPositionY + this.props.offset * 1) {
                    this.setState({
                        animated: true
                    });
                    this.props.queueClass == "" && this.singleAnimate();
                    this.props.queueClass !== "" && this.queueAnimate();
                }
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var props = this.props,
                state = this.state;

            var classes = __WEBPACK_IMPORTED_MODULE_4_classnames___default()(_defineProperty({
                'animated': true
            }, props.animate, state.animated && props.queueClass === ""));
            classes += ' ' + props.className;
            var style = state.animated ? {} : {};
            if (props.duration !== undefined) {
                style.WebkitAnimationDuration = props.duration + 's';
                style.AnimationDuration = props.duration + 's';
            }
            return __WEBPACK_IMPORTED_MODULE_2_react__["createElement"](
                'div',
                { className: classes, style: style },
                props.children
            );
        }
    }]);

    return ScrollEffect;
}(__WEBPACK_IMPORTED_MODULE_2_react__["Component"]);

/* harmony default export */ __webpack_exports__["a"] = ScrollEffect;

ScrollEffect.defaultProps = {
    animate: "fadeInUp",
    offset: 0,
    className: "",
    duration: 1,
    queueDuration: 1,
    queueClass: "",
    callback: function callback() {}
};
__WEBPACK_IMPORTED_MODULE_1_tslib__["__decorate"]([__WEBPACK_IMPORTED_MODULE_5_core_decorators__["autobind"]], ScrollEffect.prototype, "handleScroll", null);

/***/ }),
/* 31 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_router___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_router__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__components_Layout__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__components_Home__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_Contact__ = __webpack_require__(17);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_Login__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_Logout__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_Register__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_Counter__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_User__ = __webpack_require__(26);










/* harmony default export */ __webpack_exports__["a"] = __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](
    __WEBPACK_IMPORTED_MODULE_1_react_router__["Route"],
    { component: __WEBPACK_IMPORTED_MODULE_2__components_Layout__["a" /* Layout */] },
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/', components: { body: __WEBPACK_IMPORTED_MODULE_3__components_Home__["a" /* default */] } }),
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/contact', components: { body: __WEBPACK_IMPORTED_MODULE_4__components_Contact__["a" /* default */] } }),
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/counter', components: { body: __WEBPACK_IMPORTED_MODULE_8__components_Counter__["a" /* default */] } }),
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/register', components: { body: __WEBPACK_IMPORTED_MODULE_7__components_Register__["a" /* default */] } }),
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/login', components: { body: __WEBPACK_IMPORTED_MODULE_5__components_Login__["a" /* default */] } }),
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/logout', components: { body: __WEBPACK_IMPORTED_MODULE_6__components_Logout__["a" /* default */] } }),
    __WEBPACK_IMPORTED_MODULE_0_react__["createElement"](__WEBPACK_IMPORTED_MODULE_1_react_router__["Route"], { path: '/user', components: { body: __WEBPACK_IMPORTED_MODULE_9__components_User__["a" /* default */] } })
);

if (false) {
    module.hot.accept();
}

/***/ }),
/* 32 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return INCREMENT_COUNTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return DECREMENT_COUNTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "c", function() { return START_COUNTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "e", function() { return COUNTER_STARTED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "d", function() { return STOP_COUNTER; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "f", function() { return COUNTER_STOPPED; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "g", function() { return SYNC_COUNTER_STATE; });

var INCREMENT_COUNTER = 'IncrementCounterAction';
var DECREMENT_COUNTER = 'DecrementCounterAction';
var START_COUNTER = 'StartCounterAction';
var COUNTER_STARTED = 'CounterStartedAction';
var STOP_COUNTER = 'StopCounterAction';
var COUNTER_STOPPED = 'CounterStoppedAction';
var SYNC_COUNTER_STATE = 'SyncCounterStateAction';

/***/ }),
/* 33 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_tslib___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_tslib__);
/* unused harmony export actionCreators */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return reducer; });
var _this = this;


var DefaultState = {
    connected: false
};
var actionCreators = {
    startListener: function startListener() {
        return function (dispatch, getState) {
            return __WEBPACK_IMPORTED_MODULE_0_tslib__["__awaiter"](_this, void 0, void 0, regeneratorRuntime.mark(function _callee() {
                var uri, socket;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                uri = (window.location.protocol === "http:" ? "ws://" : "wss://") + window.location.host + "/actions";
                                socket = new WebSocket(uri);

                                socket.onopen = function (e) {
                                    console.log("opened " + uri);
                                    dispatch({ type: 'CONNECTED' });
                                };
                                socket.onclose = function (e) {
                                    console.log("closed");
                                    dispatch({ type: 'DISCONNECTED' });
                                    socket = null;
                                };
                                socket.onmessage = function (e) {
                                    console.log("Received: " + e.data);
                                    var action = JSON.parse(e.data);
                                    if (action && action.type) {
                                        dispatch(action);
                                    } else {
                                        console.log('websocket received unknown data!');
                                    }
                                };
                                socket.onerror = function (e) {
                                    if (e.error) console.log("Error: " + e.error);
                                };

                            case 6:
                            case "end":
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        };
    }
};
var reducer = function reducer(state, action) {
    switch (action.type) {
        case 'CONNECTED':
            return { connected: true };
        case 'DISCONNECTED':
            return { connected: false };
        default:
            var exhaustiveCheck = action;
    }
    return state || DefaultState;
};

/***/ }),
/* 34 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__Counter__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__Footer__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__Contact__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__Session__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__WebsocketConnection__ = __webpack_require__(33);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__Login__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__User__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Register__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__Auth__ = __webpack_require__(9);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return reducers; });










var reducers = {
    session: __WEBPACK_IMPORTED_MODULE_3__Session__["b" /* reducer */],
    connection: __WEBPACK_IMPORTED_MODULE_4__WebsocketConnection__["a" /* reducer */],
    auth: __WEBPACK_IMPORTED_MODULE_8__Auth__["b" /* reducer */],
    user: __WEBPACK_IMPORTED_MODULE_6__User__["c" /* reducer */],
    login: __WEBPACK_IMPORTED_MODULE_5__Login__["b" /* reducer */],
    register: __WEBPACK_IMPORTED_MODULE_7__Register__["a" /* reducer */],
    counter: __WEBPACK_IMPORTED_MODULE_0__Counter__["a" /* reducer */],
    footer: __WEBPACK_IMPORTED_MODULE_1__Footer__["a" /* reducer */],
    contact: __WEBPACK_IMPORTED_MODULE_2__Contact__["a" /* reducer */]
};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,77u/PHN2ZyB3aWR0aD0iOW1tIiBoZWlnaHQ9IjltbSIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4yIiBiYXNlUHJvZmlsZT0idGlueSI+DQogIDxkZXNjPlJST0QgTG9nbzwvZGVzYz4NCiAgPCEtLSBTaG93IG91dGxpbmUgb2YgY2FudmFzIHVzaW5nICdyZWN0JyBlbGVtZW50IC0tPg0KICA8Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0MCIgZmlsbD0id2hpdGUiIHN0cm9rZT0icmVkIiBzdHJva2Utd2lkdGg9IjEyIiAgLz4NCjwvc3ZnPg=="

/***/ }),
/* 36 */
/***/ (function(module, exports) {

module.exports = require("aspnet-prerendering");

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("classnames");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("lodash/debounce");

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = require("react-dom");

/***/ }),
/* 40 */
/***/ (function(module, exports) {

module.exports = require("react-dom/server");

/***/ }),
/* 41 */
/***/ (function(module, exports) {

module.exports = require("react-motion");

/***/ }),
/* 42 */
/***/ (function(module, exports) {

module.exports = require("react-router-bootstrap");

/***/ }),
/* 43 */
/***/ (function(module, exports) {

module.exports = require("react-router-redux");

/***/ }),
/* 44 */
/***/ (function(module, exports) {

module.exports = require("react-scroll");

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("redux");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("redux-thunk");

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(16);
module.exports = __webpack_require__(15);


/***/ })
/******/ ])));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgN2U0YTA0YWI1ZTViOGQ0OWUxNzkiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3RcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJ0c2xpYlwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LXJlZHV4XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiZG9tYWluLXRhc2tcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1ib290c3RyYXBcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1yb3V0ZXJcIiIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvc3RvcmUvTG9naW4udHMiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY29yZS1kZWNvcmF0b3JzXCIiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL3N0b3JlL1VzZXIudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL3N0b3JlL0F1dGgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL3N0b3JlL0NvbnRhY3QudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL3N0b3JlL0NvdW50ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL3N0b3JlL0Zvb3Rlci50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvc3RvcmUvUmVnaXN0ZXIudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL3N0b3JlL1Nlc3Npb24udHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2Jvb3Qtc2VydmVyLnRzeCIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJiYWJlbC1wb2x5ZmlsbFwiIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9jb21wb25lbnRzL0NvbnRhY3QudHN4Iiwid2VicGFjazovLy8uL0NsaWVudEFwcC9jb21wb25lbnRzL0NvdW50ZXIudHN4Iiwid2VicGFjazovLy8uL0NsaWVudEFwcC9jb21wb25lbnRzL0Zvb3Rlci50c3giLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2NvbXBvbmVudHMvSG9tZS50c3giLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2NvbXBvbmVudHMvTGF5b3V0LnRzeCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvY29tcG9uZW50cy9Mb2dpbi50c3giLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2NvbXBvbmVudHMvTG9nb3V0LnRzeCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvY29tcG9uZW50cy9OYXZNZW51LnRzeCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvY29tcG9uZW50cy9SZWdpc3Rlci50c3giLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2NvbXBvbmVudHMvVXNlci50c3giLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2NvbmZpZ3VyZVN0b3JlLnRzIiwid2VicGFjazovLy8uL0NsaWVudEFwcC9saWIvZnVsbHNjcmVlbi50c3giLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2xpYi9yb3V0ZS10cmFuc2l0aW9uLnRzeCIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvbGliL3Njcm9sbC1lZmZlY3QudHN4Iiwid2VicGFjazovLy8uL0NsaWVudEFwcC9yb3V0ZXMudHN4Iiwid2VicGFjazovLy8uL0NsaWVudEFwcC9zZXJ2ZXIvQ291bnRlci50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvc3RvcmUvV2Vic29ja2V0Q29ubmVjdGlvbi50cyIsIndlYnBhY2s6Ly8vLi9DbGllbnRBcHAvc3RvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vLy4vQ2xpZW50QXBwL2ltYWdlcy9sb2dvLnN2ZyIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJhc3BuZXQtcHJlcmVuZGVyaW5nXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwiY2xhc3NuYW1lc1wiIiwid2VicGFjazovLy9leHRlcm5hbCBcImxvZGFzaC9kZWJvdW5jZVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LWRvbVwiIiwid2VicGFjazovLy9leHRlcm5hbCBcInJlYWN0LWRvbS9zZXJ2ZXJcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1tb3Rpb25cIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWFjdC1yb3V0ZXItYm9vdHN0cmFwXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3Qtcm91dGVyLXJlZHV4XCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVhY3Qtc2Nyb2xsXCIiLCJ3ZWJwYWNrOi8vL2V4dGVybmFsIFwicmVkdXhcIiIsIndlYnBhY2s6Ly8vZXh0ZXJuYWwgXCJyZWR1eC10aHVua1wiIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQSxtREFBMkMsY0FBYzs7QUFFekQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7O0FDaEVBLGtDOzs7Ozs7QUNBQSxrQzs7Ozs7O0FDQUEsd0M7Ozs7OztBQ0FBLHdDOzs7Ozs7QUNBQSw0Qzs7Ozs7O0FDQUEseUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDQW9DO0FBSVU7QUFDeUU7QUFHaEgsSUFBbUIsZ0JBQXdCO0FBQzNDLElBQW1CLGdCQUF3QjtBQUMzQyxJQUFtQixnQkFBd0I7QUFDM0MsSUFBaUIsY0FBc0I7QUFDdkMsSUFBb0IsaUJBQXlCO0FBQzdDLElBQW9CLGlCQUF5QjtBQUM3QyxJQUFrQixlQUF1QjtBQU9oRCxJQUF1QjtBQUNMLG9CQUFPO0FBQ1Is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QUNiLFdBQU8sdURBQVE7QUFDWixjQUFVLDBEQUFRO0FBQ25CLGFBQVMseURBQVE7QUFDbEIsWUFBUSx3REFBUTtBQUNmLGFBQVMseURBQ2xCO0FBVnNCLENBQWpCLEM7Ozs7OztBQzFCUCxxQ0FBcUMsb1o7Ozs7OztBQ0FyQyxnRDs7Ozs7O0FDQUEsdUM7Ozs7OztBQ0FBLDRDOzs7Ozs7QUNBQSxzQzs7Ozs7O0FDQUEsNkM7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSxtRDs7Ozs7O0FDQUEsK0M7Ozs7OztBQ0FBLHlDOzs7Ozs7QUNBQSxrQzs7Ozs7O0FDQUEsd0MiLCJmaWxlIjoibWFpbi1zZXJ2ZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSlcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcblxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gaWRlbnRpdHkgZnVuY3Rpb24gZm9yIGNhbGxpbmcgaGFybW9ueSBpbXBvcnRzIHdpdGggdGhlIGNvcnJlY3QgY29udGV4dFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5pID0gZnVuY3Rpb24odmFsdWUpIHsgcmV0dXJuIHZhbHVlOyB9O1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSA0Nyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgN2U0YTA0YWI1ZTViOGQ0OWUxNzkiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0XCJcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwidHNsaWJcIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJ0c2xpYlwiXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXJlZHV4XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtcmVkdXhcIlxuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJkb21haW4tdGFza1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImRvbWFpbi10YXNrXCJcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3QtYm9vdHN0cmFwXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtYm9vdHN0cmFwXCJcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3Qtcm91dGVyXCJcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZmV0Y2ggfSBmcm9tICdkb21haW4tdGFzayc7XHJcbmltcG9ydCB7IEFjdGlvbiwgUmVkdWNlciwgQWN0aW9uQ3JlYXRvciB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgQXBwVGh1bmtBY3Rpb24gfSBmcm9tICcuLyc7XHJcbmltcG9ydCB7IExvZ2luSW5wdXRNb2RlbCB9IGZyb20gJy4uL3NlcnZlci9Mb2dpbklucHV0TW9kZWwnO1xyXG5pbXBvcnQgeyBicm93c2VySGlzdG9yeSB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XHJcbmltcG9ydCB7IGFjdGlvbkNyZWF0b3JzIGFzIHVzZXJBY3Rpb25DcmVhdG9ycywgR2V0VXNlclJlY2VpdmVkQWN0aW9uLCBHZXRVc2VyUmVxdWVzdEFjdGlvbiwgVXNlck1vZGVsIH0gIGZyb20gJy4vVXNlcic7XHJcbmltcG9ydCB7IExvZ291dElucHV0TW9kZWwgfSBmcm9tICcuLi9zZXJ2ZXIvTG9nb3V0SW5wdXRNb2RlbCc7XHJcblxyXG5leHBvcnQgY29uc3QgTE9HSU5fUkVRVUVTVCA9ICdMb2dpblJlcXVlc3RBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgTE9HSU5fU1VDQ0VTUyA9ICdMb2dpblN1Y2Nlc3NBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgTE9HSU5fSU5WQUxJRCA9ICdMb2dpbkludmFsaWRBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgTE9HSU5fRVJST1IgPSAnTG9naW5FcnJvckFjdGlvbic7XHJcbmV4cG9ydCBjb25zdCBMT0dPVVRfUkVRVUVTVCA9ICdMb2dvdXRSZXF1ZXN0QWN0aW9uJztcclxuZXhwb3J0IGNvbnN0IExPR09VVF9TVUNDRVNTID0gJ0xvZ291dFN1Y2Nlc3NBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgTE9HT1VUX0VSUk9SID0gJ0xvZ291dEVycm9yQWN0aW9uJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgTG9naW5TdGF0ZSB7XHJcbiAgICBhdXRoZW50aWNhdGluZzogYm9vbGVhbjtcclxuICAgIGF1dGhlbnRpY2F0ZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IERlZmF1bHRMb2dpblN0YXRlOiBMb2dpblN0YXRlID0ge1xyXG4gICAgYXV0aGVudGljYXRpbmc6IGZhbHNlLFxyXG4gICAgYXV0aGVudGljYXRlZDogZmFsc2VcclxufVxyXG5cclxuaW50ZXJmYWNlIExvZ2luUmVxdWVzdEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnTG9naW5SZXF1ZXN0QWN0aW9uJztcclxufVxyXG5cclxuaW50ZXJmYWNlIExvZ2luRXJyb3JBY3Rpb24ge1xyXG4gICAgdHlwZTogJ0xvZ2luRXJyb3JBY3Rpb24nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExvZ2luU3VjY2Vzc0FjdGlvbiB7XHJcbiAgICB0eXBlOiAnTG9naW5TdWNjZXNzQWN0aW9uJztcclxufVxyXG5cclxuaW50ZXJmYWNlIExvZ2luSW52YWxpZEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnTG9naW5JbnZhbGlkQWN0aW9uJztcclxufVxyXG5cclxuaW50ZXJmYWNlIExvZ291dEVycm9yQWN0aW9uIHtcclxuICAgIHR5cGU6ICdMb2dvdXRFcnJvckFjdGlvbic7XHJcbn1cclxuXHJcbmludGVyZmFjZSBBdXRoZW50aWNhdGVkQWN0aW9uIHtcclxuICAgIHR5cGU6ICdBdXRoZW50aWNhdGVkQWN0aW9uJztcclxuICAgIGlkVG9rZW46IGFueTtcclxuICAgIGF1dGhUb2tlbjogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTG9nb3V0UmVxdWVzdEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnTG9nb3V0UmVxdWVzdEFjdGlvbic7XHJcbn1cclxuXHJcbmludGVyZmFjZSBMb2dvdXRTdWNjZXNzQWN0aW9uIHtcclxuICAgIHR5cGU6ICdMb2dvdXRTdWNjZXNzQWN0aW9uJztcclxufVxyXG5cclxuLy8gVE9ETyBpbXBvcnQgU3VjY2VzcyBhbmQgSW52YWxpZCBhY3Rpb25zIGZyb20gc2VydmVyIGFuZCBoYW5kbGUgdGhlbVxyXG50eXBlIEtub3duQWN0aW9uID0gTG9naW5SZXF1ZXN0QWN0aW9uIHwgTG9naW5FcnJvckFjdGlvbiB8IExvZ2luU3VjY2Vzc0FjdGlvbiB8IExvZ2luSW52YWxpZEFjdGlvbiB8IExvZ291dFJlcXVlc3RBY3Rpb24gfCBMb2dvdXRFcnJvckFjdGlvbiB8IExvZ291dFN1Y2Nlc3NBY3Rpb247XHJcblxyXG5leHBvcnQgY29uc3QgYWN0aW9uQ3JlYXRvcnMgPSB7XHJcblxyXG4gICAgbG9naW46IChsb2dpbklucHV0OiBMb2dpbklucHV0TW9kZWwpOiBBcHBUaHVua0FjdGlvbjxLbm93bkFjdGlvbj4gPT4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogTE9HSU5fUkVRVUVTVCB9KTtcclxuXHJcbiAgICAgICAgdmFyIHhzcmYgPSBnZXRTdGF0ZSgpLnNlc3Npb24ueHNyZlRva2VuO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IDxSZXNwb25zZT5hd2FpdCBmZXRjaCgnL2FjY291bnQvbG9naW4nLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAgICAgJ1gtWFNSRi1UT0tFTic6IHhzcmZcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkobG9naW5JbnB1dClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogTE9HSU5fU1VDQ0VTUyB9KTtcclxuICAgICAgICAgICAgZGlzcGF0Y2godXNlckFjdGlvbkNyZWF0b3JzLmdldFVzZXIoKSBhcyBhbnkpO1xyXG4gICAgICAgICAgICBicm93c2VySGlzdG9yeS5wdXNoKCcvJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gVE9ETzogZGlzcGxheSBlcnJvclxyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IExPR0lOX0VSUk9SIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBsb2dvdXQ6ICgpOiBBcHBUaHVua0FjdGlvbjxLbm93bkFjdGlvbj4gPT4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogTE9HSU5fUkVRVUVTVCB9KTtcclxuXHJcbiAgICAgICAgdmFyIHhzcmYgPSBnZXRTdGF0ZSgpLnNlc3Npb24ueHNyZlRva2VuO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IDxSZXNwb25zZT5hd2FpdCBmZXRjaCgnL2FjY291bnQvbG9nb3V0Jywge1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAgICAgJ1gtWFNSRi1UT0tFTic6IHhzcmZcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBMT0dPVVRfU1VDQ0VTUyB9KTtcclxuICAgICAgICAgICAgYnJvd3Nlckhpc3RvcnkucHVzaCgnLycpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogTE9HT1VUX0VSUk9SIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXI6IFJlZHVjZXI8TG9naW5TdGF0ZT4gPSAoc3RhdGU6IExvZ2luU3RhdGUsIGFjdGlvbjogS25vd25BY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIExPR0lOX1JFUVVFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiB7IGF1dGhlbnRpY2F0aW5nOiB0cnVlLCBhdXRoZW50aWNhdGVkOiBmYWxzZSB9O1xyXG4gICAgICAgIGNhc2UgTE9HSU5fRVJST1I6XHJcbiAgICAgICAgICAgIHJldHVybiB7IGF1dGhlbnRpY2F0aW5nOiBmYWxzZSwgYXV0aGVudGljYXRlZDogZmFsc2UgfTtcclxuICAgICAgICBjYXNlIExPR0lOX1NVQ0NFU1M6XHJcbiAgICAgICAgICAgIHJldHVybiB7IGF1dGhlbnRpY2F0aW5nOiBmYWxzZSwgYXV0aGVudGljYXRlZDogdHJ1ZSB9O1xyXG4gICAgICAgIGNhc2UgTE9HSU5fSU5WQUxJRDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgYXV0aGVudGljYXRpbmc6IGZhbHNlLCBhdXRoZW50aWNhdGVkOiBmYWxzZSB9O1xyXG4gICAgICAgIGNhc2UgTE9HT1VUX1JFUVVFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiB7IGF1dGhlbnRpY2F0aW5nOiB0cnVlLCBhdXRoZW50aWNhdGVkOiB0cnVlIH07XHJcbiAgICAgICAgY2FzZSBMT0dPVVRfRVJST1I6XHJcbiAgICAgICAgICAgIHJldHVybiB7IGF1dGhlbnRpY2F0aW5nOiBmYWxzZSwgYXV0aGVudGljYXRlZDogdHJ1ZSB9O1xyXG4gICAgICAgIGNhc2UgTE9HT1VUX1NVQ0NFU1M6XHJcbiAgICAgICAgICAgIHJldHVybiB7IGF1dGhlbnRpY2F0aW5nOiBmYWxzZSwgYXV0aGVudGljYXRlZDogZmFsc2UgfTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zdCBleGhhdXN0aXZlQ2hlY2s6IG5ldmVyID0gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGF0ZSB8fCBEZWZhdWx0TG9naW5TdGF0ZTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL3N0b3JlL0xvZ2luLnRzIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY29yZS1kZWNvcmF0b3JzXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiY29yZS1kZWNvcmF0b3JzXCJcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgZmV0Y2gsIGFkZFRhc2sgfSBmcm9tICdkb21haW4tdGFzayc7XHJcbmltcG9ydCB7IEFjdGlvbiwgUmVkdWNlciwgQWN0aW9uQ3JlYXRvciB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgQXBwVGh1bmtBY3Rpb24gfSBmcm9tICcuLyc7XHJcbmltcG9ydCB7IFVzZXJNb2RlbCB9IGZyb20gJy4uL3NlcnZlci9Vc2VyTW9kZWwnO1xyXG5pbXBvcnQgKiBhcyBTZXJ2ZXIgZnJvbSAnLi4vc2VydmVyL1VzZXInO1xyXG5cclxuZXhwb3J0IGNvbnN0IEdFVFVTRVJfUkVRVUVTVCA9ICdHZXRVc2VyUmVxdWVzdEFjdGlvbic7XHJcbmV4cG9ydCBjb25zdCBHRVRVU0VSX1JFQ0VJVkVEID0gJ0dldFVzZXJSZWNlaXZlZEFjdGlvbic7XHJcblxyXG5jb25zdCBEZWZhdWx0VXNlck1vZGVsOiBVc2VyTW9kZWwgPSB7XHJcbiAgICBpc0F1dGhlbnRpY2F0ZWQ6IGZhbHNlLFxyXG4gICAgZW1haWw6IHVuZGVmaW5lZCxcclxuICAgIGZpcnN0TmFtZTogdW5kZWZpbmVkLFxyXG4gICAgbGFzdE5hbWU6IHVuZGVmaW5lZCxcclxuICAgIHBob25lTnVtYmVyOiB1bmRlZmluZWQsXHJcbiAgICB1c2VySWQ6IHVuZGVmaW5lZFxyXG59O1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHZXRVc2VyUmVxdWVzdEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnR2V0VXNlclJlcXVlc3RBY3Rpb24nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEdldFVzZXJSZWNlaXZlZEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnR2V0VXNlclJlY2VpdmVkQWN0aW9uJztcclxuICAgIHBheWxvYWQ6IFVzZXJNb2RlbDtcclxufVxyXG5cclxuZXhwb3J0IHsgVXNlck1vZGVsIH07XHJcblxyXG5cclxuLy8gVE9ETyBpbXBvcnQgU3VjY2VzcyBhbmQgSW52YWxpZCBhY3Rpb25zIGZyb20gc2VydmVyIGFuZCBoYW5kbGUgdGhlbVxyXG50eXBlIEtub3duQWN0aW9uID0gR2V0VXNlclJlcXVlc3RBY3Rpb24gfCBHZXRVc2VyUmVjZWl2ZWRBY3Rpb247XHJcblxyXG5leHBvcnQgY29uc3QgYWN0aW9uQ3JlYXRvcnMgPSB7XHJcblxyXG4gICAgZ2V0VXNlcjogKCk6IEFwcFRodW5rQWN0aW9uPEtub3duQWN0aW9uPiA9PiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgbGV0IGZldGNoVGFzayA9IGZldGNoKCcvYWNjb3VudC9nZXR1c2VyJywge1xyXG4gICAgICAgICAgICAgICAgY3JlZGVudGlhbHM6ICdpbmNsdWRlJyxcclxuICAgICAgICAgICAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSBhcyBQcm9taXNlPFVzZXJNb2RlbD4pXHJcbiAgICAgICAgICAgIC50aGVuKHVzZXJNb2RlbCA9PiB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogR0VUVVNFUl9SRUNFSVZFRCwgcGF5bG9hZDogdXNlck1vZGVsIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWRkVGFzayhmZXRjaFRhc2spO1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogR0VUVVNFUl9SRVFVRVNUIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWR1Y2VyOiBSZWR1Y2VyPFVzZXJNb2RlbD4gPSAoc3RhdGU6IFVzZXJNb2RlbCwgYWN0aW9uOiBLbm93bkFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgR0VUVVNFUl9SRVFVRVNUOlxyXG4gICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcbiAgICAgICAgY2FzZSBHRVRVU0VSX1JFQ0VJVkVEOlxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aW9uLnBheWxvYWQ7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc3QgZXhoYXVzdGl2ZUNoZWNrOiBuZXZlciA9IGFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RhdGUgfHwgRGVmYXVsdFVzZXJNb2RlbDtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL3N0b3JlL1VzZXIudHMiLCJpbXBvcnQgeyBmZXRjaCB9IGZyb20gJ2RvbWFpbi10YXNrJztcclxuaW1wb3J0IHsgQWN0aW9uLCBSZWR1Y2VyLCBBY3Rpb25DcmVhdG9yIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyBBcHBUaHVua0FjdGlvbiB9IGZyb20gJy4vJztcclxuXHJcbmV4cG9ydCBjb25zdCBUT0tFTl9SRVFVRVNUID0gJ1Rva2VuUmVxdWVzdEFjdGlvbic7XHJcbmV4cG9ydCBjb25zdCBUT0tFTl9SRUNFSVZFRCA9ICdUb2tlblJlY2VpdmVkQWN0aW9uJztcclxuZXhwb3J0IGNvbnN0IFRPS0VOX0VSUk9SID0gJ1Rva2VuRXJyb3JBY3Rpb24nO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBBdXRoU3RhdGUge1xyXG4gICAgcmVxdWVzdGluZzogYm9vbGVhbjtcclxuICAgIGFjY2Vzc1Rva2VuPzogc3RyaW5nO1xyXG4gICAgcmVmcmVzaFRva2VuPzogc3RyaW5nO1xyXG4gICAgZXhwaXJlcz86IERhdGVcclxufVxyXG5cclxuY29uc3QgRGVmYXVsdEF1dGhTdGF0ZTogQXV0aFN0YXRlID0ge1xyXG4gICAgcmVxdWVzdGluZzogZmFsc2VcclxufVxyXG5cclxuaW50ZXJmYWNlIFRva2VuUmVxdWVzdEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnVG9rZW5SZXF1ZXN0QWN0aW9uJztcclxufVxyXG5cclxuaW50ZXJmYWNlIFRva2VuRXJyb3JBY3Rpb24ge1xyXG4gICAgdHlwZTogJ1Rva2VuRXJyb3JBY3Rpb24nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgVG9rZW5SZXN1bHRNb2RlbCB7XHJcbiAgICBhY2Nlc3NUb2tlbjogc3RyaW5nO1xyXG4gICAgcmVmcmVzaFRva2VuOiBzdHJpbmc7XHJcbiAgICBleHBpcmVzOiBEYXRlXHJcbn1cclxuXHJcbmludGVyZmFjZSBUb2tlblJlY2VpdmVkQWN0aW9uIHtcclxuICAgIHR5cGU6ICdUb2tlblJlY2VpdmVkQWN0aW9uJztcclxuICAgIHBheWxvYWQ6IFRva2VuUmVzdWx0TW9kZWxcclxufVxyXG5cclxuLy8gVE9ETyBpbXBvcnQgU3VjY2VzcyBhbmQgSW52YWxpZCBhY3Rpb25zIGZyb20gc2VydmVyIGFuZCBoYW5kbGUgdGhlbVxyXG50eXBlIEtub3duQWN0aW9uID0gVG9rZW5SZXF1ZXN0QWN0aW9uIHwgVG9rZW5SZWNlaXZlZEFjdGlvbiB8IFRva2VuRXJyb3JBY3Rpb247XHJcblxyXG5leHBvcnQgY29uc3QgYWN0aW9uQ3JlYXRvcnMgPSB7XHJcblxyXG4gICAgZ2V0VG9rZW46ICgpOiBBcHBUaHVua0FjdGlvbjxLbm93bkFjdGlvbj4gPT4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogVE9LRU5fUkVRVUVTVCB9KTtcclxuXHJcbiAgICAgICAgdmFyIHhzcmYgPSBnZXRTdGF0ZSgpLnNlc3Npb24ueHNyZlRva2VuO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IDxSZXNwb25zZT5hd2FpdCBmZXRjaCgnL2Nvbm5lY3QvdG9rZW4nLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAgICAgJ1gtWFNSRi1UT0tFTic6IHhzcmZcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogXCJcIlxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAocmVzcG9uc2Uub2spIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdDogVG9rZW5SZXN1bHRNb2RlbCA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBUT0tFTl9SRUNFSVZFRCwgcGF5bG9hZDogcmVzdWx0IH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAvLyBUT0RPOiBkaXNwbGF5IGVycm9yXHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogVE9LRU5fRVJST1IgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCByZWR1Y2VyOiBSZWR1Y2VyPEF1dGhTdGF0ZT4gPSAoc3RhdGU6IEF1dGhTdGF0ZSwgYWN0aW9uOiBLbm93bkFjdGlvbikgPT4ge1xyXG4gICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG4gICAgICAgIGNhc2UgVE9LRU5fUkVRVUVTVDpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlcXVlc3Rpbmc6IHRydWUgfTtcclxuICAgICAgICBjYXNlIFRPS0VOX1JFQ0VJVkVEOlxyXG4gICAgICAgICAgICByZXR1cm4geyByZXF1ZXN0aW5nOiBmYWxzZSwgYWNjZXNzVG9rZW46IGFjdGlvbi5wYXlsb2FkLmFjY2Vzc1Rva2VuIH07XHJcbiAgICAgICAgY2FzZSBUT0tFTl9FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHJlcXVlc3Rpbmc6IGZhbHNlIH07XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgY29uc3QgZXhoYXVzdGl2ZUNoZWNrOiBuZXZlciA9IGFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RhdGUgfHwgRGVmYXVsdEF1dGhTdGF0ZTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL3N0b3JlL0F1dGgudHMiLCJpbXBvcnQgeyBmZXRjaCB9IGZyb20gJ2RvbWFpbi10YXNrJztcclxuaW1wb3J0IHsgQWN0aW9uLCBSZWR1Y2VyLCBBY3Rpb25DcmVhdG9yIH0gZnJvbSAncmVkdXgnO1xyXG5pbXBvcnQgeyBBcHBUaHVua0FjdGlvbiB9IGZyb20gJy4vJztcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS0tXHJcbi8vIFNUQVRFIC0gVGhpcyBkZWZpbmVzIHRoZSB0eXBlIG9mIGRhdGEgbWFpbnRhaW5lZCBpbiB0aGUgUmVkdXggc3RvcmUuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbnRhY3RTdGF0ZSB7XHJcbiAgICBmb3JtOiBDb250YWN0Rm9ybTtcclxuICAgIGlzU3VibWl0dGluZzogYm9vbGVhbjtcclxuICAgIHN1Ym1pdHRlZDogYm9vbGVhbjtcclxuICAgIHJlc3VsdD86IHN0cmluZztcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb250YWN0Rm9ybSB7XHJcbiAgICBmaXJzdE5hbWU/OiBzdHJpbmc7XHJcbiAgICBsYXN0TmFtZT86IHN0cmluZztcclxuICAgIGVtYWlsPzogc3RyaW5nO1xyXG4gICAgcGhvbmU/OiBzdHJpbmc7XHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBBQ1RJT05TIC0gVGhlc2UgYXJlIHNlcmlhbGl6YWJsZSAoaGVuY2UgcmVwbGF5YWJsZSkgZGVzY3JpcHRpb25zIG9mIHN0YXRlIHRyYW5zaXRpb25zLlxyXG4vLyBUaGV5IGRvIG5vdCB0aGVtc2VsdmVzIGhhdmUgYW55IHNpZGUtZWZmZWN0czsgdGhleSBqdXN0IGRlc2NyaWJlIHNvbWV0aGluZyB0aGF0IGlzIGdvaW5nIHRvIGhhcHBlbi5cclxuXHJcbmludGVyZmFjZSBTdWJtaXRDb250YWN0Rm9ybUFjdGlvbiB7XHJcbiAgICB0eXBlOiAnU1VCTUlUX0NPTlRBQ1RfRk9STSdcclxuICAgIHBheWxvYWQ6IENvbnRhY3RGb3JtXHJcbn1cclxuXHJcbmludGVyZmFjZSBDb250YWN0Rm9ybVJlY2lldmVkQWN0aW9uIHtcclxuICAgIHR5cGU6ICdDT05UQUNUX0ZPUk1fUkVDSUVWRUQnLFxyXG4gICAgcGF5bG9hZDoge1xyXG4gICAgICAgIHJlc3VsdDogc3RyaW5nO1xyXG4gICAgfVxyXG59XHJcblxyXG5pbnRlcmZhY2UgQ29udGFjdEZvcm1FcnJvckFjdGlvbiB7XHJcbiAgICB0eXBlOiAnQ09OVEFDVF9GT1JNX0VSUk9SJyxcclxuICAgIHBheWxvYWQ6IHtcclxuICAgICAgICBmb3JtOiBDb250YWN0Rm9ybSxcclxuICAgICAgICByZXN1bHQ6IHN0cmluZztcclxuICAgIH1cclxufVxyXG5cclxuLy8gRGVjbGFyZSBhICdkaXNjcmltaW5hdGVkIHVuaW9uJyB0eXBlLiBUaGlzIGd1YXJhbnRlZXMgdGhhdCBhbGwgcmVmZXJlbmNlcyB0byAndHlwZScgcHJvcGVydGllcyBjb250YWluIG9uZSBvZiB0aGVcclxuLy8gZGVjbGFyZWQgdHlwZSBzdHJpbmdzIChhbmQgbm90IGFueSBvdGhlciBhcmJpdHJhcnkgc3RyaW5nKS5cclxudHlwZSBLbm93bkFjdGlvbiA9IFN1Ym1pdENvbnRhY3RGb3JtQWN0aW9uIHwgQ29udGFjdEZvcm1SZWNpZXZlZEFjdGlvbiB8IENvbnRhY3RGb3JtRXJyb3JBY3Rpb247XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vIEFDVElPTiBDUkVBVE9SUyAtIFRoZXNlIGFyZSBmdW5jdGlvbnMgZXhwb3NlZCB0byBVSSBjb21wb25lbnRzIHRoYXQgd2lsbCB0cmlnZ2VyIGEgc3RhdGUgdHJhbnNpdGlvbi5cclxuLy8gVGhleSBkb24ndCBkaXJlY3RseSBtdXRhdGUgc3RhdGUsIGJ1dCB0aGV5IGNhbiBoYXZlIGV4dGVybmFsIHNpZGUtZWZmZWN0cyAoc3VjaCBhcyBsb2FkaW5nIGRhdGEpLlxyXG5cclxuZXhwb3J0IGNvbnN0IGFjdGlvbkNyZWF0b3JzID0ge1xyXG5cclxuICAgIHN1Ym1pdENvbnRhY3RGb3JtOiAoZm9ybTogQ29udGFjdEZvcm0pOiBBcHBUaHVua0FjdGlvbjxLbm93bkFjdGlvbj4gPT4gYXN5bmMgKGRpc3BhdGNoLCBnZXRTdGF0ZSkgPT4ge1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogJ1NVQk1JVF9DT05UQUNUX0ZPUk0nLCBwYXlsb2FkOiBmb3JtIH0pO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvY29udGFjdCcsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KGZvcm0pLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiBuZXcgSGVhZGVycyh7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgaWYgKGRhdGEucmVzdWx0LnN0YXR1cyA9PT0gXCJPS1wiKVxyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6ICdDT05UQUNUX0ZPUk1fUkVDSUVWRUQnLCBwYXlsb2FkOiB7IHJlc3VsdDogZGF0YS5tZXNzYWdlIH0gfSk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6ICdDT05UQUNUX0ZPUk1fRVJST1InLCBwYXlsb2FkOiB7IGZvcm06IGZvcm0sIHJlc3VsdDogZGF0YS5tZXNzYWdlIH0gfSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tXHJcbi8vIFJFRFVDRVIgLSBGb3IgYSBnaXZlbiBzdGF0ZSBhbmQgYWN0aW9uLCByZXR1cm5zIHRoZSBuZXcgc3RhdGUuIFRvIHN1cHBvcnQgdGltZSB0cmF2ZWwsIHRoaXMgbXVzdCBub3QgbXV0YXRlIHRoZSBvbGQgc3RhdGUuXHJcblxyXG5jb25zdCB1bmxvYWRlZFN0YXRlOiBDb250YWN0U3RhdGUgPSB7IGlzU3VibWl0dGluZzogZmFsc2UsIHN1Ym1pdHRlZDogZmFsc2UsIGZvcm06IHt9IH07XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlcjogUmVkdWNlcjxDb250YWN0U3RhdGU+ID0gKHN0YXRlOiBDb250YWN0U3RhdGUsIGFjdGlvbjogS25vd25BY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdTVUJNSVRfQ09OVEFDVF9GT1JNJzpcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGZvcm06IGFjdGlvbi5wYXlsb2FkLFxyXG4gICAgICAgICAgICAgICAgaXNTdWJtaXR0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VibWl0dGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGNhc2UgJ0NPTlRBQ1RfRk9STV9SRUNJRVZFRCc6XHJcbiAgICAgICAgICAgIC8vIE9ubHkgYWNjZXB0IHRoZSBpbmNvbWluZyBkYXRhIGlmIGl0IG1hdGNoZXMgdGhlIG1vc3QgcmVjZW50IHJlcXVlc3QuIFRoaXMgZW5zdXJlcyB3ZSBjb3JyZWN0bHlcclxuICAgICAgICAgICAgLy8gaGFuZGxlIG91dC1vZi1vcmRlciByZXNwb25zZXMuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBmb3JtOiB7IGZpcnN0TmFtZTogJycsIGxhc3ROYW1lOiAnJywgZW1haWw6ICcnLCBwaG9uZTogJycsIG1lc3NhZ2U6ICcnIH0sXHJcbiAgICAgICAgICAgICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc3VibWl0dGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgcmVzdWx0OiBhY3Rpb24ucGF5bG9hZC5yZXN1bHRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBjYXNlICdDT05UQUNUX0ZPUk1fRVJST1InOlxyXG4gICAgICAgICAgICAvLyBPbmx5IGFjY2VwdCB0aGUgaW5jb21pbmcgZGF0YSBpZiBpdCBtYXRjaGVzIHRoZSBtb3N0IHJlY2VudCByZXF1ZXN0LiBUaGlzIGVuc3VyZXMgd2UgY29ycmVjdGx5XHJcbiAgICAgICAgICAgIC8vIGhhbmRsZSBvdXQtb2Ytb3JkZXIgcmVzcG9uc2VzLlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgZm9ybTogYWN0aW9uLnBheWxvYWQuZm9ybSxcclxuICAgICAgICAgICAgICAgIGlzU3VibWl0dGluZzogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzdWJtaXR0ZWQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZXN1bHQ6IGFjdGlvbi5wYXlsb2FkLnJlc3VsdFxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIC8vIFRoZSBmb2xsb3dpbmcgbGluZSBndWFyYW50ZWVzIHRoYXQgZXZlcnkgYWN0aW9uIGluIHRoZSBLbm93bkFjdGlvbiB1bmlvbiBoYXMgYmVlbiBjb3ZlcmVkIGJ5IGEgY2FzZSBhYm92ZVxyXG4gICAgICAgICAgICBjb25zdCBleGhhdXN0aXZlQ2hlY2s6IG5ldmVyID0gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGF0ZSB8fCB1bmxvYWRlZFN0YXRlO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvc3RvcmUvQ29udGFjdC50cyIsImltcG9ydCB7IGZldGNoLCBhZGRUYXNrIH0gZnJvbSAnZG9tYWluLXRhc2snO1xyXG5pbXBvcnQgeyBBY3Rpb24sIFJlZHVjZXIgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IEFwcFRodW5rQWN0aW9uIH0gZnJvbSAnLi8nO1xyXG5pbXBvcnQgKiBhcyBTZXJ2ZXIgZnJvbSAnLi4vc2VydmVyL0NvdW50ZXInO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gU1RBVEUgLSBUaGlzIGRlZmluZXMgdGhlIHR5cGUgb2YgZGF0YSBtYWludGFpbmVkIGluIHRoZSBSZWR1eCBzdG9yZS5cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ291bnRlclN0YXRlIGV4dGVuZHMgU2VydmVyLkNvdW50ZXJTdGF0ZSB7XHJcbiAgICB0cmFuc2l0aW9uaW5nOiBib29sZWFuO1xyXG59XHJcblxyXG52YXIgRGVmYXVsdENvdW50ZXJTdGF0ZTogQ291bnRlclN0YXRlID0ge1xyXG4gICAgY291bnQ6IDAsXHJcbiAgICBzdGFydGVkOiBmYWxzZSxcclxuICAgIHRyYW5zaXRpb25pbmc6IGZhbHNlXHJcbn07XHJcblxyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLS1cclxuLy8gQUNUSU9OUyAtIFRoZXNlIGFyZSBzZXJpYWxpemFibGUgKGhlbmNlIHJlcGxheWFibGUpIGRlc2NyaXB0aW9ucyBvZiBzdGF0ZSB0cmFuc2l0aW9ucy5cclxuLy8gVGhleSBkbyBub3QgdGhlbXNlbHZlcyBoYXZlIGFueSBzaWRlLWVmZmVjdHM7IHRoZXkganVzdCBkZXNjcmliZSBzb21ldGhpbmcgdGhhdCBpcyBnb2luZyB0byBoYXBwZW4uXHJcbi8vIFVzZSBAdHlwZU5hbWUgYW5kIGlzQWN0aW9uVHlwZSBmb3IgdHlwZSBkZXRlY3Rpb24gdGhhdCB3b3JrcyBldmVuIGFmdGVyIHNlcmlhbGl6YXRpb24vZGVzZXJpYWxpemF0aW9uLlxyXG5jb25zdCBSRVFVRVNUX0NPVU5URVIgPSAnUmVxdWVzdENvdW50ZXJBY3Rpb24nO1xyXG5jb25zdCBSRUNFSVZFX0NPVU5URVIgPSAnUmVjZWl2ZUNvdW50ZXJBY3Rpb24nO1xyXG5cclxuaW50ZXJmYWNlIFJlcXVlc3RDb3VudGVyQWN0aW9uIHsgdHlwZTogJ1JlcXVlc3RDb3VudGVyQWN0aW9uJyB9XHJcbmludGVyZmFjZSBSZWNlaXZlQ291bnRlckFjdGlvbiB7IHR5cGU6ICdSZWNlaXZlQ291bnRlckFjdGlvbicsIHBheWxvYWQ6IFNlcnZlci5Db3VudGVyU3RhdGUgfVxyXG5cclxuLy8gRGVjbGFyZSBhICdkaXNjcmltaW5hdGVkIHVuaW9uJyB0eXBlLiBUaGlzIGd1YXJhbnRlZXMgdGhhdCBhbGwgcmVmZXJlbmNlcyB0byAndHlwZScgcHJvcGVydGllcyBjb250YWluIG9uZSBvZiB0aGVcclxuLy8gZGVjbGFyZWQgdHlwZSBzdHJpbmdzIChhbmQgbm90IGFueSBvdGhlciBhcmJpdHJhcnkgc3RyaW5nKS5cclxudHlwZSBLbm93bkFjdGlvbiA9IFJlcXVlc3RDb3VudGVyQWN0aW9uIHwgUmVjZWl2ZUNvdW50ZXJBY3Rpb24gfCBTZXJ2ZXIuQ291bnRlclN0YXJ0ZWRBY3Rpb24gfCBTZXJ2ZXIuQ291bnRlclN0b3BwZWRBY3Rpb24gfCBTZXJ2ZXIuRGVjcmVtZW50Q291bnRlckFjdGlvbiB8IFNlcnZlci5JbmNyZW1lbnRDb3VudGVyQWN0aW9uIHwgU2VydmVyLlN0YXJ0Q291bnRlckFjdGlvbiB8IFNlcnZlci5TdG9wQ291bnRlckFjdGlvbiB8IFNlcnZlci5TeW5jQ291bnRlclN0YXRlQWN0aW9uO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBBQ1RJT04gQ1JFQVRPUlMgLSBUaGVzZSBhcmUgZnVuY3Rpb25zIGV4cG9zZWQgdG8gVUkgY29tcG9uZW50cyB0aGF0IHdpbGwgdHJpZ2dlciBhIHN0YXRlIHRyYW5zaXRpb24uXHJcbi8vIFRoZXkgZG9uJ3QgZGlyZWN0bHkgbXV0YXRlIHN0YXRlLCBidXQgdGhleSBjYW4gaGF2ZSBleHRlcm5hbCBzaWRlLWVmZmVjdHMgKHN1Y2ggYXMgbG9hZGluZyBkYXRhKS5cclxuXHJcbmFzeW5jIGZ1bmN0aW9uIHBvc3RBY3Rpb25Ub1NlcnZlcihhY3Rpb246IGFueSwgeHNyZlRva2VuOiBzdHJpbmcpIHtcclxuICAgIGxldCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYWN0aW9uJywge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgICAgaGVhZGVyczoge1xyXG4gICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAnWC1YU1JGLVRPS0VOJzogeHNyZlRva2VuXHJcbiAgICAgICAgfSxcclxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeShhY3Rpb24pXHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXNwb25zZTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGFjdGlvbkNyZWF0b3JzID0ge1xyXG4gICAgcmVxdWVzdDogKCk6IEFwcFRodW5rQWN0aW9uPEtub3duQWN0aW9uPiA9PiAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBSRVFVRVNUX0NPVU5URVIgfSk7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcclxuICAgICAgICBsZXQgZmV0Y2hUYXNrID0gZmV0Y2goJy9jb3VudGVyc3RhdGU/aWQ9JyArIHN0YXRlLnNlc3Npb24uaWQsIHtcclxuICAgICAgICAgICAgICAgIGNyZWRlbnRpYWxzOiAnaW5jbHVkZScsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkgYXMgUHJvbWlzZTxDb3VudGVyU3RhdGU+KVxyXG4gICAgICAgICAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogUkVDRUlWRV9DT1VOVEVSLCBwYXlsb2FkOiBkYXRhIH0pO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAuY2F0Y2goKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VydmVyIGhhcyBubyBpbml0aWFsIGNvdW50ZXIgZGF0YScpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYWRkVGFzayhmZXRjaFRhc2spOyAvLyBFbnN1cmUgc2VydmVyLXNpZGUgcHJlcmVuZGVyaW5nIHdhaXRzIGZvciB0aGlzIHRvIGNvbXBsZXRlXHJcbiAgICB9LFxyXG4gICAgaW5jcmVtZW50OiAoKTogQXBwVGh1bmtBY3Rpb248S25vd25BY3Rpb24+ID0+IGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFNlcnZlci5JTkNSRU1FTlRfQ09VTlRFUiB9KTtcclxuICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZSgpO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHBvc3RBY3Rpb25Ub1NlcnZlcih7IHR5cGU6IFNlcnZlci5JTkNSRU1FTlRfQ09VTlRFUiB9LCBzdGF0ZS5zZXNzaW9uLnhzcmZUb2tlbik7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgfSxcclxuICAgIGRlY3JlbWVudDogKCk6IEFwcFRodW5rQWN0aW9uPEtub3duQWN0aW9uPiA9PiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTZXJ2ZXIuREVDUkVNRU5UX0NPVU5URVIgfSk7XHJcbiAgICAgICAgdmFyIHN0YXRlID0gZ2V0U3RhdGUoKTtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBwb3N0QWN0aW9uVG9TZXJ2ZXIoeyB0eXBlOiBTZXJ2ZXIuREVDUkVNRU5UX0NPVU5URVIgfSwgc3RhdGUuc2Vzc2lvbi54c3JmVG9rZW4pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKHJlc3BvbnNlKTtcclxuICAgIH0sXHJcbiAgICBzdGFydDogKCk6IEFwcFRodW5rQWN0aW9uPEtub3duQWN0aW9uPiA9PiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTZXJ2ZXIuU1RBUlRfQ09VTlRFUiB9KTtcclxuICAgICAgICB2YXIgc3RhdGUgPSBnZXRTdGF0ZSgpO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IGF3YWl0IHBvc3RBY3Rpb25Ub1NlcnZlcih7IHR5cGU6IFNlcnZlci5TVEFSVF9DT1VOVEVSIH0sIHN0YXRlLnNlc3Npb24ueHNyZlRva2VuKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICB9LFxyXG4gICAgc3RvcDogKCk6IEFwcFRodW5rQWN0aW9uPEtub3duQWN0aW9uPiA9PiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBTZXJ2ZXIuU1RPUF9DT1VOVEVSIH0pO1xyXG4gICAgICAgIHZhciBzdGF0ZSA9IGdldFN0YXRlKCk7XHJcbiAgICAgICAgbGV0IHJlc3BvbnNlID0gYXdhaXQgcG9zdEFjdGlvblRvU2VydmVyKHsgdHlwZTogU2VydmVyLlNUT1BfQ09VTlRFUiB9LCBzdGF0ZS5zZXNzaW9uLnhzcmZUb2tlbik7XHJcbiAgICAgICAgY29uc29sZS5sb2cocmVzcG9uc2UpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBSRURVQ0VSIC0gRm9yIGEgZ2l2ZW4gc3RhdGUgYW5kIGFjdGlvbiwgcmV0dXJucyB0aGUgbmV3IHN0YXRlLiBUbyBzdXBwb3J0IHRpbWUgdHJhdmVsLCB0aGlzIG11c3Qgbm90IG11dGF0ZSB0aGUgb2xkIHN0YXRlLlxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXI6IFJlZHVjZXI8Q291bnRlclN0YXRlPiA9IChzdGF0ZTogQ291bnRlclN0YXRlLCBhY3Rpb246IEtub3duQWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBSRVFVRVNUX0NPVU5URVI6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0cmFuc2l0aW9uaW5nOiB0cnVlIH07XHJcbiAgICAgICAgY2FzZSBSRUNFSVZFX0NPVU5URVI6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLkRlZmF1bHRDb3VudGVyU3RhdGUsIC4uLmFjdGlvbi5wYXlsb2FkIH07XHJcbiAgICAgICAgY2FzZSBTZXJ2ZXIuSU5DUkVNRU5UX0NPVU5URVI6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgKyAxIH07XHJcbiAgICAgICAgY2FzZSBTZXJ2ZXIuREVDUkVNRU5UX0NPVU5URVI6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCBjb3VudDogc3RhdGUuY291bnQgLSAxIH07XHJcbiAgICAgICAgY2FzZSBTZXJ2ZXIuU1RBUlRfQ09VTlRFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRyYW5zaXRpb25pbmc6IHRydWUgfTtcclxuICAgICAgICBjYXNlIFNlcnZlci5DT1VOVEVSX1NUQVJURUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0cmFuc2l0aW9uaW5nOiBmYWxzZSwgc3RhcnRlZDogdHJ1ZSB9O1xyXG4gICAgICAgIGNhc2UgU2VydmVyLlNUT1BfQ09VTlRFUjpcclxuICAgICAgICAgICAgcmV0dXJuIHsgLi4uc3RhdGUsIHRyYW5zaXRpb25pbmc6IHRydWUgfTtcclxuICAgICAgICBjYXNlIFNlcnZlci5DT1VOVEVSX1NUT1BQRUQ6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLnN0YXRlLCB0cmFuc2l0aW9uaW5nOiBmYWxzZSwgc3RhcnRlZDogZmFsc2UgfTtcclxuICAgICAgICBjYXNlIFNlcnZlci5TWU5DX0NPVU5URVJfU1RBVEU6XHJcbiAgICAgICAgICAgIHJldHVybiB7IC4uLmFjdGlvbi5wYXlsb2FkLmNvdW50ZXJTdGF0ZSwgdHJhbnNpdGlvbmluZzogZmFsc2UgfTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGxpbmUgZ3VhcmFudGVlcyB0aGF0IGV2ZXJ5IGFjdGlvbiBpbiB0aGUgS25vd25BY3Rpb24gdW5pb24gaGFzIGJlZW4gY292ZXJlZCBieSBhIGNhc2UgYWJvdmVcclxuICAgICAgICAgICAgY29uc3QgZXhoYXVzdGl2ZUNoZWNrOiBuZXZlciA9IGFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICAvLyBGb3IgdW5yZWNvZ25pemVkIGFjdGlvbnMgKG9yIGluIGNhc2VzIHdoZXJlIGFjdGlvbnMgaGF2ZSBubyBlZmZlY3QpLCBtdXN0IHJldHVybiB0aGUgZXhpc3Rpbmcgc3RhdGVcclxuICAgIC8vICAob3IgZGVmYXVsdCBpbml0aWFsIHN0YXRlIGlmIG5vbmUgd2FzIHN1cHBsaWVkKVxyXG4gICAgcmV0dXJuIHN0YXRlIHx8IERlZmF1bHRDb3VudGVyU3RhdGU7XHJcbn07XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9zdG9yZS9Db3VudGVyLnRzIiwiaW1wb3J0IHsgZmV0Y2ggfSBmcm9tICdkb21haW4tdGFzayc7XHJcbmltcG9ydCB7IEFjdGlvbiwgUmVkdWNlciwgQWN0aW9uQ3JlYXRvciB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgQXBwVGh1bmtBY3Rpb24gfSBmcm9tICcuLyc7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBTVEFURSAtIFRoaXMgZGVmaW5lcyB0aGUgdHlwZSBvZiBkYXRhIG1haW50YWluZWQgaW4gdGhlIFJlZHV4IHN0b3JlLlxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBGb290ZXJTdGF0ZSB7XHJcbiAgICBpc1N1Ym1pdHRpbmc6IGJvb2xlYW47XHJcbiAgICBzdWJtaXR0ZWQ6IGJvb2xlYW47XHJcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEVtYWlsRm9ybSB7XHJcbiAgICBlbWFpbDogc3RyaW5nO1xyXG59XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBBQ1RJT05TIC0gVGhlc2UgYXJlIHNlcmlhbGl6YWJsZSAoaGVuY2UgcmVwbGF5YWJsZSkgZGVzY3JpcHRpb25zIG9mIHN0YXRlIHRyYW5zaXRpb25zLlxyXG4vLyBUaGV5IGRvIG5vdCB0aGVtc2VsdmVzIGhhdmUgYW55IHNpZGUtZWZmZWN0czsgdGhleSBqdXN0IGRlc2NyaWJlIHNvbWV0aGluZyB0aGF0IGlzIGdvaW5nIHRvIGhhcHBlbi5cclxuXHJcbmludGVyZmFjZSBTdWJtaXRFbWFpbEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnU1VCTUlUX0VNQUlMJ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgRW1haWxTdWJtaXR0ZWRBY3Rpb24ge1xyXG4gICAgdHlwZTogJ0VNQUlMX1NVQk1JVFRFRCcsXHJcbiAgICBtZXNzYWdlOiBzdHJpbmc7XHJcbn1cclxuXHJcbi8vIERlY2xhcmUgYSAnZGlzY3JpbWluYXRlZCB1bmlvbicgdHlwZS4gVGhpcyBndWFyYW50ZWVzIHRoYXQgYWxsIHJlZmVyZW5jZXMgdG8gJ3R5cGUnIHByb3BlcnRpZXMgY29udGFpbiBvbmUgb2YgdGhlXHJcbi8vIGRlY2xhcmVkIHR5cGUgc3RyaW5ncyAoYW5kIG5vdCBhbnkgb3RoZXIgYXJiaXRyYXJ5IHN0cmluZykuXHJcbnR5cGUgS25vd25BY3Rpb24gPSBTdWJtaXRFbWFpbEFjdGlvbiB8IEVtYWlsU3VibWl0dGVkQWN0aW9uO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBBQ1RJT04gQ1JFQVRPUlMgLSBUaGVzZSBhcmUgZnVuY3Rpb25zIGV4cG9zZWQgdG8gVUkgY29tcG9uZW50cyB0aGF0IHdpbGwgdHJpZ2dlciBhIHN0YXRlIHRyYW5zaXRpb24uXHJcbi8vIFRoZXkgZG9uJ3QgZGlyZWN0bHkgbXV0YXRlIHN0YXRlLCBidXQgdGhleSBjYW4gaGF2ZSBleHRlcm5hbCBzaWRlLWVmZmVjdHMgKHN1Y2ggYXMgbG9hZGluZyBkYXRhKS5cclxuXHJcbmV4cG9ydCBjb25zdCBhY3Rpb25DcmVhdG9ycyA9IHtcclxuXHJcbiAgICBzdWJtaXRFbWFpbDogKGZvcm06IEVtYWlsRm9ybSk6IEFwcFRodW5rQWN0aW9uPEtub3duQWN0aW9uPiA9PiBhc3luYyAoZGlzcGF0Y2gsIGdldFN0YXRlKSA9PiB7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiAnU1VCTUlUX0VNQUlMJyB9KTtcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL3N1YnNjcmliZScsIHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIGJvZHk6ICdlbWFpbD0nICsgZm9ybS5lbWFpbCxcclxuICAgICAgICAgICAgaGVhZGVyczogbmV3IEhlYWRlcnMoe1xyXG4gICAgICAgICAgICAgICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgbGV0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XHJcbiAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiAnRU1BSUxfU1VCTUlUVEVEJywgbWVzc2FnZTogZGF0YS5tZXNzYWdlIH0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBSRURVQ0VSIC0gRm9yIGEgZ2l2ZW4gc3RhdGUgYW5kIGFjdGlvbiwgcmV0dXJucyB0aGUgbmV3IHN0YXRlLiBUbyBzdXBwb3J0IHRpbWUgdHJhdmVsLCB0aGlzIG11c3Qgbm90IG11dGF0ZSB0aGUgb2xkIHN0YXRlLlxyXG5cclxuY29uc3QgdW5sb2FkZWRTdGF0ZTogRm9vdGVyU3RhdGUgPSB7IGlzU3VibWl0dGluZzogZmFsc2UsIHN1Ym1pdHRlZDogZmFsc2UgfTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWR1Y2VyOiBSZWR1Y2VyPEZvb3RlclN0YXRlPiA9IChzdGF0ZTogRm9vdGVyU3RhdGUsIGFjdGlvbjogS25vd25BY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdTVUJNSVRfRU1BSUwnOlxyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaXNTdWJtaXR0aW5nOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgc3VibWl0dGVkOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIGNhc2UgJ0VNQUlMX1NVQk1JVFRFRCc6XHJcbiAgICAgICAgICAgIC8vIE9ubHkgYWNjZXB0IHRoZSBpbmNvbWluZyBkYXRhIGlmIGl0IG1hdGNoZXMgdGhlIG1vc3QgcmVjZW50IHJlcXVlc3QuIFRoaXMgZW5zdXJlcyB3ZSBjb3JyZWN0bHlcclxuICAgICAgICAgICAgLy8gaGFuZGxlIG91dC1vZi1vcmRlciByZXNwb25zZXMuXHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBpc1N1Ym1pdHRpbmc6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc3VibWl0dGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogYWN0aW9uLm1lc3NhZ2VcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGxpbmUgZ3VhcmFudGVlcyB0aGF0IGV2ZXJ5IGFjdGlvbiBpbiB0aGUgS25vd25BY3Rpb24gdW5pb24gaGFzIGJlZW4gY292ZXJlZCBieSBhIGNhc2UgYWJvdmVcclxuICAgICAgICAgICAgY29uc3QgZXhoYXVzdGl2ZUNoZWNrOiBuZXZlciA9IGFjdGlvbjtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc3RhdGUgfHwgdW5sb2FkZWRTdGF0ZTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL3N0b3JlL0Zvb3Rlci50cyIsImltcG9ydCB7IGZldGNoIH0gZnJvbSAnZG9tYWluLXRhc2snO1xyXG5pbXBvcnQgeyBBY3Rpb24sIFJlZHVjZXIsIEFjdGlvbkNyZWF0b3IgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB7IEFwcFRodW5rQWN0aW9uIH0gZnJvbSAnLi8nO1xyXG5pbXBvcnQgeyBSZWdpc3RlclZpZXdNb2RlbCB9IGZyb20gJy4uL3NlcnZlci9SZWdpc3RlclZpZXdNb2RlbCc7XHJcbmltcG9ydCAqIGFzIFNlcnZlciBmcm9tICcuLi9zZXJ2ZXIvVXNlcic7XHJcbmltcG9ydCB7IGJyb3dzZXJIaXN0b3J5IH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgTE9HSU5fU1VDQ0VTUywgTG9naW5TdWNjZXNzQWN0aW9uIH0gZnJvbSAnLi9Mb2dpbic7XHJcblxyXG5leHBvcnQgY29uc3QgUkVHSVNURVJfUkVRVUVTVCA9ICdSZWdpc3RlclJlcXVlc3RBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgUkVHSVNURVJfU1VDQ0VTUyA9ICdSZWdpc3RlclN1Y2Nlc3NBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgUkVHSVNURVJfRVJST1IgPSAnUmVnaXN0ZXJFcnJvckFjdGlvbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlZ2lzdGVyU3RhdGUge1xyXG4gICAgcmVxdWVzdGluZzogYm9vbGVhbjtcclxuICAgIHJlZ2lzdGVyZWQ6IGJvb2xlYW47XHJcbiAgICBlcnJvcnM6IGFueTtcclxufVxyXG5cclxuY29uc3QgRGVmYXVsdFJlZ2lzdGVyU3RhdGU6IFJlZ2lzdGVyU3RhdGUgPSB7XHJcbiAgICByZXF1ZXN0aW5nOiBmYWxzZSxcclxuICAgIHJlZ2lzdGVyZWQ6IGZhbHNlLFxyXG4gICAgZXJyb3JzOiB7fVxyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVnaXN0ZXJSZXF1ZXN0QWN0aW9uIHtcclxuICAgIHR5cGU6ICdSZWdpc3RlclJlcXVlc3RBY3Rpb24nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgUmVnaXN0ZXJFcnJvckFjdGlvbiB7XHJcbiAgICB0eXBlOiAnUmVnaXN0ZXJFcnJvckFjdGlvbic7XHJcbn1cclxuXHJcbmludGVyZmFjZSBSZWdpc3RlclN1Y2Nlc3NBY3Rpb24ge1xyXG4gICAgdHlwZTogJ1JlZ2lzdGVyU3VjY2Vzc0FjdGlvbic7XHJcbiAgICBwYXlsb2FkOiBSZWdpc3RlclZpZXdNb2RlbDtcclxufVxyXG5cclxuLy8gVE9ETyBpbXBvcnQgU3VjY2VzcyBhbmQgSW52YWxpZCBhY3Rpb25zIGZyb20gc2VydmVyIGFuZCBoYW5kbGUgdGhlbVxyXG50eXBlIEtub3duQWN0aW9uID0gUmVnaXN0ZXJSZXF1ZXN0QWN0aW9uIHwgUmVnaXN0ZXJFcnJvckFjdGlvbiB8IFJlZ2lzdGVyU3VjY2Vzc0FjdGlvbiB8IExvZ2luU3VjY2Vzc0FjdGlvbjtcclxuXHJcbmV4cG9ydCBjb25zdCBhY3Rpb25DcmVhdG9ycyA9IHtcclxuXHJcbiAgICByZWdpc3RlcjogKHJlZ2lzdGVyTW9kZWw6IFJlZ2lzdGVyVmlld01vZGVsKTogQXBwVGh1bmtBY3Rpb248S25vd25BY3Rpb24+ID0+IGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICBkaXNwYXRjaCh7IHR5cGU6IFJFR0lTVEVSX1JFUVVFU1QgfSk7XHJcbiAgICAgICAgbGV0IHhzcmYgPSBnZXRTdGF0ZSgpLnNlc3Npb24ueHNyZlRva2VuO1xyXG4gICAgICAgIGxldCByZXNwb25zZSA9IDxSZXNwb25zZT5hd2FpdCBmZXRjaCgnL2FjY291bnQvcmVnaXN0ZXInLCB7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBjcmVkZW50aWFsczogJ2luY2x1ZGUnLFxyXG4gICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAnQ29udGVudC1UeXBlJzogJ2FwcGxpY2F0aW9uL2pzb24nLFxyXG4gICAgICAgICAgICAgICAgJ1gtWFNSRi1UT0tFTic6IHhzcmZcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocmVnaXN0ZXJNb2RlbClcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XHJcbiAgICAgICAgICAgIGRpc3BhdGNoKHsgdHlwZTogUkVHSVNURVJfU1VDQ0VTUywgcGF5bG9hZDogcmVnaXN0ZXJNb2RlbCB9KTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBMT0dJTl9TVUNDRVNTIH0pO1xyXG4gICAgICAgICAgICBicm93c2VySGlzdG9yeS5wdXNoKCcvJyk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiBSRUdJU1RFUl9FUlJPUiB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdyZWdpc3RlciByZXN1bHQnLCByZXNwb25zZSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXI6IFJlZHVjZXI8UmVnaXN0ZXJTdGF0ZT4gPSAoc3RhdGU6IFJlZ2lzdGVyU3RhdGUsIGFjdGlvbjogS25vd25BY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlIFJFR0lTVEVSX1JFUVVFU1Q6XHJcbiAgICAgICAgICAgIHJldHVybiB7IHJlcXVlc3Rpbmc6IHRydWUsIHJlZ2lzdGVyZWQ6IGZhbHNlLCBlcnJvcnM6IHt9IH07XHJcbiAgICAgICAgY2FzZSBSRUdJU1RFUl9FUlJPUjpcclxuICAgICAgICAgICAgcmV0dXJuIHsgcmVxdWVzdGluZzogZmFsc2UsIHJlZ2lzdGVyZWQ6IGZhbHNlLCBlcnJvcnM6IHt9IH07XHJcbiAgICAgICAgY2FzZSBSRUdJU1RFUl9TVUNDRVNTOlxyXG4gICAgICAgICAgICByZXR1cm4geyByZXF1ZXN0aW5nOiBmYWxzZSwgcmVnaXN0ZXJlZDogZmFsc2UsIGVycm9yczoge30gfTtcclxuICAgICAgICBjYXNlIExPR0lOX1NVQ0NFU1M6XHJcbiAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zdCBleGhhdXN0aXZlQ2hlY2s6IG5ldmVyID0gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBzdGF0ZSB8fCBEZWZhdWx0UmVnaXN0ZXJTdGF0ZTtcclxufTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL3N0b3JlL1JlZ2lzdGVyLnRzIiwiaW1wb3J0IHsgUmVkdWNlciwgQWN0aW9uQ3JlYXRvciB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgQXBwVGh1bmtBY3Rpb24gfSBmcm9tICcuLyc7XHJcbmltcG9ydCBDb29raWVzIGZyb20gJ2pzLWNvb2tpZSc7XHJcblxyXG4vLyAtLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBTVEFURSAtIFRoaXMgZGVmaW5lcyB0aGUgdHlwZSBvZiBkYXRhIG1haW50YWluZWQgaW4gdGhlIFJlZHV4IHN0b3JlLlxyXG5cclxuZnVuY3Rpb24gZ3VpZCgpIHtcclxuICAgIHJldHVybiAneHh4eHh4eHgteHh4eC00eHh4LXl4eHgteHh4eHh4eHh4eHh4Jy5yZXBsYWNlKC9beHldL2csIGZ1bmN0aW9uIChjKSB7XHJcbiAgICAgICAgdmFyIHIgPSBNYXRoLnJhbmRvbSgpICogMTYgfCAwLCB2ID0gYyA9PSAneCcgPyByIDogKHIgJiAweDMgfCAweDgpO1xyXG4gICAgICAgIHJldHVybiB2LnRvU3RyaW5nKDE2KTtcclxuICAgIH0pO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgSU5JVF9TRVNTSU9OID0gJ0luaXRDb25maWdBY3Rpb24nXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFNldHRpbmdzU3RhdGUge1xyXG4gICAgaWQ6IHN0cmluZztcclxuICAgIHhzcmZUb2tlbjogc3RyaW5nO1xyXG59XHJcblxyXG5pbnRlcmZhY2UgSW5pdENvbmZpZ0FjdGlvbiB7XHJcbiAgICB0eXBlOiAnSW5pdENvbmZpZ0FjdGlvbidcclxuICAgIHBheWxvYWQ6IFNldHRpbmdzU3RhdGVcclxufVxyXG4vL2ludGVyZmFjZSBDb25maWdBY3Rpb24yIHtcclxuLy8gICAgdHlwZTogJ0lOSVRfQ09ORklHMidcclxuLy8gICAgcGF5bG9hZDogU2V0dGluZ3NTdGF0ZVxyXG4vL31cclxuXHJcbnR5cGUgS25vd25BY3Rpb24gPSBJbml0Q29uZmlnQWN0aW9uO1xyXG5cclxuLy8gLS0tLS0tLS0tLS0tLS0tLVxyXG4vLyBBQ1RJT04gQ1JFQVRPUlMgLSBUaGVzZSBhcmUgZnVuY3Rpb25zIGV4cG9zZWQgdG8gVUkgY29tcG9uZW50cyB0aGF0IHdpbGwgdHJpZ2dlciBhIHN0YXRlIHRyYW5zaXRpb24uXHJcbi8vIFRoZXkgZG9uJ3QgZGlyZWN0bHkgbXV0YXRlIHN0YXRlLCBidXQgdGhleSBjYW4gaGF2ZSBleHRlcm5hbCBzaWRlLWVmZmVjdHMgKHN1Y2ggYXMgbG9hZGluZyBkYXRhKS5cclxuXHJcbmV4cG9ydCBjb25zdCBhY3Rpb25DcmVhdG9ycyA9IHtcclxuXHJcbiAgICBpbml0aWFsaXplOiAoc2V0dGluZ3M/OiBTZXR0aW5nc1N0YXRlKTogQXBwVGh1bmtBY3Rpb248S25vd25BY3Rpb24+ID0+IGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuICAgICAgICAvLyB2YXIgc2F2ZWQgPSBDb29raWVzLmdldEpTT04oJ3NldHRpbmdzJyk7XHJcbiAgICAgICAgdmFyIHhzcmZUb2tlbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd4c3JmLXRva2VuJykuZGF0YXNldFsneHNyZlRva2VuJ107XHJcbiAgICAgICAgdmFyIGlkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Nlc3Npb24nKS5kYXRhc2V0WydpZCddO1xyXG4gICAgICAgIGRpc3BhdGNoKHsgdHlwZTogSU5JVF9TRVNTSU9OLCBwYXlsb2FkOiBzZXR0aW5ncyB8fCB7IHhzcmZUb2tlbjogeHNyZlRva2VuLCBpZDogaWQgfSB9KTtcclxuICAgICAgICAvLyBDb29raWVzLnNldCgnc2V0dGluZ3MnLCBnZXRTdGF0ZSgpLnNldHRpbmdzLCB7IGV4cGlyZXM6IDM2NSB9KTtcclxuICAgIH1cclxufTtcclxuXHJcbi8vIC0tLS0tLS0tLS0tLS0tLS1cclxuLy8gUkVEVUNFUiAtIEZvciBhIGdpdmVuIHN0YXRlIGFuZCBhY3Rpb24sIHJldHVybnMgdGhlIG5ldyBzdGF0ZS4gVG8gc3VwcG9ydCB0aW1lIHRyYXZlbCwgdGhpcyBtdXN0IG5vdCBtdXRhdGUgdGhlIG9sZCBzdGF0ZS5cclxuXHJcbmNvbnN0IERlZmF1bHRTZXR0aW5nczogU2V0dGluZ3NTdGF0ZSA9IHsgeHNyZlRva2VuOiB1bmRlZmluZWQsIGlkOiB1bmRlZmluZWQgfTtcclxuXHJcbmV4cG9ydCBjb25zdCByZWR1Y2VyOiBSZWR1Y2VyPFNldHRpbmdzU3RhdGU+ID0gKHN0YXRlOiBTZXR0aW5nc1N0YXRlLCBhY3Rpb246IEtub3duQWN0aW9uKSA9PiB7XHJcbiAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgY2FzZSBJTklUX1NFU1NJT046XHJcbiAgICAgICAgICAgIHJldHVybiBhY3Rpb24ucGF5bG9hZDtcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAvLyBUaGUgZm9sbG93aW5nIGxpbmUgZ3VhcmFudGVlcyB0aGF0IGV2ZXJ5IGFjdGlvbiBpbiB0aGUgS25vd25BY3Rpb24gdW5pb24gaGFzIGJlZW4gY292ZXJlZCBieSBhIGNhc2UgYWJvdmVcclxuICAgICAgICAgICAgLy8gY29uc3QgZXhoYXVzdGl2ZUNoZWNrOiBuZXZlciA9IGFjdGlvbjtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gc3RhdGUgfHwgRGVmYXVsdFNldHRpbmdzO1xyXG59O1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvc3RvcmUvU2Vzc2lvbi50cyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgUHJvdmlkZXIgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IHJlbmRlclRvU3RyaW5nIH0gZnJvbSAncmVhY3QtZG9tL3NlcnZlcic7XHJcbi8vIGltcG9ydCB7IHJlbmRlciBhcyByZW5kZXJUb1N0cmluZyB9IGZyb20gJ3ByZWFjdC1yZW5kZXItdG8tc3RyaW5nJztcclxuaW1wb3J0IHsgbWF0Y2gsIFJvdXRlckNvbnRleHQgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xyXG5pbXBvcnQgY3JlYXRlTWVtb3J5SGlzdG9yeSBmcm9tICdoaXN0b3J5L2xpYi9jcmVhdGVNZW1vcnlIaXN0b3J5JztcclxuaW1wb3J0IHsgY3JlYXRlU2VydmVyUmVuZGVyZXIsIFJlbmRlclJlc3VsdCB9IGZyb20gJ2FzcG5ldC1wcmVyZW5kZXJpbmcnO1xyXG5pbXBvcnQgcm91dGVzIGZyb20gJy4vcm91dGVzJztcclxuaW1wb3J0IGNvbmZpZ3VyZVN0b3JlIGZyb20gJy4vY29uZmlndXJlU3RvcmUnO1xyXG5pbXBvcnQgeyBHRVRVU0VSX1JFQ0VJVkVEIH0gZnJvbSAnLi9zdG9yZS9Vc2VyJztcclxuaW1wb3J0IHsgTE9HSU5fU1VDQ0VTUyB9IGZyb20gJy4vc3RvcmUvTG9naW4nO1xyXG5pbXBvcnQgeyBUT0tFTl9SRUNFSVZFRCB9IGZyb20gJy4vc3RvcmUvQXV0aCc7XHJcbmltcG9ydCB7IElOSVRfU0VTU0lPTiB9IGZyb20gJy4vc3RvcmUvU2Vzc2lvbic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjcmVhdGVTZXJ2ZXJSZW5kZXJlcihwYXJhbXMgPT4ge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPFJlbmRlclJlc3VsdD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgIC8vIE1hdGNoIHRoZSBpbmNvbWluZyByZXF1ZXN0IGFnYWluc3QgdGhlIGxpc3Qgb2YgY2xpZW50LXNpZGUgcm91dGVzXHJcbiAgICAgICAgbWF0Y2goeyByb3V0ZXMsIGxvY2F0aW9uOiBwYXJhbXMubG9jYXRpb24gfSwgKGVycm9yLCByZWRpcmVjdExvY2F0aW9uLCByZW5kZXJQcm9wczogYW55KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlJ3MgYSByZWRpcmVjdGlvbiwganVzdCBzZW5kIHRoaXMgaW5mb3JtYXRpb24gYmFjayB0byB0aGUgaG9zdCBhcHBsaWNhdGlvblxyXG4gICAgICAgICAgICBpZiAocmVkaXJlY3RMb2NhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgcmVzb2x2ZSh7IHJlZGlyZWN0VXJsOiByZWRpcmVjdExvY2F0aW9uLnBhdGhuYW1lIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiBpdCBkaWRuJ3QgbWF0Y2ggYW55IHJvdXRlLCByZW5kZXJQcm9wcyB3aWxsIGJlIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICBpZiAoIXJlbmRlclByb3BzKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBsb2NhdGlvbiAnJHsgcGFyYW1zLnVybCB9JyBkb2Vzbid0IG1hdGNoIGFueSByb3V0ZSBjb25maWd1cmVkIGluIHJlYWN0LXJvdXRlci5gKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQnVpbGQgYW4gaW5zdGFuY2Ugb2YgdGhlIGFwcGxpY2F0aW9uXHJcbiAgICAgICAgICAgIGNvbnN0IHN0b3JlID0gY29uZmlndXJlU3RvcmUoKTtcclxuICAgICAgICAgICAgc3RvcmUuZGlzcGF0Y2goeyB0eXBlOiBJTklUX1NFU1NJT04sIHBheWxvYWQ6IHsgeHNyZlRva2VuOiBwYXJhbXMuZGF0YS54c3JmVG9rZW4sIGlkOiBwYXJhbXMuZGF0YS5zZXNzaW9uSWQgfSB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmIChwYXJhbXMuZGF0YS5pc0F1dGhlbnRpY2F0ZWQpIHtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogTE9HSU5fU1VDQ0VTUyB9KTtcclxuICAgICAgICAgICAgICAgIHN0b3JlLmRpc3BhdGNoKHsgdHlwZTogVE9LRU5fUkVDRUlWRUQsIHBheWxvYWQ6IHsgYWNjZXNzVG9rZW46IHBhcmFtcy5kYXRhLmFjY2Vzc1Rva2VuIH0gfSk7XHJcbiAgICAgICAgICAgICAgICBzdG9yZS5kaXNwYXRjaCh7IHR5cGU6IEdFVFVTRVJfUkVDRUlWRUQsIHBheWxvYWQ6IHBhcmFtcy5kYXRhLnVzZXJNb2RlbCB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgY29uc3QgYXBwID0gKFxyXG4gICAgICAgICAgICAgICAgPFByb3ZpZGVyIHN0b3JlPXsgc3RvcmUgfT5cclxuICAgICAgICAgICAgICAgICAgICA8Um91dGVyQ29udGV4dCB7Li4ucmVuZGVyUHJvcHN9IC8+XHJcbiAgICAgICAgICAgICAgICA8L1Byb3ZpZGVyPlxyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gUGVyZm9ybSBhbiBpbml0aWFsIHJlbmRlciB0aGF0IHdpbGwgY2F1c2UgYW55IGFzeW5jIHRhc2tzIChlLmcuLCBkYXRhIGFjY2VzcykgdG8gYmVnaW5cclxuICAgICAgICAgICAgcmVuZGVyVG9TdHJpbmcoYXBwKTtcclxuXHJcbiAgICAgICAgICAgIC8vIE9uY2UgdGhlIHRhc2tzIGFyZSBkb25lLCB3ZSBjYW4gcGVyZm9ybSB0aGUgZmluYWwgcmVuZGVyXHJcbiAgICAgICAgICAgIC8vIFdlIGFsc28gc2VuZCB0aGUgcmVkdXggc3RvcmUgc3RhdGUsIHNvIHRoZSBjbGllbnQgY2FuIGNvbnRpbnVlIGV4ZWN1dGlvbiB3aGVyZSB0aGUgc2VydmVyIGxlZnQgb2ZmXHJcbiAgICAgICAgICAgIHBhcmFtcy5kb21haW5UYXNrcy50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJlc29sdmUoe1xyXG4gICAgICAgICAgICAgICAgICAgIGh0bWw6IHJlbmRlclRvU3RyaW5nKGFwcCksXHJcbiAgICAgICAgICAgICAgICAgICAgZ2xvYmFsczogeyBpbml0aWFsUmVkdXhTdGF0ZTogc3RvcmUuZ2V0U3RhdGUoKSB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSwgcmVqZWN0KTsgLy8gQWxzbyBwcm9wYWdhdGUgYW55IGVycm9ycyBiYWNrIGludG8gdGhlIGhvc3QgYXBwbGljYXRpb25cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2Jvb3Qtc2VydmVyLnRzeCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJhYmVsLXBvbHlmaWxsXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwiYmFiZWwtcG9seWZpbGxcIlxuLy8gbW9kdWxlIGlkID0gMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBhdXRvYmluZCB9IGZyb20gJ2NvcmUtZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEdyaWQsIFJvdywgQ29sLCBXZWxsLCBQYW5lbCwgUGFuZWxHcm91cCwgQnV0dG9uLCBGb3JtR3JvdXAsIEZvcm0sIENvbnRyb2xMYWJlbCwgRm9ybUNvbnRyb2wsIEhlbHBCbG9jayB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCc7XHJcbmltcG9ydCB7IEFwcGxpY2F0aW9uU3RhdGUgfSBmcm9tICcuLi9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIENvbnRhY3RTdG9yZSBmcm9tICcuLi9zdG9yZS9Db250YWN0JztcclxuXHJcblxyXG50eXBlIENvbnRhY3RQcm9wcyA9IENvbnRhY3RTdG9yZS5Db250YWN0U3RhdGUgJiB0eXBlb2YgQ29udGFjdFN0b3JlLmFjdGlvbkNyZWF0b3JzO1xyXG5cclxuY29uc3QgaW5pdGlhbEZvcm06IENvbnRhY3RTdG9yZS5Db250YWN0Rm9ybSA9IHtcclxuICAgIGZpcnN0TmFtZTogJycsXHJcbiAgICBsYXN0TmFtZTogJycsXHJcbiAgICBlbWFpbDogJycsXHJcbiAgICBwaG9uZTogJycsXHJcbiAgICBtZXNzYWdlOiAnJ1xyXG59XHJcblxyXG5jbGFzcyBDb250YWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PENvbnRhY3RQcm9wcywgQ29udGFjdFN0b3JlLkNvbnRhY3RGb3JtPiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJvcHM6IENvbnRhY3RQcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyAuLi5pbml0aWFsRm9ybSwgLi4ucHJvcHMuZm9ybSB9O1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzKG5leHRQcm9wczogQ29udGFjdFByb3BzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuc3RhdGUgIT09IG5leHRQcm9wcy5mb3JtKVxyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKG5leHRQcm9wcy5mb3JtKVxyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgaGFuZGxlQ2hhbmdlKGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBbZS50YXJnZXQubmFtZV06IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgc3VibWl0KGV2ZW50OiBSZWFjdC5Gb3JtRXZlbnQ8Rm9ybT4pIHtcclxuICAgICAgICB0aGlzLnByb3BzLnN1Ym1pdENvbnRhY3RGb3JtKHRoaXMuc3RhdGUpO1xyXG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPEdyaWQ+XHJcbiAgICAgICAgICAgIDxoMT5Db250YWN0IHVzPC9oMT5cclxuICAgICAgICAgICAgPFJvdyBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIDxDb2wgbWQ9ezZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxXZWxsIGJzU2l6ZT1cInNtXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtIGhvcml6b250YWwgb25TdWJtaXQ9e3RoaXMuc3VibWl0fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxmaWVsZHNldD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGVnZW5kIGNsYXNzTmFtZT1cInRleHQtY2VudGVyIGhlYWRlclwiPkNvbnRhY3Q8L2xlZ2VuZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIG1kPXsxMH0gbWRPZmZzZXQ9ezF9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIG5hbWU9XCJmaXJzdE5hbWVcIiB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGUuZmlyc3ROYW1lfSBwbGFjZWhvbGRlcj1cIkZpcnN0IG5hbWVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIG1kPXsxMH0gbWRPZmZzZXQ9ezF9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIG5hbWU9XCJsYXN0TmFtZVwiIHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSB2YWx1ZT17dGhpcy5zdGF0ZS5sYXN0TmFtZX0gcGxhY2Vob2xkZXI9XCJMYXN0IG5hbWVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBtZD17MTB9IG1kT2Zmc2V0PXsxfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbCBuYW1lPVwiZW1haWxcIiB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGUuZW1haWx9IHBsYWNlaG9sZGVyPVwiRW1haWxcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBtZD17MTB9IG1kT2Zmc2V0PXsxfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbCBuYW1lPVwicGhvbmVcIiB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gdmFsdWU9e3RoaXMuc3RhdGUucGhvbmV9IHBsYWNlaG9sZGVyPVwiUGhvbmVcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Hcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPENvbCBtZD17MTB9IG1kT2Zmc2V0PXsxfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbCBjb21wb25lbnRDbGFzcz1cInRleHRhcmVhXCIgbmFtZT1cIm1lc3NhZ2VcIiByb3dzPXs3fSBvbkNoYW5nZT17dGhpcy5oYW5kbGVDaGFuZ2V9IHZhbHVlPXt0aGlzLnByb3BzLmZvcm0ubWVzc2FnZX0gcGxhY2Vob2xkZXI9XCJFbnRlciBhIG1lc3NhZ2UgaGVyZS4gV2UnbGwgZ2V0IGJhY2sgdG8geW91IHdpdGhpbiB0d28gYnVzaW5lc3MgZGF5c1wiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Q29sIG1kPXsxMX0gY2xhc3NOYW1lPVwidGV4dC1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gdHlwZT1cInN1Ym1pdFwiIGJzU2l6ZT1cImxnXCIgYnNTdHlsZT1cInByaW1hcnlcIiBkaXNhYmxlZD17dGhpcy5wcm9wcy5pc1N1Ym1pdHRpbmd9Pnt0aGlzLnByb3BzLmlzU3VibWl0dGluZyA/IFwiU3Bpbm5lclwiIDogXCJTZW5kXCJ9PC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxociAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxDb2wgbWQ9ezExfSBjbGFzc05hbWU9XCJ0ZXh0LWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sLlN0YXRpYz57dGhpcy5wcm9wcy5zdWJtaXR0ZWQgPyB0aGlzLnByb3BzLnJlc3VsdCA6IFwiXCJ9PC9Gb3JtQ29udHJvbC5TdGF0aWM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZmllbGRzZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybT5cclxuICAgICAgICAgICAgICAgICAgICA8L1dlbGw+XHJcbiAgICAgICAgICAgICAgICA8L0NvbD5cclxuICAgICAgICAgICAgICAgIDxDb2wgbWQ9ezZ9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxQYW5lbCBoZWFkZXI9e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+QWRyZXM8L2gzPn0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwidGV4dC1jZW50ZXIgaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFN0cmVldCBhZGRyZXNzPGJyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2l0eTxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIENvdW50cnk8YnIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBFbWFpbDxiciAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aHIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJtYXAxXCIgY2xhc3NOYW1lPVwibWFwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cImh0dHBzOi8vd3d3Lmdvb2dsZS5ubC9tYXBzL2Rpci8vWW91ciUwMjBBZGRyZXNzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiaW1nLXJlc3BvbnNpdmVcIiBzcmM9Jy9pbWFnZXMvTWFwLnBuZycgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9QYW5lbD5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICA8L1Jvdz5cclxuICAgICAgICAgICAgPGgyPlRoaXMgZGVtbyB3YXMgYnVpbHQgYnk8L2gyPlxyXG4gICAgICAgICAgICA8aDQ+TWFhcnRlbiBTaWtrZW1hPC9oND5cclxuICAgICAgICA8L0dyaWQ+XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiBzdGF0ZS5jb250YWN0LCAvLyBTZWxlY3RzIHdoaWNoIHN0YXRlIHByb3BlcnRpZXMgYXJlIG1lcmdlZCBpbnRvIHRoZSBjb21wb25lbnQncyBwcm9wc1xyXG4gICAgQ29udGFjdFN0b3JlLmFjdGlvbkNyZWF0b3JzICAgICAgICAgICAgICAgICAvLyBTZWxlY3RzIHdoaWNoIGFjdGlvbiBjcmVhdG9ycyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbikoQ29udGFjdCk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb21wb25lbnRzL0NvbnRhY3QudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgQXBwbGljYXRpb25TdGF0ZSB9ICBmcm9tICcuLi9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIENvdW50ZXJTdG9yZSBmcm9tICcuLi9zdG9yZS9Db3VudGVyJztcclxuXHJcbnR5cGUgQ291bnRlclByb3BzID0gQ291bnRlclN0b3JlLkNvdW50ZXJTdGF0ZSAmIHR5cGVvZiBDb3VudGVyU3RvcmUuYWN0aW9uQ3JlYXRvcnM7XHJcblxyXG5jbGFzcyBDb3VudGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PENvdW50ZXJQcm9wcywgdm9pZD4ge1xyXG4gICAgY29tcG9uZW50V2lsbE1vdW50KCkge1xyXG4gICAgICAgIC8vIGZldGNoIGN1cnJlbnQgZGF0YSBmcm9tIHNlcnZlclxyXG4gICAgICAgIHRoaXMucHJvcHMucmVxdWVzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxkaXYgY2xhc3NOYW1lPVwiY29udGFpbmVyXCI+XHJcbiAgICAgICAgICAgIDxoMT5Db3VudGVyPC9oMT5cclxuXHJcbiAgICAgICAgICAgIDxwPlxyXG4gICAgICAgICAgICAgICAgVGhpcyBpcyBhbiBleGFtcGxlIG9mIGEgUmVhY3QgY29tcG9uZW50LiBJdCBpcyBjb25uZWN0ZWQgcmVhbC10aW1lIHRvIHRoZSBzZXJ2ZXI6IHN0YXJ0IHRoZSB0aW1lciB0byB2aWV3IHNlcnZlci1pbml0aWF0ZWQgdXBkYXRlcywgdXNlIFwiaW5jcmVtZW50XCIgdG8gY2hhbmdlIHRoZSB2YWx1ZSBjbGllbnRzaWRlLlxyXG4gICAgICAgICAgICAgICAgUmVmcmVzaCB0aGUgcGFnZSB0byBzZWUgdGhhdCB0aGUgdmFsdWUgaXMgYWxzbyByZW5kZXJlZCBzZXJ2ZXJzaWRlLlxyXG4gICAgICAgICAgICA8L3A+XHJcblxyXG4gICAgICAgICAgICA8cD5DdXJyZW50IGNvdW50OiA8c3Ryb25nPnsgdGhpcy5wcm9wcy5jb3VudCB9PC9zdHJvbmc+PC9wPlxyXG5cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJidG4gYnRuLWRlZmF1bHRcIiBvbkNsaWNrPXsoKSA9PiB7IHRoaXMucHJvcHMuaW5jcmVtZW50KCkgfX0+SW5jcmVtZW50PC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgb25DbGljaz17KCkgPT4geyB0aGlzLnByb3BzLmRlY3JlbWVudCgpIH19PkRlY3JlbWVudDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tZGVmYXVsdFwiIGRpc2FibGVkPXt0aGlzLnByb3BzLnN0YXJ0ZWR9IG9uQ2xpY2s9eygpID0+IHsgdGhpcy5wcm9wcy5zdGFydCgpIH19PlN0YXJ0PC9idXR0b24+XHJcbiAgICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGlzYWJsZWQ9eyF0aGlzLnByb3BzLnN0YXJ0ZWR9IG9uQ2xpY2s9eygpID0+IHsgdGhpcy5wcm9wcy5zdG9wKCkgfX0+U3RvcDwvYnV0dG9uPlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgIH1cclxufVxyXG5cclxuLy8gV2lyZSB1cCB0aGUgUmVhY3QgY29tcG9uZW50IHRvIHRoZSBSZWR1eCBzdG9yZVxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiBzdGF0ZS5jb3VudGVyLCAvLyBTZWxlY3RzIHdoaWNoIHN0YXRlIHByb3BlcnRpZXMgYXJlIG1lcmdlZCBpbnRvIHRoZSBjb21wb25lbnQncyBwcm9wc1xyXG4gICAgQ291bnRlclN0b3JlLmFjdGlvbkNyZWF0b3JzICAgICAgICAgICAgICAgICAvLyBTZWxlY3RzIHdoaWNoIGFjdGlvbiBjcmVhdG9ycyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbikoQ291bnRlcik7XHJcblxyXG4vLyBTZXQgdXAgSE1SIHJlLXJlbmRlcmluZy5cclxuaWYgKG1vZHVsZS5ob3QpIHtcclxuICBtb2R1bGUuaG90LmFjY2VwdCgpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb21wb25lbnRzL0NvdW50ZXIudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBjb25uZWN0IH0gZnJvbSAncmVhY3QtcmVkdXgnO1xyXG5pbXBvcnQgeyBhdXRvYmluZCB9IGZyb20gJ2NvcmUtZGVjb3JhdG9ycyc7XHJcbmltcG9ydCB7IEJ1dHRvbiwgRm9ybUdyb3VwLCBGb3JtLCBDb250cm9sTGFiZWwsIEZvcm1Db250cm9sLCBIZWxwQmxvY2sgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnO1xyXG5pbXBvcnQgeyBBcHBsaWNhdGlvblN0YXRlIH0gZnJvbSAnLi4vc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBGb290ZXJTdGF0ZSBmcm9tICcuLi9zdG9yZS9Gb290ZXInO1xyXG5cclxuXHJcbnR5cGUgRm9vdGVyUHJvcHMgPSBGb290ZXJTdGF0ZS5Gb290ZXJTdGF0ZSAmIHR5cGVvZiBGb290ZXJTdGF0ZS5hY3Rpb25DcmVhdG9ycztcclxuXHJcbmNsYXNzIEZvb3RlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxGb290ZXJQcm9wcywgRm9vdGVyU3RhdGUuRW1haWxGb3JtPiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBlbWFpbDogJydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGFuZGxlQ2hhbmdlID0gdGhpcy5oYW5kbGVDaGFuZ2UuYmluZCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGdldFZhbGlkYXRpb25TdGF0ZSgpOiBcInN1Y2Nlc3NcIiB8IFwid2FybmluZ1wiIHwgXCJlcnJvclwiIHtcclxuICAgICAgICB2YXIgZW1haWxSZWdleCA9IC9eW2EtekEtWjAtOS4hIyQlJicqKy89P15fYHt8fX4tXStAW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KD86XFwuW2EtekEtWjAtOV0oPzpbYS16QS1aMC05LV17MCw2MX1bYS16QS1aMC05XSk/KSokLztcclxuICAgICAgICByZXR1cm4gZW1haWxSZWdleC50ZXN0KHRoaXMuc3RhdGUuZW1haWwpID8gXCJzdWNjZXNzXCIgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgaGFuZGxlQ2hhbmdlKGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBlbWFpbDogZS50YXJnZXQudmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgQGF1dG9iaW5kXHJcbiAgICBzdWJtaXRFbWFpbChldmVudCA6IFJlYWN0LkZvcm1FdmVudDxGb3JtPikge1xyXG4gICAgICAgIHRoaXMucHJvcHMuc3VibWl0RW1haWwodGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIHN1Ym1pdERpc2FibGVkKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmlzU3VibWl0dGluZyB8fCB0aGlzLmdldFZhbGlkYXRpb25TdGF0ZSgpICE9PSBcInN1Y2Nlc3NcIjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8Zm9vdGVyPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aDE+U2hhcmUgdGhlIHZpc2lvbiE8L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaGVhZGVyLWRldmVpZGVyXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwid293IGZhZGVJblVwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIEZvb3RlciB0ZXh0IGhlcmUuXHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnN1Ym1pdHRlZFxyXG4gICAgICAgICAgICAgICAgICAgID9cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzdWJzY3JpcHRpb24tbWVzc2FnZVwiPnt0aGlzLnByb3BzLm1lc3NhZ2V9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybSBpbmxpbmUgb25TdWJtaXQ9e3RoaXMuc3VibWl0RW1haWx9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250cm9sSWQ9XCJmb3JtQmFzaWNUZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbGlkYXRpb25TdGF0ZT17dGhpcy5nZXRWYWxpZGF0aW9uU3RhdGUoKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZT17IHRoaXMuc3RhdGUuZW1haWwgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwiRW50ZXIgeW91ciBlbWFpbCBhZGRyZXNzXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17IHRoaXMuaGFuZGxlQ2hhbmdlIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sLkZlZWRiYWNrIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvRm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBkaXNhYmxlZD17IHRoaXMuc3VibWl0RGlzYWJsZWQoKSB9PktlZXAgbWUgaW5mb3JtZWQ8L0J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8L0Zvcm0+XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIGlkPVwic2hhcmVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3NOYW1lPVwic29jaWFscy1saW5rc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL3d3dy5mYWNlYm9vay5jb20vWW91ckZiUGFnZVwiPjxpIGNsYXNzTmFtZT1cImZhIGZhLWZhY2Vib29rLXNxdWFyZVwiPjwvaT48L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiaHR0cHM6Ly90d2l0dGVyLmNvbS9Zb3VyVHdpdHRlckhhbmRsZVwiPjxpIGNsYXNzTmFtZT1cImZhIGZhLXR3aXR0ZXItc3F1YXJlXCI+PC9pPjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCJodHRwczovL25sLmxpbmtlZGluLmNvbS9pbi9Zb3VyTGlua2VkSW5Qcm9maWxlXCI+PGkgY2xhc3NOYW1lPVwiZmEgZmEtbGlua2VkaW4tc3F1YXJlXCI+PC9pPjwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwiY29weXJpZ2h0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIMKpIDIwMTYgTUlUIExpY2VuY2VkXHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZm9vdGVyPlxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiBzdGF0ZS5mb290ZXIsIC8vIFNlbGVjdHMgd2hpY2ggc3RhdGUgcHJvcGVydGllcyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbiAgICBGb290ZXJTdGF0ZS5hY3Rpb25DcmVhdG9ycyAgICAgICAgICAgICAgICAgLy8gU2VsZWN0cyB3aGljaCBhY3Rpb24gY3JlYXRvcnMgYXJlIG1lcmdlZCBpbnRvIHRoZSBjb21wb25lbnQncyBwcm9wc1xyXG4pKEZvb3Rlcik7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb21wb25lbnRzL0Zvb3Rlci50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCAqIGFzIFNjcm9sbCBmcm9tICdyZWFjdC1zY3JvbGwnO1xyXG5pbXBvcnQgU2Nyb2xsRWZmZWN0IGZyb20gJy4uL2xpYi9zY3JvbGwtZWZmZWN0JztcclxuaW1wb3J0IEZ1bGxzY3JlZW4gZnJvbSAnLi4vbGliL2Z1bGxzY3JlZW4nO1xyXG5pbXBvcnQgRm9vdGVyIGZyb20gJy4vRm9vdGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhvbWUgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8dm9pZCwgdm9pZD4ge1xyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT1cImNvbnRhaW5lci1mbHVpZFwiPlxyXG4gICAgICAgICAgICA8RnVsbHNjcmVlbj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicm93XCIgaWQ9XCJoZXJvXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cInRhZ2xpbmVcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxTY3JvbGxFZmZlY3QgYW5pbWF0ZT1cImJvdW5jZUluXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgxIGNsYXNzTmFtZT1cImhvbWUtaW50cm8tdGV4dFwiPkRlbW8hPC9oMT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDEgY2xhc3NOYW1lPVwiaG9tZS1pbnRyby10ZXh0XCI+Li4uUmVhY3QsIFJlZHV4LCBPcmxlYW5zIGFuZCBEb3RuZXQ8L2gxPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiaG9tZS1pbnRyby10ZXh0XCI+SW50cm9kdWNpbmcgdGhlIDxTY3JvbGwuTGluayB0bz1cImRlbW9cIiBocmVmPVwiI1wiIHNtb290aD17dHJ1ZX0gZHVyYXRpb249ezcwMH0gb2Zmc2V0PXstNTB9PlJST0Q8L1Njcm9sbC5MaW5rPiBzdGFjazwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L1Njcm9sbEVmZmVjdD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRvd24tbGlua1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPFNjcm9sbC5MaW5rIHRvPVwiZGVtb1wiIGhyZWY9XCIjXCIgY2xhc3NOYW1lPVwiaWNvbi1saW5rXCIgc21vb3RoPXt0cnVlfSBkdXJhdGlvbj17NzAwfSBvZmZzZXQ9ey01MH0gPjxpIGNsYXNzTmFtZT1cImZhIGZhLWFycm93LWNpcmNsZS1kb3duIGN1c3RvbVwiID48L2k+PC9TY3JvbGwuTGluaz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9GdWxsc2NyZWVuPlxyXG4gICAgICAgICAgICA8U2Nyb2xsLkVsZW1lbnQgbmFtZT1cImRlbW9cIiAvPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInJvd1wiIGlkPVwiZm9vdGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8Rm9vdGVyIC8+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PjtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvY29tcG9uZW50cy9Ib21lLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IE5hdk1lbnUgZnJvbSAnLi9OYXZNZW51JztcclxuaW1wb3J0IFJvdXRlVHJhbnNpdGlvbiBmcm9tICcuLi9saWIvcm91dGUtdHJhbnNpdGlvbic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIExheW91dFByb3BzIHtcclxuICAgIGJvZHk6IFJlYWN0LlJlYWN0RWxlbWVudDxhbnk+O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgTGF5b3V0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PExheW91dFByb3BzLCB2b2lkPiB7XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gPGRpdj5cclxuICAgICAgICAgICAgPE5hdk1lbnUgLz5cclxuICAgICAgICAgICAgPFJvdXRlVHJhbnNpdGlvbiBwYXRobmFtZT17dHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgPyB3aW5kb3cubG9jYXRpb24ucGF0aG5hbWUgOiAnJyB9IGNoaWxkcmVuPXt0aGlzLnByb3BzLmJvZHl9PlxyXG4gICAgICAgICAgICAgICAgIHsgdGhpcy5wcm9wcy5ib2R5IC8qIGN1cnJlbnQgcm91dGUgY29tcG9uZW50ICovIH1cclxuICAgICAgICAgICAgPC9Sb3V0ZVRyYW5zaXRpb24+XHJcbiAgICAgICAgPC9kaXY+O1xyXG4gICAgfVxyXG59XHJcblxyXG4vLyBjb25zdCBzdHlsZXM6IGFueSA9IHt9XHJcblxyXG4vLyBzdHlsZXMuZmlsbCA9IHtcclxuLy8gICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxyXG4vLyAgICAgbGVmdDogMCxcclxuLy8gICAgIHJpZ2h0OiAwLFxyXG4vLyAgICAgdG9wOiAwLFxyXG4vLyAgICAgYm90dG9tOiAwXHJcbi8vIH07XHJcblxyXG4vLyBzdHlsZXMuY29udGVudCA9IE9iamVjdC5hc3NpZ24oe30sXHJcbi8vICAgICBzdHlsZXMuZmlsbCwge1xyXG4vLyAgICAgICAgIHRvcDogJzUwcHgnLFxyXG4vLyAgICAgICAgIHRleHRBbGlnbjogJ2NlbnRlcidcclxuLy8gICAgIH1cclxuLy8gKTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2NvbXBvbmVudHMvTGF5b3V0LnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0ICogYXMgUmVhY3RET00gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlcic7XHJcbmltcG9ydCB7IGNvbm5lY3QgfSBmcm9tICdyZWFjdC1yZWR1eCc7XHJcbmltcG9ydCB7IGF1dG9iaW5kIH0gZnJvbSAnY29yZS1kZWNvcmF0b3JzJztcclxuaW1wb3J0IHsgR3JpZCwgQ29sLCBSb3csIEJ1dHRvbiwgQ2hlY2tib3gsIEZvcm0sIEZvcm1Hcm91cCwgRm9ybUNvbnRyb2wsIElucHV0R3JvdXAsIElucHV0R3JvdXBBZGRvbiB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCc7XHJcbmltcG9ydCB7IEFwcGxpY2F0aW9uU3RhdGUgfSBmcm9tICcuLi9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIExvZ2luU3RvcmUgZnJvbSAnLi4vc3RvcmUvTG9naW4nO1xyXG5cclxudHlwZSBMb2dpblByb3BzID0gTG9naW5TdG9yZS5Mb2dpblN0YXRlICYgdHlwZW9mIExvZ2luU3RvcmUuYWN0aW9uQ3JlYXRvcnM7XHJcblxyXG5pbnRlcmZhY2UgTG9naW5TdGF0ZSB7XHJcbiAgICB1c2VyTmFtZTogc3RyaW5nO1xyXG4gICAgcGFzc3dvcmQ6IHN0cmluZztcclxufVxyXG5cclxuY2xhc3MgTG9naW4gZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8TG9naW5Qcm9wcywgTG9naW5TdGF0ZT4ge1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgdXNlck5hbWU6ICcnLFxyXG4gICAgICAgICAgICBwYXNzd29yZDogJydcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgaGFuZGxlQ2hhbmdlKGU6IGFueSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyAuLi50aGlzLnN0YXRlLCBbZS50YXJnZXQubmFtZV06IGUudGFyZ2V0LnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgcHJpdmF0ZSBsb2dpbihldmVudDogUmVhY3QuRm9ybUV2ZW50PEZvcm0+KSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5sb2dpbih7IGVtYWlsOiB0aGlzLnN0YXRlLnVzZXJOYW1lLCBwYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZCwgcmVtZW1iZXJMb2dpbjogdHJ1ZSwgcmV0dXJuVXJsOiAnLycgfSk7XHJcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGdldFZhbGlkYXRpb25TdGF0ZSgpOiBcInN1Y2Nlc3NcIiB8IFwid2FybmluZ1wiIHwgXCJlcnJvclwiIHtcclxuICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyTG9nZ2VkSW4oKSB7XHJcbiAgICAgICAgcmV0dXJuIDxHcmlkPlxyXG4gICAgICAgICAgICA8aDE+VSBiZW50IGluZ2Vsb2dkITwvaDE+XHJcblxyXG4gICAgICAgICAgICA8Zm9ybSBhY3Rpb249XCJ+L2FjY291bnRcIiBtZXRob2Q9XCJwb3N0XCI+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tbGcgYnRuLXdhcm5pbmdcIiB0eXBlPVwic3VibWl0XCI+UXVlcnkgdGhlIHJlc291cmNlIGNvbnRyb2xsZXI8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9mb3JtPlxyXG5cclxuICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiYnRuIGJ0bi1sZyBidG4tZGFuZ2VyXCIgaHJlZj1cIi9zaWdub3V0XCI+U2lnbiBvdXQ8L2E+XHJcbiAgICAgICAgPC9HcmlkPlxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXJBbm9ueW1vdXMoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxHcmlkIGNsYXNzTmFtZT1cIm9tYl9sb2dpblwiPlxyXG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwib21iX2F1dGhUaXRsZVwiPkxvZ2luIG9mIDxMaW5rIHRvPXsnL1JlZ2lzdGVyJ30+UmVnaXN0cmVlcjwvTGluaz48L2gzPlxyXG4gICAgICAgICAgICA8Um93IGNsYXNzTmFtZT1cIm9tYl9zb2NpYWxCdXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICA8Q29sIHhzPXs0fSBzbT17Mn0gc21PZmZzZXQ9ezN9ID5cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIiNcIiBjbGFzc05hbWU9XCJidG4gYnRuLWxnIGJ0bi1ibG9jayBvbWJfYnRuLWZhY2Vib29rXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cImZhIGZhLWZhY2Vib29rIHZpc2libGUteHNcIj48L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImhpZGRlbi14c1wiPkZhY2Vib29rPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPENvbCB4cz17NH0gc209ezJ9ID5cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIiNcIiBjbGFzc05hbWU9XCJidG4gYnRuLWxnIGJ0bi1ibG9jayBvbWJfYnRuLXR3aXR0ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwiZmEgZmEtdHdpdHRlciB2aXNpYmxlLXhzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHNcIj5Ud2l0dGVyPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgPENvbCB4cz17NH0gc209ezJ9ID5cclxuICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIiNcIiBjbGFzc05hbWU9XCJidG4gYnRuLWxnIGJ0bi1ibG9jayBvbWJfYnRuLWdvb2dsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJmYSBmYS1nb29nbGUtcGx1cyB2aXNpYmxlLXhzXCI+PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJoaWRkZW4teHNcIj5Hb29nbGUrPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICA8L1Jvdz5cclxuXHJcbiAgICAgICAgICAgIDxSb3cgY2xhc3NOYW1lPVwib21iX2xvZ2luT3JcIj5cclxuICAgICAgICAgICAgICAgIDxDb2wgeHM9ezEyfSBzbT17Nn0gc21PZmZzZXQ9ezN9ID5cclxuICAgICAgICAgICAgICAgICAgICA8aHIgY2xhc3NOYW1lPVwib21iX2hyT3JcIiAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm9tYl9zcGFuT3JcIj5vZjwvc3Bhbj5cclxuXHRcdFx0ICAgIDwvQ29sPlxyXG4gICAgICAgICAgICA8L1Jvdz5cclxuXHJcbiAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICA8Q29sIHhzPXsxMn0gc209ezZ9IHNtT2Zmc2V0PXszfSA+XHJcbiAgICAgICAgICAgICAgICAgICAgPEZvcm0gY2xhc3NOYW1lPVwib21iX2xvZ2luRm9ybVwiIG9uU3VibWl0PXt0aGlzLmxvZ2lufSBhdXRvQ29tcGxldGU9XCJvZmZcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Hcm91cCB2YWxpZGF0aW9uU3RhdGU9e3RoaXMuZ2V0VmFsaWRhdGlvblN0YXRlKCl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0R3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPElucHV0R3JvdXAuQWRkb24+PGkgY2xhc3NOYW1lPVwiZmEgZmEtdXNlclwiIC8+PC9JbnB1dEdyb3VwLkFkZG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbCBuYW1lPVwidXNlck5hbWVcIiB0eXBlPVwidGV4dFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gcGxhY2Vob2xkZXI9XCJMb2dpbiBOYWFtXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvSW5wdXRHcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtQ29udHJvbC5GZWVkYmFjayAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxGb3JtR3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRHcm91cD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8SW5wdXRHcm91cC5BZGRvbj48aSBjbGFzc05hbWU9XCJmYSBmYS1sb2NrXCIgLz48L0lucHV0R3JvdXAuQWRkb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIG5hbWU9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L0lucHV0R3JvdXA+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8Rm9ybUNvbnRyb2wuRmVlZGJhY2sgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9Gb3JtR3JvdXA+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uIGNsYXNzTmFtZT1cImJ0biBidG4tbGcgYnRuLXByaW1hcnkgYnRuLWJsb2NrXCIgdHlwZT1cInN1Ym1pdFwiPklubG9nZ2VuPC9CdXR0b24+XHJcbiAgICBcdFx0XHRcdDwvRm9ybT5cclxuICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICA8L1Jvdz5cclxuXHJcbiAgICAgICAgICAgIDxSb3c+XHJcbiAgICAgICAgICAgICAgICA8Q29sIHhzPXsxMn0gc209ezN9IHNtT2Zmc2V0PXszfT5cclxuICAgICAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q2hlY2tib3g+T250aG91IG1pajwvQ2hlY2tib3g+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Gb3JtR3JvdXA+XHJcbiAgICBcdFx0XHQ8L0NvbD5cclxuICAgICAgICAgICAgICAgIDxDb2wgeHM9ezEyfSBzbT17M30+XHJcbiAgICAgICAgICAgICAgICAgICAgPHAgY2xhc3NOYW1lPVwib21iX2ZvcmdvdFB3ZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz1cIiNcIj5QYXNzd29yZCB2ZXJnZXRlbj88L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9wPlxyXG4gICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgIDwvUm93Plx0ICAgIFxyXG4gICAgICAgIDwvR3JpZD5cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmF1dGhlbnRpY2F0ZWQpXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlbmRlckxvZ2dlZEluKCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yZW5kZXJBbm9ueW1vdXMoKTtcclxuICAgIH1cclxufVxyXG5cclxuLy8gV2lyZSB1cCB0aGUgUmVhY3QgY29tcG9uZW50IHRvIHRoZSBSZWR1eCBzdG9yZVxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiBzdGF0ZS5sb2dpbiwgLy8gU2VsZWN0cyB3aGljaCBzdGF0ZSBwcm9wZXJ0aWVzIGFyZSBtZXJnZWQgaW50byB0aGUgY29tcG9uZW50J3MgcHJvcHNcclxuICAgIExvZ2luU3RvcmUuYWN0aW9uQ3JlYXRvcnMgICAgICAgICAgICAgICAgIC8vIFNlbGVjdHMgd2hpY2ggYWN0aW9uIGNyZWF0b3JzIGFyZSBtZXJnZWQgaW50byB0aGUgY29tcG9uZW50J3MgcHJvcHNcclxuKShMb2dpbik7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb21wb25lbnRzL0xvZ2luLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4J1xyXG5pbXBvcnQgeyBBcHBsaWNhdGlvblN0YXRlIH0gZnJvbSAnLi4vc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBMb2dpblN0b3JlIGZyb20gJy4uL3N0b3JlL0xvZ2luJztcclxuXHJcbnR5cGUgTG9nb3V0UHJvcHMgPSBMb2dpblN0b3JlLkxvZ2luU3RhdGUgJiB0eXBlb2YgTG9naW5TdG9yZS5hY3Rpb25DcmVhdG9ycztcclxuXHJcbmNsYXNzIExvZ291dCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxMb2dvdXRQcm9wcywgdm9pZD4ge1xyXG5cclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICB0aGlzLnByb3BzLmxvZ291dCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiBzdGF0ZS5sb2dpbiwgLy8gU2VsZWN0cyB3aGljaCBzdGF0ZSBwcm9wZXJ0aWVzIGFyZSBtZXJnZWQgaW50byB0aGUgY29tcG9uZW50J3MgcHJvcHNcclxuICAgIExvZ2luU3RvcmUuYWN0aW9uQ3JlYXRvcnMgICAgICAgICAgICAgICAgIC8vIFNlbGVjdHMgd2hpY2ggYWN0aW9uIGNyZWF0b3JzIGFyZSBtZXJnZWQgaW50byB0aGUgY29tcG9uZW50J3MgcHJvcHNcclxuKShMb2dvdXQpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvY29tcG9uZW50cy9Mb2dvdXQudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgQXBwbGljYXRpb25TdGF0ZSB9IGZyb20gJy4uL3N0b3JlJztcclxuaW1wb3J0IHsgTmF2YmFyLCBOYXYsIE5hdkl0ZW0sIE5hdkRyb3Bkb3duLCBNZW51SXRlbSB9IGZyb20gJ3JlYWN0LWJvb3RzdHJhcCc7XHJcbmltcG9ydCB7IExpbmtDb250YWluZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItYm9vdHN0cmFwJztcclxuXHJcbmNvbnN0IGxvZ28gPSByZXF1aXJlKCcuLi9pbWFnZXMvbG9nby5zdmcnKSBhcyBzdHJpbmc7XHJcblxyXG5pbnRlcmZhY2UgTmF2TWVudVByb3BzIHtcclxuICAgIGlzQXV0aGVudGljYXRlZDogYm9vbGVhbjtcclxuICAgIHJvbGVzOiBzdHJpbmdbXTtcclxufVxyXG5cclxuY2xhc3MgTmF2TWVudSBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxOYXZNZW51UHJvcHMsIHZvaWQ+IHtcclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxOYXZiYXIgZml4ZWRUb3A9e3RydWV9PlxyXG4gICAgICAgICAgICA8TmF2YmFyLkhlYWRlcj5cclxuICAgICAgICAgICAgICAgIDxOYXZiYXIuQnJhbmQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmsgY2xhc3NOYW1lPSduYXZiYXItYnJhbmQnIHRvPXsnLyd9PjxpbWcgc3JjPXsgbG9nbyB9IGFsdD1cIlJST0QgTG9nb1wiIC8+UlJPRDwvTGluaz5cclxuICAgICAgICAgICAgICAgIDwvTmF2YmFyLkJyYW5kPlxyXG4gICAgICAgICAgICAgICAgPE5hdmJhci5Ub2dnbGUgLz5cclxuICAgICAgICAgICAgPC9OYXZiYXIuSGVhZGVyPlxyXG4gICAgICAgICAgICA8TmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgICAgICAgICAgPE5hdiBwdWxsUmlnaHQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmtDb250YWluZXIgdG89XCIvY29udGFjdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2SXRlbSBldmVudEtleT17MX0+Q29udGFjdDwvTmF2SXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8L0xpbmtDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPExpbmtDb250YWluZXIgdG89XCIvY291bnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TmF2SXRlbSBldmVudEtleT17M30+Q291bnRlcjwvTmF2SXRlbT5cclxuICAgICAgICAgICAgICAgICAgICA8L0xpbmtDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgPE5hdkRyb3Bkb3duIGV2ZW50S2V5PXsyfSB0aXRsZT1cIkxvZ2luXCIgaWQ9XCJuYXYtZHJvcGRvd25cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPExpbmtDb250YWluZXIgdG89XCIvbG9naW5cIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbSBkaXNhYmxlZD17dGhpcy5wcm9wcy5pc0F1dGhlbnRpY2F0ZWR9IGV2ZW50S2V5PXsyLjF9PkxvZ2luPC9NZW51SXRlbT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9MaW5rQ29udGFpbmVyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8TGlua0NvbnRhaW5lciB0bz1cIi9yZWdpc3RlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtIGRpc2FibGVkPXt0aGlzLnByb3BzLmlzQXV0aGVudGljYXRlZH0gZXZlbnRLZXk9ezIuMn0+UmVnaXN0ZXI8L01lbnVJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0xpbmtDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rQ29udGFpbmVyIHRvPVwiL3VzZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbSBldmVudEtleT17Mi4zfT5Vc2VyIFByb2ZpbGU8L01lbnVJdGVtPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0xpbmtDb250YWluZXI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxNZW51SXRlbSBkaXZpZGVyIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rQ29udGFpbmVyIHRvPVwiL2xvZ291dFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPE1lbnVJdGVtIGRpc2FibGVkPXshdGhpcy5wcm9wcy5pc0F1dGhlbnRpY2F0ZWR9IGV2ZW50S2V5PXsyLjR9PkxvZ291dDwvTWVudUl0ZW0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvTGlua0NvbnRhaW5lcj5cclxuICAgICAgICAgICAgICAgICAgICA8L05hdkRyb3Bkb3duPlxyXG4gICAgICAgICAgICAgICAgPC9OYXY+XHJcbiAgICAgICAgICAgIDwvTmF2YmFyLkNvbGxhcHNlPlxyXG4gICAgICAgIDwvTmF2YmFyPlxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiB7IHJldHVybiB7IGlzQXV0aGVudGljYXRlZDogc3RhdGUubG9naW4uYXV0aGVudGljYXRlZCwgcm9sZXM6IFtdIH07IH0sIC8vIFNlbGVjdHMgd2hpY2ggc3RhdGUgcHJvcGVydGllcyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbiAgICB7fSAgICAgICAgICAgICAgICAgLy8gU2VsZWN0cyB3aGljaCBhY3Rpb24gY3JlYXRvcnMgYXJlIG1lcmdlZCBpbnRvIHRoZSBjb21wb25lbnQncyBwcm9wc1xyXG4pKE5hdk1lbnUpO1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb21wb25lbnRzL05hdk1lbnUudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICdjb3JlLWRlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBHcmlkLCBDb2wsIFJvdywgQnV0dG9uLCBDaGVja2JveCwgRm9ybSwgRm9ybUdyb3VwLCBGb3JtQ29udHJvbCwgSW5wdXRHcm91cCwgSW5wdXRHcm91cEFkZG9uLCBDb250cm9sTGFiZWwgfSBmcm9tICdyZWFjdC1ib290c3RyYXAnO1xyXG5pbXBvcnQgeyBBcHBsaWNhdGlvblN0YXRlIH0gZnJvbSAnLi4vc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBSZWdpc3RlclN0b3JlIGZyb20gJy4uL3N0b3JlL1JlZ2lzdGVyJztcclxuXHJcbnR5cGUgUmVnaXN0ZXJQcm9wcyA9IFJlZ2lzdGVyU3RvcmUuUmVnaXN0ZXJTdGF0ZSAmIHR5cGVvZiBSZWdpc3RlclN0b3JlLmFjdGlvbkNyZWF0b3JzO1xyXG5cclxuaW50ZXJmYWNlIFJlZ2lzdGVyU3RhdGUge1xyXG4gICAgdXNlck5hbWU6IHN0cmluZztcclxuICAgIHBhc3N3b3JkOiBzdHJpbmc7XHJcbn1cclxuXHJcbmNsYXNzIFJlZ2lzdGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFJlZ2lzdGVyUHJvcHMsIFJlZ2lzdGVyU3RhdGU+IHtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHVzZXJOYW1lOiAnJyxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6ICcnXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIGhhbmRsZUNoYW5nZShlOiBhbnkpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgLi4udGhpcy5zdGF0ZSwgW2UudGFyZ2V0Lm5hbWVdOiBlLnRhcmdldC52YWx1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBAYXV0b2JpbmRcclxuICAgIHByaXZhdGUgcmVnaXN0ZXIoZXZlbnQ6IFJlYWN0LkZvcm1FdmVudDxGb3JtPikge1xyXG4gICAgICAgIHRoaXMucHJvcHMucmVnaXN0ZXIoeyBlbWFpbDogdGhpcy5zdGF0ZS51c2VyTmFtZSwgcGFzc3dvcmQ6IHRoaXMuc3RhdGUucGFzc3dvcmQsIGNvbmZpcm1QYXNzd29yZDogdGhpcy5zdGF0ZS5wYXNzd29yZCB9KTtcclxuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgZ2V0VmFsaWRhdGlvblN0YXRlKCk6IFwic3VjY2Vzc1wiIHwgXCJ3YXJuaW5nXCIgfCBcImVycm9yXCIge1xyXG4gICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxHcmlkPlxyXG4gICAgICAgICAgICA8aDE+UmVnaXN0ZXIgbmV3IGFjY291bnQ8L2gxPlxyXG4gICAgICAgICAgICA8aHIvPlxyXG4gICAgICAgICAgICA8Rm9ybSBob3Jpem9udGFsIG9uU3VibWl0PXt0aGlzLnJlZ2lzdGVyfSBhdXRvQ29tcGxldGU9XCJvblwiPlxyXG4gICAgICAgICAgICAgICAgPEZvcm1Hcm91cCBuYW1lPVwidXNlck5hbWVcIiB2YWxpZGF0aW9uU3RhdGU9e3RoaXMuZ2V0VmFsaWRhdGlvblN0YXRlKCl9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgY29tcG9uZW50Q2xhc3M9e0NvbnRyb2xMYWJlbH0gc209ezJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBFbWFpbFxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgc209ezEwfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIG5hbWU9XCJ1c2VyTmFtZVwiIHR5cGU9XCJ0ZXh0XCIgb25DaGFuZ2U9e3RoaXMuaGFuZGxlQ2hhbmdlfSBwbGFjZWhvbGRlcj1cIkVtYWlsXCIgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sLkZlZWRiYWNrIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwIG5hbWU9XCJwYXNzd29yZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgY29tcG9uZW50Q2xhc3M9e0NvbnRyb2xMYWJlbH0gc209ezJ9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBQYXNzd29yZFxyXG4gICAgICAgICAgICAgICAgICAgIDwvQ29sPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgc209ezEwfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sIG5hbWU9XCJwYXNzd29yZFwiIHR5cGU9XCJwYXNzd29yZFwiIG9uQ2hhbmdlPXt0aGlzLmhhbmRsZUNoYW5nZX0gcGxhY2Vob2xkZXI9XCJQYXNzd29yZFwiIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICAgICAgPEZvcm1Db250cm9sLkZlZWRiYWNrIC8+XHJcbiAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuXHJcbiAgICAgICAgICAgICAgICA8Rm9ybUdyb3VwPlxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2wgc21PZmZzZXQ9ezJ9IHNtPXsxMH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxCdXR0b24gY2xhc3NOYW1lPVwiYnRuIGJ0bi1wcmltYXJ5XCIgdHlwZT1cInN1Ym1pdFwiPlJlZ2lzdGVyPC9CdXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9Db2w+XHJcbiAgICAgICAgICAgICAgICA8L0Zvcm1Hcm91cD5cclxuICAgICAgICAgICAgPC9Gb3JtPlxyXG4gICAgICAgIDwvR3JpZD47XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vIFdpcmUgdXAgdGhlIFJlYWN0IGNvbXBvbmVudCB0byB0aGUgUmVkdXggc3RvcmVcclxuZXhwb3J0IGRlZmF1bHQgY29ubmVjdChcclxuICAgIChzdGF0ZTogQXBwbGljYXRpb25TdGF0ZSkgPT4gc3RhdGUucmVnaXN0ZXIsIC8vIFNlbGVjdHMgd2hpY2ggc3RhdGUgcHJvcGVydGllcyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbiAgICBSZWdpc3RlclN0b3JlLmFjdGlvbkNyZWF0b3JzICAgICAgICAgICAgICAgICAvLyBTZWxlY3RzIHdoaWNoIGFjdGlvbiBjcmVhdG9ycyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbikoUmVnaXN0ZXIpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvY29tcG9uZW50cy9SZWdpc3Rlci50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xyXG5pbXBvcnQgeyBHcmlkIH0gZnJvbSAncmVhY3QtYm9vdHN0cmFwJztcclxuaW1wb3J0IHsgY29ubmVjdCB9IGZyb20gJ3JlYWN0LXJlZHV4JztcclxuaW1wb3J0IHsgQXBwbGljYXRpb25TdGF0ZSB9ICBmcm9tICcuLi9zdG9yZSc7XHJcbmltcG9ydCAqIGFzIFVzZXJTdGF0ZSBmcm9tICcuLi9zdG9yZS9Vc2VyJztcclxuXHJcbnR5cGUgVXNlclByb3BzID0gVXNlclN0YXRlLlVzZXJNb2RlbCAmIHR5cGVvZiBVc2VyU3RhdGUuYWN0aW9uQ3JlYXRvcnMgIFxyXG5cclxuY2xhc3MgVXNlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxVc2VyUHJvcHMsIHZvaWQ+IHtcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudCgpIHtcclxuICAgICAgICAvLyBUaGlzIG1ldGhvZCBydW5zIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBmaXJzdCBhZGRlZCB0byB0aGUgcGFnZVxyXG4gICAgICAgIC8vIHRoaXMucHJvcHMuZ2V0VXNlcigpO1xyXG4gICAgfVxyXG4gICAgY29tcG9uZW50RGlkTW91bnQoKSB7XHJcbiAgICAgICAgLy8gVGhpcyBtZXRob2QgcnVucyB3aGVuIHRoZSBjb21wb25lbnQgaXMgZmlyc3QgYWRkZWQgdG8gdGhlIHBhZ2VcclxuICAgICAgICB0aGlzLnByb3BzLmdldFVzZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8R3JpZD5cclxuICAgICAgICAgICAgPGgxPlVzZXI8L2gxPlxyXG4gICAgICAgICAgICA8cD5UaGlzIGNvbXBvbmVudCBkZW1vbnN0cmF0ZXMgZmV0Y2hpbmcgZGF0YSBmcm9tIHRoZSBzZXJ2ZXIgYW5kIHdvcmtpbmcgd2l0aCBVUkwgcGFyYW1ldGVycy48L3A+XHJcbiAgICAgICAgICAgIDxwPlVzZXIgaXMgYXV0aGVudGljYXRlZDoge3RoaXMucHJvcHMuaXNBdXRoZW50aWNhdGVkID8gJ1llcyEgOi0pJyA6ICdObyA6LSgnIH08L3A+XHJcbiAgICAgICAgICAgIDxwPlVzZXIgZW1haWw6IHt0aGlzLnByb3BzLmVtYWlsfTwvcD5cclxuICAgICAgICA8L0dyaWQ+O1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0KFxyXG4gICAgKHN0YXRlOiBBcHBsaWNhdGlvblN0YXRlKSA9PiBzdGF0ZS51c2VyLCAvLyBTZWxlY3RzIHdoaWNoIHN0YXRlIHByb3BlcnRpZXMgYXJlIG1lcmdlZCBpbnRvIHRoZSBjb21wb25lbnQncyBwcm9wc1xyXG4gICAgVXNlclN0YXRlLmFjdGlvbkNyZWF0b3JzICAgICAgICAgICAgICAgICAvLyBTZWxlY3RzIHdoaWNoIGFjdGlvbiBjcmVhdG9ycyBhcmUgbWVyZ2VkIGludG8gdGhlIGNvbXBvbmVudCdzIHByb3BzXHJcbikoVXNlcik7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb21wb25lbnRzL1VzZXIudHN4IiwiaW1wb3J0IHsgY3JlYXRlU3RvcmUsIGFwcGx5TWlkZGxld2FyZSwgY29tcG9zZSwgY29tYmluZVJlZHVjZXJzLCBHZW5lcmljU3RvcmVFbmhhbmNlciwgU3RvcmUgfSBmcm9tICdyZWR1eCc7XHJcbmltcG9ydCB0aHVuayBmcm9tICdyZWR1eC10aHVuayc7XHJcbmltcG9ydCB7IHJvdXRlclJlZHVjZXIgfSBmcm9tICdyZWFjdC1yb3V0ZXItcmVkdXgnO1xyXG5pbXBvcnQgeyBBcHBsaWNhdGlvblN0YXRlLCByZWR1Y2VycyB9IGZyb20gJy4vc3RvcmUnO1xyXG5pbXBvcnQgKiBhcyBBcHBTdG9yZSBmcm9tICcuL3N0b3JlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGNvbmZpZ3VyZVN0b3JlKGluaXRpYWxTdGF0ZT86IEFwcGxpY2F0aW9uU3RhdGUpIHtcclxuICAgIC8vIEJ1aWxkIG1pZGRsZXdhcmUuIFRoZXNlIGFyZSBmdW5jdGlvbnMgdGhhdCBjYW4gcHJvY2VzcyB0aGUgYWN0aW9ucyBiZWZvcmUgdGhleSByZWFjaCB0aGUgc3RvcmUuXHJcbiAgICBjb25zdCB3aW5kb3dJZkRlZmluZWQgPSB0eXBlb2Ygd2luZG93ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiB3aW5kb3cgYXMgYW55O1xyXG4gICAgLy8gSWYgZGV2VG9vbHMgaXMgaW5zdGFsbGVkLCBjb25uZWN0IHRvIGl0XHJcbiAgICBjb25zdCBkZXZUb29sc0V4dGVuc2lvbiA9IHdpbmRvd0lmRGVmaW5lZCAmJiB3aW5kb3dJZkRlZmluZWQuZGV2VG9vbHNFeHRlbnNpb24gYXMgKCkgPT4gR2VuZXJpY1N0b3JlRW5oYW5jZXI7XHJcbiAgICBjb25zdCBjcmVhdGVTdG9yZVdpdGhNaWRkbGV3YXJlID0gY29tcG9zZShcclxuICAgICAgICBhcHBseU1pZGRsZXdhcmUodGh1bmspLFxyXG4gICAgICAgIGRldlRvb2xzRXh0ZW5zaW9uID8gZGV2VG9vbHNFeHRlbnNpb24oKSA6IGYgPT4gZlxyXG4gICAgKShjcmVhdGVTdG9yZSk7XHJcblxyXG4gICAgLy8gQ29tYmluZSBhbGwgcmVkdWNlcnMgYW5kIGluc3RhbnRpYXRlIHRoZSBhcHAtd2lkZSBzdG9yZSBpbnN0YW5jZVxyXG4gICAgY29uc3QgYWxsUmVkdWNlcnMgPSBidWlsZFJvb3RSZWR1Y2VyKHJlZHVjZXJzKTtcclxuICAgIGNvbnN0IHN0b3JlID0gY3JlYXRlU3RvcmVXaXRoTWlkZGxld2FyZShhbGxSZWR1Y2VycywgaW5pdGlhbFN0YXRlKSBhcyBTdG9yZTxBcHBsaWNhdGlvblN0YXRlPjtcclxuXHJcbiAgICAvLyBFbmFibGUgV2VicGFjayBob3QgbW9kdWxlIHJlcGxhY2VtZW50IGZvciByZWR1Y2Vyc1xyXG4gICAgaWYgKG1vZHVsZS5ob3QpIHtcclxuICAgICAgICBtb2R1bGUuaG90LmFjY2VwdCgnLi9zdG9yZScsICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbmV4dFJvb3RSZWR1Y2VyID0gcmVxdWlyZTx0eXBlb2YgQXBwU3RvcmU+KCcuL3N0b3JlJyk7XHJcbiAgICAgICAgICAgIHN0b3JlLnJlcGxhY2VSZWR1Y2VyKGJ1aWxkUm9vdFJlZHVjZXIobmV4dFJvb3RSZWR1Y2VyLnJlZHVjZXJzKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG59XHJcblxyXG5mdW5jdGlvbiBidWlsZFJvb3RSZWR1Y2VyKGFsbFJlZHVjZXJzKSB7XHJcbiAgICByZXR1cm4gY29tYmluZVJlZHVjZXJzPEFwcGxpY2F0aW9uU3RhdGU+KE9iamVjdC5hc3NpZ24oe30sIGFsbFJlZHVjZXJzLCB7IHJvdXRpbmc6IHJvdXRlclJlZHVjZXIgfSkpO1xyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9jb25maWd1cmVTdG9yZS50cyIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcblxyXG5pbnRlcmZhY2UgRGltZW5zaW9ucyB7XHJcbiAgICBoZWlnaHQ6IHN0cmluZ1xyXG59XHJcblxyXG52YXIgZ2V0RGltZW5zaW9ucyA9ICgpID0+ICh7IGhlaWdodDogd2luZG93LmlubmVySGVpZ2h0IC0gNTAgKyAncHgnIH0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRnVsbFNjcmVlbiBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDx2b2lkLCBEaW1lbnNpb25zPiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyBoZWlnaHQ6ICcxMDB2aCcgfTtcclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSA9IHRoaXMuaGFuZGxlUmVzaXplLmJpbmQodGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlUmVzaXplKCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoZ2V0RGltZW5zaW9ucygpKTtcclxuICAgIH1cclxuXHJcbiAgICBjb21wb25lbnREaWRNb3VudCgpIHtcclxuICAgICAgICB0aGlzLmhhbmRsZVJlc2l6ZSgpO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCB0aGlzLmhhbmRsZVJlc2l6ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsIHRoaXMuaGFuZGxlUmVzaXplKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgY29uc3QgY2hpbGQgPSBSZWFjdC5jbG9uZUVsZW1lbnQoUmVhY3QuQ2hpbGRyZW4ub25seSh0aGlzLnByb3BzLmNoaWxkcmVuKSwgeyBzdHlsZTogeyBoZWlnaHQ6IHRoaXMuc3RhdGUuaGVpZ2h0IH0gfSk7XHJcbiAgICAgICAgLy9yZXR1cm4gPGRpdj57Y2hpbGR9PC9kaXY+O1xyXG4gICAgICAgIHJldHVybiBjaGlsZFxyXG4gICAgfVxyXG5cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9saWIvZnVsbHNjcmVlbi50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IFRyYW5zaXRpb25Nb3Rpb24sIHNwcmluZyB9IGZyb20gJ3JlYWN0LW1vdGlvbic7XHJcblxyXG5jb25zdCB3aWxsRW50ZXIgPSAoKSA9PiAoe1xyXG4gICAgb3BhY2l0eTogMCxcclxuICAgIHNjYWxlOiAwLjk3XHJcbn0pO1xyXG5cclxuY29uc3Qgd2lsbExlYXZlID0gKCkgPT4gKHtcclxuICAgIG9wYWNpdHk6IHNwcmluZygwKSxcclxuICAgIHNjYWxlOiBzcHJpbmcoMS4wMClcclxufSk7XHJcblxyXG5jb25zdCBnZXRTdHlsZXMgPSAoKSA9PiAoe1xyXG4gICAgb3BhY2l0eTogc3ByaW5nKDEpLFxyXG4gICAgc2NhbGU6IHNwcmluZygxKVxyXG59KTtcclxuXHJcbmNvbnN0IFJvdXRlVHJhbnNpdGlvbiA9ICh7IGNoaWxkcmVuOiBjaGlsZCwgcGF0aG5hbWUgfSkgPT4gKFxyXG4gICAgPFRyYW5zaXRpb25Nb3Rpb25cclxuICAgICAgICBzdHlsZXM9e1t7XHJcbiAgICAgICAgICAgIGtleTogcGF0aG5hbWUsXHJcbiAgICAgICAgICAgIHN0eWxlOiBnZXRTdHlsZXMoKSxcclxuICAgICAgICAgICAgZGF0YTogeyBjaGlsZCB9XHJcbiAgICAgICAgfV19XHJcbiAgICAgICAgd2lsbEVudGVyPXt3aWxsRW50ZXJ9XHJcbiAgICAgICAgd2lsbExlYXZlPXt3aWxsTGVhdmV9XHJcbiAgICAgICAgPlxyXG4gICAgICAgIHsoaW50ZXJwb2xhdGVkKSA9PlxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAge2ludGVycG9sYXRlZC5tYXAoKHsga2V5LCBzdHlsZSwgZGF0YSB9KSA9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXZcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5PXtgJHtrZXl9LXRyYW5zaXRpb25gfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZT17T2JqZWN0LmFzc2lnbih7fSwgc3R5bGVzLndyYXBwZXIsIHsgb3BhY2l0eTogc3R5bGUub3BhY2l0eSwgdHJhbnNmb3JtOiBgc2NhbGUoJHtzdHlsZS5zY2FsZX0pYCB9KX1cclxuICAgICAgICAgICAgICAgICAgICA+XHJcbiAgICAgICAgICAgIHtkYXRhLmNoaWxkfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApIH1cclxuICAgICAgPC9kaXY+XHJcbiAgICB9XHJcbiAgPC9UcmFuc2l0aW9uTW90aW9uID5cclxuKTtcclxuXHJcbnZhciBzdHlsZXMgPSB7XHJcbiAgICB3cmFwcGVyOiB7XHJcbiAgICAgICAgcG9zaXRpb246ICdhYnNvbHV0ZScsXHJcbiAgICAgICAgd2lkdGg6ICcxMDAlJ1xyXG4gICAgfVxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUm91dGVUcmFuc2l0aW9uO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvbGliL3JvdXRlLXRyYW5zaXRpb24udHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgKiBhcyBSZWFjdERPTSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgY2xhc3NOYW1lcyBmcm9tICdjbGFzc25hbWVzJztcclxuaW1wb3J0IHsgYXV0b2JpbmQgfSBmcm9tICdjb3JlLWRlY29yYXRvcnMnO1xyXG5pbXBvcnQgeyBkZWJvdW5jZSwgQ2FuY2VsYWJsZSB9IGZyb20gJ2xvZGFzaCc7XHJcblxyXG5pbnRlcmZhY2UgU2Nyb2xsRWZmZWN0U3RhdGUge1xyXG4gICAgYW5pbWF0ZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmludGVyZmFjZSBTY3JvbGxFZmZlY3RQcm9wcyB7XHJcbiAgICBhbmltYXRlPzogc3RyaW5nO1xyXG4gICAgb2Zmc2V0PzogbnVtYmVyO1xyXG4gICAgY2xhc3NOYW1lPzogc3RyaW5nO1xyXG4gICAgZHVyYXRpb24/OiBudW1iZXIgfCB1bmRlZmluZWQ7XHJcbiAgICBxdWV1ZUR1cmF0aW9uPzogbnVtYmVyO1xyXG4gICAgcXVldWVDbGFzcz86IHN0cmluZztcclxuICAgIGNhbGxiYWNrPzogKCkgPT4gdm9pZDtcclxufTtcclxuXHJcbi8vdmFyIGNhblVzZURPTSA9ICEhKFxyXG4vLyAgICB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJlxyXG4vLyAgICB3aW5kb3cuZG9jdW1lbnQgJiZcclxuLy8gICAgd2luZG93LmRvY3VtZW50LmNyZWF0ZUVsZW1lbnRcclxuLy8pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU2Nyb2xsRWZmZWN0IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PFNjcm9sbEVmZmVjdFByb3BzLCBTY3JvbGxFZmZlY3RTdGF0ZT4ge1xyXG4gICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge1xyXG4gICAgICAgICAgICBhbmltYXRlZDogZmFsc2UsXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHRQcm9wczogU2Nyb2xsRWZmZWN0UHJvcHMgPSB7XHJcbiAgICAgICAgYW5pbWF0ZTogXCJmYWRlSW5VcFwiLFxyXG4gICAgICAgIG9mZnNldDogMCxcclxuICAgICAgICBjbGFzc05hbWU6IFwiXCIsXHJcbiAgICAgICAgZHVyYXRpb246IDEsXHJcbiAgICAgICAgcXVldWVEdXJhdGlvbjogMSxcclxuICAgICAgICBxdWV1ZUNsYXNzOiBcIlwiLFxyXG4gICAgICAgIGNhbGxiYWNrOiAoKSA9PiB7IH1cclxuICAgIH07XHJcblxyXG4gICAgc2Nyb2xsSGFuZGxlcjogRXZlbnRMaXN0ZW5lciAmIENhbmNlbGFibGU7XHJcblxyXG4gICAgcHVibGljIGNvbXBvbmVudERpZE1vdW50KCkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlU2Nyb2xsKHVuZGVmaW5lZCk7XHJcbiAgICAgICAgdGhpcy5zY3JvbGxIYW5kbGVyID0gZGVib3VuY2UodGhpcy5oYW5kbGVTY3JvbGwuYmluZCh0aGlzKSwgMjAwLCB7IHRyYWlsaW5nOiB0cnVlIH0pO1xyXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCB0aGlzLnNjcm9sbEhhbmRsZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcclxuICAgICAgICB0aGlzLnNjcm9sbEhhbmRsZXIuY2FuY2VsKCk7XHJcbiAgICAgICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIHRoaXMuc2Nyb2xsSGFuZGxlcik7XHJcbiAgICB9XHJcblxyXG4gICAgc2luZ2xlQW5pbWF0ZSgpIHtcclxuICAgICAgICAvKiBjYWxsYmFjayAqL1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgfSwgKHRoaXMucHJvcHMuZHVyYXRpb24gfCAxKSAqIDEwMDApO1xyXG4gICAgfVxyXG5cclxuICAgIHF1ZXVlQW5pbWF0ZSgpIHtcclxuICAgICAgICBsZXQgZWxlbWVudCA9IFJlYWN0RE9NLmZpbmRET01Ob2RlKHRoaXMpO1xyXG4gICAgICAgIGxldCBjaGVja0NsYXNzID0gKGVsKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBlbC5jbGFzc05hbWUgPT09IHRoaXMucHJvcHMucXVldWVDbGFzcztcclxuICAgICAgICB9O1xyXG4gICAgICAgIGxldCBudW1iZXIgPSAwO1xyXG4gICAgICAgIGxldCBzZXRDbGFzcyA9IChlbCkgPT4ge1xyXG4gICAgICAgICAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcclxuICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBlbC5zdHlsZS52aXNpYmlsaXR5ID0gXCJ2aXNpYmxlXCI7XHJcbiAgICAgICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBlbC5jbGFzc05hbWUgKyAnIGFuaW1hdGVkICcgKyB0aGlzLnByb3BzLmFuaW1hdGU7XHJcbiAgICAgICAgICAgIH0sIG51bWJlciAqICh0aGlzLnByb3BzLnF1ZXVlRHVyYXRpb24gKiAxMDAwKSk7XHJcbiAgICAgICAgICAgIG51bWJlcisrO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgbGV0IGZpbmRDbGFzcyA9IChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5mb3JFYWNoLmNhbGwoZWxlbWVudC5jaGlsZE5vZGVzLCBmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICAgICAgICAgIGZpbmRDbGFzcyhjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hlY2tDbGFzcyhjaGlsZCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZXRDbGFzcyhjaGlsZCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgLyogZmluZCBxdWV1ZSBjbGFzc2VzICovXHJcbiAgICAgICAgZmluZENsYXNzKGVsZW1lbnQpO1xyXG5cclxuICAgICAgICAvKiBjYWxsYmFjayAqL1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLmNhbGxiYWNrKCk7XHJcbiAgICAgICAgfSwgdGhpcy5wcm9wcy5kdXJhdGlvbiAqIDEwMDAgKiBudW1iZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIEBhdXRvYmluZFxyXG4gICAgaGFuZGxlU2Nyb2xsKGUpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuYW5pbWF0ZWQpIHtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnQgPSBSZWFjdERPTS5maW5kRE9NTm9kZSh0aGlzKTtcclxuICAgICAgICAgICAgbGV0IGVsZW1lbnRQb3NpdGlvblkgPSBlbGVtZW50LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsUG9zaXRpb25ZID0gd2luZG93LnNjcm9sbFksXHJcbiAgICAgICAgICAgICAgICB3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQ7XHJcbiAgICAgICAgICAgIGlmIChzY3JvbGxQb3NpdGlvblkgKyB3aW5kb3dIZWlnaHQgKiAuOTUgPj0gZWxlbWVudFBvc2l0aW9uWSArIHRoaXMucHJvcHMub2Zmc2V0ICogMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgYW5pbWF0ZWQ6IHRydWVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5xdWV1ZUNsYXNzID09IFwiXCIgJiYgdGhpcy5zaW5nbGVBbmltYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BzLnF1ZXVlQ2xhc3MgIT09IFwiXCIgJiYgdGhpcy5xdWV1ZUFuaW1hdGUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IHtcclxuICAgICAgICAgICAgcHJvcHMsIHN0YXRlXHJcbiAgICAgICAgfSA9IHRoaXM7XHJcblxyXG4gICAgICAgIGxldCBjbGFzc2VzID0gY2xhc3NOYW1lcyh7XHJcbiAgICAgICAgICAgICdhbmltYXRlZCc6IHRydWUsXHJcbiAgICAgICAgICAgIFtwcm9wcy5hbmltYXRlXTogc3RhdGUuYW5pbWF0ZWQgJiYgcHJvcHMucXVldWVDbGFzcyA9PT0gXCJcIlxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNsYXNzZXMgKz0gJyAnICsgcHJvcHMuY2xhc3NOYW1lO1xyXG4gICAgICAgIGxldCBzdHlsZTogYW55ID0gc3RhdGUuYW5pbWF0ZWQgPyB7fSA6IHtcclxuICAgICAgICAvLyAgICAgdmlzaWJpbGl0eTogJ2hpZGRlbidcclxuICAgICAgICB9O1xyXG4gICAgICAgIGlmIChwcm9wcy5kdXJhdGlvbiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHN0eWxlLldlYmtpdEFuaW1hdGlvbkR1cmF0aW9uID0gcHJvcHMuZHVyYXRpb24gKyAncyc7XHJcbiAgICAgICAgICAgIHN0eWxlLkFuaW1hdGlvbkR1cmF0aW9uID0gcHJvcHMuZHVyYXRpb24gKyAncyc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiA8ZGl2IGNsYXNzTmFtZT17Y2xhc3Nlc30gc3R5bGU9e3N0eWxlfT57cHJvcHMuY2hpbGRyZW59PC9kaXY+XHJcbiAgICB9XHJcbn1cclxuXHJcbi8vbGV0IHRocm90dGxlID0gKGRlbGF5LCBjYWxsYmFjaykgPT4ge1xyXG4vLyAgICBsZXQgcHJldmlvdXNDYWxsID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbi8vICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4vLyAgICAgICAgbGV0IHRpbWUgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuLy8gICAgICAgIGlmICgodGltZSAtIHByZXZpb3VzQ2FsbCkgPj0gZGVsYXkpIHtcclxuLy8gICAgICAgICAgICBwcmV2aW91c0NhbGwgPSB0aW1lO1xyXG4vLyAgICAgICAgICAgIGNhbGxiYWNrLmFwcGx5KG51bGwsIGFyZ3MpO1xyXG4vLyAgICAgICAgfVxyXG4vLyAgICB9O1xyXG4vL307XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vQ2xpZW50QXBwL2xpYi9zY3JvbGwtZWZmZWN0LnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgUm91dGVyLCBSb3V0ZSwgSGlzdG9yeUJhc2UgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xyXG5pbXBvcnQgeyBMYXlvdXQgfSBmcm9tICcuL2NvbXBvbmVudHMvTGF5b3V0JztcclxuaW1wb3J0IEhvbWUgZnJvbSAnLi9jb21wb25lbnRzL0hvbWUnO1xyXG5pbXBvcnQgQ29udGFjdCBmcm9tICcuL2NvbXBvbmVudHMvQ29udGFjdCc7XHJcbmltcG9ydCBMb2dpbiBmcm9tICcuL2NvbXBvbmVudHMvTG9naW4nO1xyXG5pbXBvcnQgTG9nb3V0IGZyb20gJy4vY29tcG9uZW50cy9Mb2dvdXQnO1xyXG5pbXBvcnQgUmVnaXN0ZXIgZnJvbSAnLi9jb21wb25lbnRzL1JlZ2lzdGVyJztcclxuaW1wb3J0IENvdW50ZXIgZnJvbSAnLi9jb21wb25lbnRzL0NvdW50ZXInO1xyXG5pbXBvcnQgVXNlciBmcm9tICcuL2NvbXBvbmVudHMvVXNlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCA8Um91dGUgY29tcG9uZW50PXsgTGF5b3V0IH0+XHJcbiAgICA8Um91dGUgcGF0aD0nLycgY29tcG9uZW50cz17eyBib2R5OiBIb21lIH19IC8+XHJcbiAgICA8Um91dGUgcGF0aD0nL2NvbnRhY3QnIGNvbXBvbmVudHM9e3sgYm9keTogQ29udGFjdCB9fSAvPlxyXG4gICAgPFJvdXRlIHBhdGg9Jy9jb3VudGVyJyBjb21wb25lbnRzPXt7IGJvZHk6IENvdW50ZXIgfX0gLz5cclxuICAgIDxSb3V0ZSBwYXRoPScvcmVnaXN0ZXInIGNvbXBvbmVudHM9e3sgYm9keTogUmVnaXN0ZXIgfX0gLz5cclxuICAgIDxSb3V0ZSBwYXRoPScvbG9naW4nIGNvbXBvbmVudHM9e3sgYm9keTogTG9naW4gfX0gLz5cclxuICAgIDxSb3V0ZSBwYXRoPScvbG9nb3V0JyBjb21wb25lbnRzPXt7IGJvZHk6IExvZ291dCB9fSAvPlxyXG4gICAgPFJvdXRlIHBhdGg9Jy91c2VyJyBjb21wb25lbnRzPXt7IGJvZHk6IFVzZXIgfX0gLz5cclxuPC9Sb3V0ZT47XHJcblxyXG4vLyBFbmFibGUgSG90IE1vZHVsZSBSZXBsYWNlbWVudCAoSE1SKVxyXG5pZiAobW9kdWxlLmhvdCkge1xyXG4gICAgbW9kdWxlLmhvdC5hY2NlcHQoKTtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvcm91dGVzLnRzeCIsIi8vIFRoaXMgZmlsZSBpcyBnZW5lcmF0ZWQgZnJvbSB0ZW1wbGF0ZSBcIlJlZHV4LnRzdFwiIHVzaW5nIHR5cGV3cml0ZXJcclxuLy8gaXQgZ2VuZXJhdGVzIGludGVyZmFjZSBkZWNsYXJhdGlvbnMgZm9yIEFjdGlvbnMgYW5kIFN0YXRlIHRoYXQgYXJlIGltcGxlbWVudGVkIHNlcnZlci1zaWRlXHJcblxyXG5leHBvcnQgY29uc3QgSU5DUkVNRU5UX0NPVU5URVIgPSAnSW5jcmVtZW50Q291bnRlckFjdGlvbic7XHJcbmV4cG9ydCBjb25zdCBERUNSRU1FTlRfQ09VTlRFUiA9ICdEZWNyZW1lbnRDb3VudGVyQWN0aW9uJztcclxuZXhwb3J0IGNvbnN0IFNUQVJUX0NPVU5URVIgPSAnU3RhcnRDb3VudGVyQWN0aW9uJztcclxuZXhwb3J0IGNvbnN0IENPVU5URVJfU1RBUlRFRCA9ICdDb3VudGVyU3RhcnRlZEFjdGlvbic7XHJcbmV4cG9ydCBjb25zdCBTVE9QX0NPVU5URVIgPSAnU3RvcENvdW50ZXJBY3Rpb24nO1xyXG5leHBvcnQgY29uc3QgQ09VTlRFUl9TVE9QUEVEID0gJ0NvdW50ZXJTdG9wcGVkQWN0aW9uJztcclxuZXhwb3J0IGNvbnN0IFNZTkNfQ09VTlRFUl9TVEFURSA9ICdTeW5jQ291bnRlclN0YXRlQWN0aW9uJztcclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEluY3JlbWVudENvdW50ZXJBY3Rpb24geyBcclxuXHR0eXBlOiAnSW5jcmVtZW50Q291bnRlckFjdGlvbic7IFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERlY3JlbWVudENvdW50ZXJBY3Rpb24geyBcclxuXHR0eXBlOiAnRGVjcmVtZW50Q291bnRlckFjdGlvbic7IFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0YXJ0Q291bnRlckFjdGlvbiB7IFxyXG5cdHR5cGU6ICdTdGFydENvdW50ZXJBY3Rpb24nOyBcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBDb3VudGVyU3RhcnRlZEFjdGlvbiB7IFxyXG5cdHR5cGU6ICdDb3VudGVyU3RhcnRlZEFjdGlvbic7IFxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFN0b3BDb3VudGVyQWN0aW9uIHsgXHJcblx0dHlwZTogJ1N0b3BDb3VudGVyQWN0aW9uJzsgXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgQ291bnRlclN0b3BwZWRBY3Rpb24geyBcclxuXHR0eXBlOiAnQ291bnRlclN0b3BwZWRBY3Rpb24nOyBcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBTeW5jQ291bnRlclN0YXRlQWN0aW9uIHsgXHJcblx0dHlwZTogJ1N5bmNDb3VudGVyU3RhdGVBY3Rpb24nOyBcclxuXHRwYXlsb2FkOiB7XHJcblx0XHRjb3VudGVyU3RhdGU6IENvdW50ZXJTdGF0ZTtcclxuXHR9XHJcbn1cclxuXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvdW50ZXJTdGF0ZSB7XHJcblx0Y291bnQ6IG51bWJlcjtcclxuXHRzdGFydGVkOiBib29sZWFuO1xyXG59XHJcblxyXG5cclxuXHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL0NsaWVudEFwcC9zZXJ2ZXIvQ291bnRlci50cyIsImltcG9ydCB7IEFjdGlvbiwgUmVkdWNlciwgQWN0aW9uQ3JlYXRvciB9IGZyb20gJ3JlZHV4JztcclxuaW1wb3J0IHsgQXBwVGh1bmtBY3Rpb24gfSBmcm9tICcuLyc7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3RlZEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnQ09OTkVDVEVEJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIERpc2Nvbm5lY3RlZEFjdGlvbiB7XHJcbiAgICB0eXBlOiAnRElTQ09OTkVDVEVEJ1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIENvbm5lY3Rpb25TdGF0ZSB7XHJcbiAgICBjb25uZWN0ZWQ6IGJvb2xlYW47XHJcbn1cclxuXHJcbmNvbnN0IERlZmF1bHRTdGF0ZSA9IHtcclxuICAgIGNvbm5lY3RlZDogZmFsc2VcclxufVxyXG5cclxudHlwZSBLbm93bkFjdGlvbiA9IENvbm5lY3RlZEFjdGlvbiB8IERpc2Nvbm5lY3RlZEFjdGlvbjtcclxuXHJcbmV4cG9ydCBjb25zdCBhY3Rpb25DcmVhdG9ycyA9IHtcclxuXHJcbiAgICBzdGFydExpc3RlbmVyOiAoKTogQXBwVGh1bmtBY3Rpb248S25vd25BY3Rpb24+ID0+IGFzeW5jIChkaXNwYXRjaCwgZ2V0U3RhdGUpID0+IHtcclxuXHJcbiAgICAgICAgdmFyIHVyaSA9ICh3aW5kb3cubG9jYXRpb24ucHJvdG9jb2wgPT09IFwiaHR0cDpcIiA/IFwid3M6Ly9cIiA6IFwid3NzOi8vXCIpICsgd2luZG93LmxvY2F0aW9uLmhvc3QgKyBcIi9hY3Rpb25zXCI7XHJcbiAgICAgICAgdmFyIHNvY2tldCA9IG5ldyBXZWJTb2NrZXQodXJpKTtcclxuICAgICAgICBzb2NrZXQub25vcGVuID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJvcGVuZWQgXCIgKyB1cmkpO1xyXG4gICAgICAgICAgICBkaXNwYXRjaCh7IHR5cGU6ICdDT05ORUNURUQnIH0pO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc29ja2V0Lm9uY2xvc2UgPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImNsb3NlZFwiKTtcclxuICAgICAgICAgICAgZGlzcGF0Y2goeyB0eXBlOiAnRElTQ09OTkVDVEVEJyB9KTtcclxuICAgICAgICAgICAgc29ja2V0ID0gbnVsbDtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzb2NrZXQub25tZXNzYWdlID0gZnVuY3Rpb24gKGUpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZWNlaXZlZDogXCIgKyBlLmRhdGEpO1xyXG4gICAgICAgICAgICB2YXIgYWN0aW9uID0gSlNPTi5wYXJzZShlLmRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoYWN0aW9uICYmIGFjdGlvbi50eXBlKSB7XHJcbiAgICAgICAgICAgICAgICBkaXNwYXRjaChhY3Rpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3dlYnNvY2tldCByZWNlaXZlZCB1bmtub3duIGRhdGEhJylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNvY2tldC5vbmVycm9yID0gZnVuY3Rpb24gKGU6IEVycm9yRXZlbnQpIHtcclxuICAgICAgICAgICAgaWYgKGUuZXJyb3IpXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIkVycm9yOiBcIiArIGUuZXJyb3IpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgcmVkdWNlcjogUmVkdWNlcjxDb25uZWN0aW9uU3RhdGU+ID0gKHN0YXRlOiBDb25uZWN0aW9uU3RhdGUsIGFjdGlvbjogS25vd25BY3Rpb24pID0+IHtcclxuICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuICAgICAgICBjYXNlICdDT05ORUNURUQnOlxyXG4gICAgICAgICAgICByZXR1cm4geyBjb25uZWN0ZWQ6IHRydWUgfTtcclxuICAgICAgICBjYXNlICdESVNDT05ORUNURUQnOlxyXG4gICAgICAgICAgICByZXR1cm4geyBjb25uZWN0ZWQ6IGZhbHNlIH07XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgLy8gVGhlIGZvbGxvd2luZyBsaW5lIGd1YXJhbnRlZXMgdGhhdCBldmVyeSBhY3Rpb24gaW4gdGhlIEtub3duQWN0aW9uIHVuaW9uIGhhcyBiZWVuIGNvdmVyZWQgYnkgYSBjYXNlIGFib3ZlXHJcbiAgICAgICAgICAgIGNvbnN0IGV4aGF1c3RpdmVDaGVjazogbmV2ZXIgPSBhY3Rpb247XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHN0YXRlIHx8IERlZmF1bHRTdGF0ZTtcclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvc3RvcmUvV2Vic29ja2V0Q29ubmVjdGlvbi50cyIsImltcG9ydCAqIGFzIENvdW50ZXIgZnJvbSAnLi9Db3VudGVyJztcclxuaW1wb3J0ICogYXMgRm9vdGVyIGZyb20gJy4vRm9vdGVyJztcclxuaW1wb3J0ICogYXMgQ29udGFjdCBmcm9tICcuL0NvbnRhY3QnO1xyXG5pbXBvcnQgKiBhcyBTZXNzaW9uIGZyb20gJy4vU2Vzc2lvbic7XHJcbmltcG9ydCAqIGFzIENvbm5lY3Rpb24gZnJvbSAnLi9XZWJzb2NrZXRDb25uZWN0aW9uJztcclxuaW1wb3J0ICogYXMgTG9naW4gZnJvbSAnLi9Mb2dpbic7XHJcbmltcG9ydCAqIGFzIFVzZXIgZnJvbSAnLi9Vc2VyJztcclxuaW1wb3J0ICogYXMgUmVnaXN0ZXIgZnJvbSAnLi9SZWdpc3Rlcic7XHJcbmltcG9ydCAqIGFzIEF1dGggZnJvbSAnLi9BdXRoJztcclxuXHJcbi8vIFRoZSB0b3AtbGV2ZWwgc3RhdGUgb2JqZWN0XHJcbmV4cG9ydCBpbnRlcmZhY2UgQXBwbGljYXRpb25TdGF0ZSB7XHJcbiAgICBzZXNzaW9uOiBTZXNzaW9uLlNldHRpbmdzU3RhdGUsXHJcbiAgICBjb25uZWN0aW9uOiBDb25uZWN0aW9uLkNvbm5lY3Rpb25TdGF0ZSxcclxuICAgIGF1dGg6IEF1dGguQXV0aFN0YXRlLFxyXG4gICAgdXNlcjogVXNlci5Vc2VyTW9kZWwsXHJcbiAgICBsb2dpbjogTG9naW4uTG9naW5TdGF0ZSxcclxuICAgIHJlZ2lzdGVyOiBSZWdpc3Rlci5SZWdpc3RlclN0YXRlLFxyXG4gICAgY291bnRlcjogQ291bnRlci5Db3VudGVyU3RhdGUsXHJcbiAgICBmb290ZXI6IEZvb3Rlci5Gb290ZXJTdGF0ZSxcclxuICAgIGNvbnRhY3Q6IENvbnRhY3QuQ29udGFjdFN0YXRlXHJcbn1cclxuXHJcbi8vIFdoZW5ldmVyIGFuIGFjdGlvbiBpcyBkaXNwYXRjaGVkLCBSZWR1eCB3aWxsIHVwZGF0ZSBlYWNoIHRvcC1sZXZlbCBhcHBsaWNhdGlvbiBzdGF0ZSBwcm9wZXJ0eSB1c2luZ1xyXG4vLyB0aGUgcmVkdWNlciB3aXRoIHRoZSBtYXRjaGluZyBuYW1lLiBJdCdzIGltcG9ydGFudCB0aGF0IHRoZSBuYW1lcyBtYXRjaCBleGFjdGx5LCBhbmQgdGhhdCB0aGUgcmVkdWNlclxyXG4vLyBhY3RzIG9uIHRoZSBjb3JyZXNwb25kaW5nIEFwcGxpY2F0aW9uU3RhdGUgcHJvcGVydHkgdHlwZS5cclxuZXhwb3J0IGNvbnN0IHJlZHVjZXJzID0ge1xyXG4gICAgc2Vzc2lvbjogU2Vzc2lvbi5yZWR1Y2VyLFxyXG4gICAgY29ubmVjdGlvbjogQ29ubmVjdGlvbi5yZWR1Y2VyLFxyXG4gICAgYXV0aDogQXV0aC5yZWR1Y2VyLFxyXG4gICAgdXNlcjogVXNlci5yZWR1Y2VyLFxyXG4gICAgbG9naW46IExvZ2luLnJlZHVjZXIsXHJcbiAgICByZWdpc3RlcjogUmVnaXN0ZXIucmVkdWNlcixcclxuICAgIGNvdW50ZXI6IENvdW50ZXIucmVkdWNlcixcclxuICAgIGZvb3RlcjogRm9vdGVyLnJlZHVjZXIsXHJcbiAgICBjb250YWN0OiBDb250YWN0LnJlZHVjZXJcclxufTtcclxuXHJcbi8vIFRoaXMgdHlwZSBjYW4gYmUgdXNlZCBhcyBhIGhpbnQgb24gYWN0aW9uIGNyZWF0b3JzIHNvIHRoYXQgaXRzICdkaXNwYXRjaCcgYW5kICdnZXRTdGF0ZScgcGFyYW1zIGFyZVxyXG4vLyBjb3JyZWN0bHkgdHlwZWQgdG8gbWF0Y2ggeW91ciBzdG9yZS5cclxuZXhwb3J0IGludGVyZmFjZSBBcHBUaHVua0FjdGlvbjxUQWN0aW9uPiB7XHJcbiAgICAoZGlzcGF0Y2g6IChhY3Rpb246IFRBY3Rpb24pID0+IHZvaWQsIGdldFN0YXRlOiAoKSA9PiBBcHBsaWNhdGlvblN0YXRlKTogdm9pZDtcclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9DbGllbnRBcHAvc3RvcmUvaW5kZXgudHMiLCJtb2R1bGUuZXhwb3J0cyA9IFwiZGF0YTppbWFnZS9zdmcreG1sO2Jhc2U2NCw3N3UvUEhOMlp5QjNhV1IwYUQwaU9XMXRJaUJvWldsbmFIUTlJamx0YlNJZ2RtbGxkMEp2ZUQwaU1DQXdJREV3TUNBeE1EQWlJSGh0Ykc1elBTSm9kSFJ3T2k4dmQzZDNMbmN6TG05eVp5OHlNREF3TDNOMlp5SWdkbVZ5YzJsdmJqMGlNUzR5SWlCaVlYTmxVSEp2Wm1sc1pUMGlkR2x1ZVNJK0RRb2dJRHhrWlhOalBsSlNUMFFnVEc5bmJ6d3ZaR1Z6WXo0TkNpQWdQQ0V0TFNCVGFHOTNJRzkxZEd4cGJtVWdiMllnWTJGdWRtRnpJSFZ6YVc1bklDZHlaV04wSnlCbGJHVnRaVzUwSUMwdFBnMEtJQ0E4WTJseVkyeGxJR040UFNJMU1DSWdZM2s5SWpVd0lpQnlQU0kwTUNJZ1ptbHNiRDBpZDJocGRHVWlJSE4wY205clpUMGljbVZrSWlCemRISnZhMlV0ZDJsa2RHZzlJakV5SWlBZ0x6NE5Dand2YzNablBnPT1cIlxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vQ2xpZW50QXBwL2ltYWdlcy9sb2dvLnN2Z1xuLy8gbW9kdWxlIGlkID0gMzVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXNwbmV0LXByZXJlbmRlcmluZ1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImFzcG5ldC1wcmVyZW5kZXJpbmdcIlxuLy8gbW9kdWxlIGlkID0gMzZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2xhc3NuYW1lc1wiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcImNsYXNzbmFtZXNcIlxuLy8gbW9kdWxlIGlkID0gMzdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibG9kYXNoL2RlYm91bmNlXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwibG9kYXNoL2RlYm91bmNlXCJcbi8vIG1vZHVsZSBpZCA9IDM4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LWRvbVwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0LWRvbVwiXG4vLyBtb2R1bGUgaWQgPSAzOVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1kb20vc2VydmVyXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3QtZG9tL3NlcnZlclwiXG4vLyBtb2R1bGUgaWQgPSA0MFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWFjdC1tb3Rpb25cIik7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gZXh0ZXJuYWwgXCJyZWFjdC1tb3Rpb25cIlxuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyLWJvb3RzdHJhcFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0LXJvdXRlci1ib290c3RyYXBcIlxuLy8gbW9kdWxlIGlkID0gNDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicmVhY3Qtcm91dGVyLXJlZHV4XCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVhY3Qtcm91dGVyLXJlZHV4XCJcbi8vIG1vZHVsZSBpZCA9IDQzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlYWN0LXNjcm9sbFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlYWN0LXNjcm9sbFwiXG4vLyBtb2R1bGUgaWQgPSA0NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWR1eFwiKTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyBleHRlcm5hbCBcInJlZHV4XCJcbi8vIG1vZHVsZSBpZCA9IDQ1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInJlZHV4LXRodW5rXCIpO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIGV4dGVybmFsIFwicmVkdXgtdGh1bmtcIlxuLy8gbW9kdWxlIGlkID0gNDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==