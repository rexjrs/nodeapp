'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _hiBase = require('hi-base64');

var _hiBase2 = _interopRequireDefault(_hiBase);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _Controller2 = require('./Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AuthController = function (_Controller) {
    _inherits(AuthController, _Controller);

    function AuthController() {
        _classCallCheck(this, AuthController);

        return _possibleConstructorReturn(this, (AuthController.__proto__ || Object.getPrototypeOf(AuthController)).apply(this, arguments));
    }

    _createClass(AuthController, null, [{
        key: 'loginUser',
        value: function loginUser(_ref) {
            var _this2 = this;

            var req = _ref.req,
                res = _ref.res,
                db = _ref.db;

            var email = req.body.email;
            var password = req.body.password;
            this.verifyFields([{ name: 'email', value: email, conditions: ['required', 'email'] }, { name: 'password', value: password, conditions: ['required'] }], res);
            try {
                password = _hiBase2.default.decode(password);
            } catch (error) {
                throw this.response(res, 400, {
                    message: 'Malformed password.'
                });
            }
            db.query('SELECT id, email, created_at, updated_at, password FROM users WHERE email = \'' + email + '\'', function (err, result, fields) {
                if (err) {
                    return _this2.response(res, 401, {
                        message: 'Email or password is incorrect.2'
                    });
                } else {
                    _bcrypt2.default.compare(password, result[0].password).then(function (resBCrypt) {
                        if (resBCrypt) {
                            db.query('DELETE FROM tokens WHERE userid = \'' + result[0].id + '\'', function (err2, result2) {
                                var token = _crypto2.default.randomBytes(20).toString('hex');
                                db.query('INSERT INTO tokens (userid, token, created_at, updated_at) VALUES (\'' + result[0].id + '\', \'' + token + '\', \'NOW()\', \'NOW()\')', function (err3, result3) {
                                    if (err3) {
                                        return _this2.response(res, 500, {
                                            message: 'There was an issue creating token.'
                                        });
                                    } else {
                                        return _this2.response(res, 200, {
                                            status: 'pass',
                                            data: _extends({}, result[0], {
                                                token: token
                                            })
                                        });
                                    }
                                });
                            });
                        } else {
                            return _this2.response(res, 401, {
                                message: 'Email or password is incorrect.'
                            });
                        }
                    });
                }
            });
        }
    }, {
        key: 'createUser',
        value: function createUser(_ref2) {
            var _this3 = this;

            var req = _ref2.req,
                res = _ref2.res,
                db = _ref2.db;

            var fullname = req.body.fullname;
            var email = req.body.email;
            var password = req.body.password;
            var nextStep = false;
            this.verifyFields([{ name: 'fullname', value: fullname, conditions: ['required', 'string'] }, { name: 'email', value: email, conditions: ['required', 'email'] }, { name: 'password', value: password, conditions: ['required', 'min-6'] }], res);
            try {
                password = _hiBase2.default.decode(password);
            } catch (error) {
                throw this.response(res, 400, {
                    message: 'Malformed password.'
                });
            }
            _bcrypt2.default.hash(password, 10, function (errHash, hash) {
                if (errHash) {
                    return _this3.response(res, 500, {
                        message: 'Issue with hashing password'
                    });
                } else {
                    db.query('INSERT INTO users (email, password, fullname, created_at, updated_at) VALUES (\'' + email + '\', \'' + hash + '\', \'' + fullname + '\', NOW(), NOW())', function (err, result, fields) {
                        if (err) {
                            return _this3.response(res, 500, {
                                message: 'Error inserting user into Database. Possible duplicate.'
                            });
                        } else {
                            return _this3.response(res, 201, {
                                status: 'pass',
                                message: 'User successfully created.'
                            });
                        }
                    });
                }
            });
        }
    }]);

    return AuthController;
}(_Controller3.default);

exports.default = AuthController;