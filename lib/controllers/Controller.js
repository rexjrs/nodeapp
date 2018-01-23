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
        key: 'query',
        value: function query(db, _query, callback) {
            var finalQuery = '';
            var tableName = _query.slice(0, _query.indexOf('::'));
            var fullQuery = _query.slice(_query.indexOf('::') + 2);
            var nextString = fullQuery;
            var finalMove = '';
            var conditions = [];
            var seperate = function seperate() {
                if (fullQuery.indexOf('->') > -1) {
                    var workOn = nextString.slice(0, nextString.indexOf('->'));
                    if (workOn.indexOf('>=') > -1 || workOn.indexOf('<=') > -1 || workOn.indexOf('<') > -1 || workOn.indexOf('>') > -1 || workOn.indexOf('=') > -1) {
                        var indexOfCondition = (workOn.indexOf('>=') > -1 ? { index: workOn.indexOf('>='), val: '>=' } : false) || (workOn.indexOf('<=') > -1 ? { index: workOn.indexOf('<='), val: '<=' } : false) || (workOn.indexOf('<') > -1 ? { index: workOn.indexOf('<'), val: '<' } : false) || (workOn.indexOf('>') > -1 ? { index: workOn.indexOf('>'), val: '>' } : false) || (workOn.indexOf('=') > -1 ? { index: workOn.indexOf('='), val: '=' } : false);
                        var type = workOn.slice(0, workOn.indexOf('('));
                        var parameter = workOn.slice(workOn.indexOf('(') + 1, indexOfCondition.index).trim();
                        var value = workOn.slice(indexOfCondition.index + indexOfCondition.val.length).replace(')', '').trim();
                        var found = false;
                        conditions.forEach(function (val, indexCondition) {
                            if (val.indexOf(type.toUpperCase()) > -1) {
                                var newVal = val + ' AND ' + parameter + ' ' + indexOfCondition.val + ' ' + value;
                                conditions[indexCondition] = newVal;
                                found = true;
                            }
                        });
                        if (!found) {
                            conditions.push(type.toUpperCase() + ' ' + parameter + ' ' + indexOfCondition.val + ' ' + value);
                        }
                    } else {
                        var workOnArray = workOn.split(',');
                        if (workOnArray.length < 3) {
                            var _type = workOnArray[0].slice(0, workOnArray[0].indexOf('('));
                            var _parameter = workOnArray[0].slice(workOnArray[0].indexOf('(') + 1).trim();
                            var _value = workOnArray[1].replace(')', '').trim();
                            var _found = false;
                            conditions.forEach(function (val, indexCondition) {
                                if (val.indexOf(_type.toUpperCase()) > -1) {
                                    var newVal = val + ' AND ' + _parameter + ' = ' + _value;
                                    conditions[indexCondition] = newVal;
                                    _found = true;
                                }
                            });
                            if (!_found) {
                                conditions.push(_type.toUpperCase() + ' ' + _parameter + ' = ' + _value);
                            }
                        }
                    }
                    nextString = nextString.slice(nextString.indexOf('->') + 2);
                    if (nextString.indexOf('->') < 0) {
                        prepStatement();
                    } else {
                        seperate();
                    }
                } else {
                    nextString = fullQuery;
                    prepStatement();
                }
            };
            var prepStatement = function prepStatement() {
                if (nextString.indexOf('get') > -1 || nextString.indexOf('first') > -1) {
                    finalQuery = 'SELECT * FROM ' + tableName + ' ';
                }
                if (nextString.indexOf('pluck') > -1) {
                    var params = nextString.replace('pluck(', '').replace(')', '').split(',');
                    var paramString = '';
                    params.forEach(function (value, index) {
                        if (index + 1 === params.length) {
                            paramString = paramString + ' ' + value.trim() + ' ';
                        } else {
                            paramString = paramString + ' ' + value.trim() + ', ';
                        }
                    });
                    finalQuery = 'SELECT ' + paramString.trim() + ' FROM ' + tableName + ' ';
                }
            };
            seperate();
            conditions.forEach(function (value, index) {
                finalQuery = finalQuery + value;
            });
            db.query(finalQuery, function (err, result) {
                if (!err) {
                    if (_query.indexOf('first') > -1) {
                        callback(true, result[0]);
                    } else {
                        callback(true, result);
                    }
                } else {
                    callback(false, err);
                }
            });
        }
    }, {
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