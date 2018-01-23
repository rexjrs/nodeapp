'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Controller2 = require('./Controller');

var _Controller3 = _interopRequireDefault(_Controller2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TestController = function (_Controller) {
    _inherits(TestController, _Controller);

    function TestController() {
        _classCallCheck(this, TestController);

        return _possibleConstructorReturn(this, (TestController.__proto__ || Object.getPrototypeOf(TestController)).apply(this, arguments));
    }

    _createClass(TestController, null, [{
        key: 'eloq',
        value: function eloq(_ref) {
            var _this2 = this;

            var req = _ref.req,
                res = _ref.res,
                db = _ref.db;

            this.query(db, 'users::where(id > 10)->where(fullname, \'Jamie Charlesworth\')->get()', function (status, result) {
                _this2.response(res, 200, {
                    status: 'pass',
                    message: 'Done',
                    data: result
                });
            });
        }
    }]);

    return TestController;
}(_Controller3.default);

exports.default = TestController;