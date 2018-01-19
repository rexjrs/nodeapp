'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var authMiddleware = exports.authMiddleware = function authMiddleware(_ref) {
    var db = _ref.db;

    return function (req, res, next) {
        var failedRequest = function failedRequest(code, message) {
            return res.status(code).json(_extends({
                status: 'fail',
                message: ''
            }, message));
        };
        if (!req.headers.authorization) {
            return failedRequest(400, {
                message: 'Missing token.'
            });
        }
        if (!req.headers.uid) {
            return failedRequest(400, {
                message: 'Missing uid.'
            });
        }
        var authBearer = req.headers.authorization.replace('Bearer ', '');
        var uid = req.headers.uid;
        if (authBearer) {
            db.query('SELECT * FROM tokens WHERE token = \'' + authBearer + '\' AND userid = \'' + uid + '\'', function (err, result) {
                if (err) {
                    return failedRequest(500, {
                        message: 'Internal server error.'
                    });
                } else {
                    if (result.length > 0) {
                        next();
                    } else {
                        return failedRequest(404, {
                            message: 'Token or uid not found.'
                        });
                    }
                }
            });
        } else {
            return failedRequest(400, {
                message: 'Missing or broken token.'
            });
        }
    };
};