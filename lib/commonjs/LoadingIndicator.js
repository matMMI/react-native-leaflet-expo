"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const LoadingIndicator = () => {
  return /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.activityOverlayStyle
  }, /*#__PURE__*/_react.default.createElement(_reactNative.View, {
    style: styles.activityIndicatorContainer
  }, /*#__PURE__*/_react.default.createElement(_reactNative.ActivityIndicator, {
    size: "large"
  })));
};
const styles = _reactNative.StyleSheet.create({
  activityOverlayStyle: {
    ..._reactNative.StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, .5)',
    display: 'flex',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5
  },
  activityIndicatorContainer: {
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 50,
    alignSelf: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  }
});
var _default = exports.default = LoadingIndicator;
//# sourceMappingURL=LoadingIndicator.js.map