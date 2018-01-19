'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Controller = exports.Auth = undefined;

var _Controller = require('./controllers/Controller');

var _Controller2 = _interopRequireDefault(_Controller);

var _AuthController = require('./controllers/AuthController');

var _AuthController2 = _interopRequireDefault(_AuthController);

var _Middleware = require('./middleware/Middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Nodeful = {
    Controller: Controller,
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

exports.default = Nodeful;