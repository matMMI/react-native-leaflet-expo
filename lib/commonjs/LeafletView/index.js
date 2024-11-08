"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactNativeWebview = require("react-native-webview");
var _expoFileSystem = require("expo-file-system");
var _expoAsset = require("expo-asset");
var _types = require("./types");
var _reactNative = require("react-native");
var _LoadingIndicator = _interopRequireDefault(require("../LoadingIndicator"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const LEAFLET_HTML_SOURCE = () => {
  const [index] = (0, _expoAsset.useAssets)(require('../../android/src/main/assets/leaflet.html'));
  const [html, setHtml] = (0, _react.useState)('');
  if (index) {
    (0, _expoFileSystem.readAsStringAsync)(index[0].localUri).then(data => {
      setHtml(data);
    });
  }
  return html;
};
const DEFAULT_MAP_LAYERS = [{
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  baseLayerIsChecked: true,
  baseLayerName: 'OpenStreetMap.Mapnik',
  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
}];
const DEFAULT_ZOOM = 15;
const LeafletView = ({
  renderLoading,
  onError,
  onLoadEnd,
  onLoadStart,
  onMessageReceived,
  mapLayers,
  mapMarkers,
  mapShapes,
  mapCenterPosition,
  ownPositionMarker,
  zoom,
  doDebug,
  androidHardwareAccelerationDisabled
}) => {
  const webViewRef = (0, _react.useRef)(null);
  const [initialized, setInitialized] = (0, _react.useState)(false);
  const logMessage = (0, _react.useCallback)(message => {
    if (doDebug) {
      console.log(message);
    }
  }, [doDebug]);
  const sendMessage = (0, _react.useCallback)(payload => {
    var _webViewRef$current;
    logMessage(`sending: ${JSON.stringify(payload)}`);
    (_webViewRef$current = webViewRef.current) === null || _webViewRef$current === void 0 || _webViewRef$current.injectJavaScript(`window.postMessage(${JSON.stringify(payload)}, '*');`);
  }, [logMessage]);
  const sendInitialMessage = (0, _react.useCallback)(() => {
    let startupMessage = {};
    if (mapLayers) {
      startupMessage.mapLayers = mapLayers;
    }
    if (mapMarkers) {
      startupMessage.mapMarkers = mapMarkers;
    }
    if (mapCenterPosition) {
      startupMessage.mapCenterPosition = mapCenterPosition;
    }
    if (mapShapes) {
      startupMessage.mapShapes = mapShapes;
    }
    if (ownPositionMarker) {
      startupMessage.ownPositionMarker = {
        ...ownPositionMarker,
        id: _types.OWN_POSTION_MARKER_ID
      };
    }
    startupMessage.zoom = zoom;
    sendMessage(startupMessage);
    setInitialized(true);
    logMessage('sending initial message');
  }, [logMessage, mapCenterPosition, mapLayers, mapMarkers, mapShapes, ownPositionMarker, sendMessage, zoom]);
  const handleMessage = (0, _react.useCallback)(event => {
    var _event$nativeEvent;
    const data = event === null || event === void 0 || (_event$nativeEvent = event.nativeEvent) === null || _event$nativeEvent === void 0 ? void 0 : _event$nativeEvent.data;
    if (!data) {
      return;
    }
    const message = JSON.parse(data);
    logMessage(`received: ${JSON.stringify(message)}`);
    if (message.msg === _types.WebViewLeafletEvents.MAP_READY) {
      sendInitialMessage();
    }
    if (message.event === _types.WebViewLeafletEvents.ON_MOVE_END) {
      var _message$payload;
      logMessage(`moved to: ${JSON.stringify((_message$payload = message.payload) === null || _message$payload === void 0 ? void 0 : _message$payload.mapCenterPosition)}`);
    }
    onMessageReceived && onMessageReceived(message);
  }, [logMessage, onMessageReceived, sendInitialMessage]);

  //Handle mapLayers update
  (0, _react.useEffect)(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapLayers
    });
  }, [initialized, mapLayers, sendMessage]);

  //Handle mapMarkers update
  (0, _react.useEffect)(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapMarkers
    });
  }, [initialized, mapMarkers, sendMessage]);

  //Handle mapShapes update
  (0, _react.useEffect)(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapShapes
    });
  }, [initialized, mapShapes, sendMessage]);

  //Handle ownPositionMarker update
  (0, _react.useEffect)(() => {
    if (!initialized || !ownPositionMarker) {
      return;
    }
    sendMessage({
      ...ownPositionMarker,
      id: _types.OWN_POSTION_MARKER_ID
    });
  }, [initialized, ownPositionMarker, sendMessage]);

  //Handle mapCenterPosition update
  (0, _react.useEffect)(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapCenterPosition
    });
  }, [initialized, mapCenterPosition, sendMessage]);

  //Handle zoom update
  (0, _react.useEffect)(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      zoom
    });
  }, [initialized, zoom, sendMessage]);
  return /*#__PURE__*/_react.default.createElement(_reactNativeWebview.WebView, {
    containerStyle: styles.container,
    ref: webViewRef,
    javaScriptEnabled: true,
    onLoadEnd: onLoadEnd,
    onLoadStart: onLoadStart,
    onMessage: handleMessage,
    domStorageEnabled: true,
    startInLoadingState: true,
    onError: onError,
    originWhitelist: ['*'],
    renderLoading: renderLoading,
    source: {
      html: LEAFLET_HTML_SOURCE()
    },
    allowFileAccess: true,
    allowUniversalAccessFromFileURLs: true,
    allowFileAccessFromFileURLs: true,
    androidHardwareAccelerationDisabled: androidHardwareAccelerationDisabled
  });
};
LeafletView.defaultProps = {
  renderLoading: () => /*#__PURE__*/_react.default.createElement(_LoadingIndicator.default, null),
  mapLayers: DEFAULT_MAP_LAYERS,
  zoom: DEFAULT_ZOOM,
  doDebug: __DEV__
};
const styles = _reactNative.StyleSheet.create({
  container: {
    flex: 1,
    ..._reactNative.StyleSheet.absoluteFillObject
  }
});
var _default = exports.default = LeafletView;
//# sourceMappingURL=index.js.map