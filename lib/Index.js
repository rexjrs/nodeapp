'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.TestController = exports.Controller = exports.Auth = undefined;

var _Controller = require('./controllers/Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _AuthController = require('./controllers/AuthController');

var _AuthController2 = _interopRequireDefault(_AuthController);

var _TestController = require('./controllers/TestController');

var _TestController2 = _interopRequireDefault(_TestController);

var _Middleware = require('./middleware/Middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Nodeful = {
    Controller: Controller,
    TestController: TestController,
    Auth: {
        controller: _AuthController2.default,
        middleware: _Middleware.authMiddleware
    }
};

var Auth = exports.Auth = {
    controller: _AuthController2.default,
    middleware: _Middleware.authMiddleware
};
var Controller = exports.Controller = _Controller2.default;

var TestController = exports.TestController = _TestController2.default;

exports.default = Nodeful;