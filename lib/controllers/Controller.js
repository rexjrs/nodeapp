'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Controller = function () {
    function Controller() {
        _classCallCheck(this, Controller);
    }

    _createClass(Controller, null, [{
        key: 'response',
        value: function response(res, code, message) {
            return res.status(code).json(_extends({
                status: 'fail',
                message: ''
            }, message));
        }
    }, {
        key: 'verifyFields',
        value: function verifyFields(inputs, res, callback) {
            var isFloat = function isFloat(n) {
                return n === +n && n !== (n | 0);
            };
            var isInteger = function isInteger(n) {
                return n === +n && n === (n | 0);
            };
            var validateEmail = function validateEmail(email) {
                var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email.toLowerCase());
            };
            var errors = [];
            inputs.forEach(function (value, index) {
                var err = [];
                for (var condition in value.conditions) {
                    if (value.value === null || value.value === undefined) {
                        err = [];
                        err.push('value is required');
                    } else {
                        if (err[0] === 'value is required') {
                            return false;
                        }
                        switch (value.conditions[condition]) {
                            case 'email':
                                if (!validateEmail(value.value)) {
                                    err.push('value is not a valid email address');
                                }
                                break;
                            case 'string':
                                if (typeof value.value == 'string' || value.value instanceof String) {} else {
                                    err.push('value is not a string');
                                }
                                break;
                            case 'number':
                                if (isInteger(value.value) || isFloat(value.value)) {} else {
                                    err.push('value is not a number');
                                }
                                break;
                            case 'boolean':
                                if (typeof value.value == 'boolean' || value.value instanceof Boolean) {} else {
                                    err.push('value is not a boolean');
                                }
                                break;
                            default:
                                break;
                        }
                        if (value.conditions[condition].substring(0, 3) === 'min') {
                            var length = parseInt(value.conditions[condition].substring(4), 10);
                            if (value.value.length < length) {
                                err.push('minimum length required ' + length);
                            }
                        }
                        if (value.conditions[condition].substring(0, 3) === 'max') {
                            var _length = parseInt(value.conditions[condition].substring(4), 10);
                            if (value.value.length > _length) {
                                err.push('maxinum length ' + _length);
                            }
                        }
                    }
                }
                if (err.length > 0) {
                    errors.push({
                        name: value.name,
                        errors: err
                    });
                }
            });
            if (errors.length > 0) {
                if (callback) {
                    callback(false, errors);
                } else {
                    throw this.response(res, 400, {
                        errors: errors
                    });
                }
            } else {
                if (callback) {
                    callback(true);
                }
            }
        }
    }]);

    return Controller;
}();

exports.default = Controller;