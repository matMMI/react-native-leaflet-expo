import React, { useCallback, useEffect, useRef, useState } from 'react';
import { WebView } from 'react-native-webview';
import { readAsStringAsync } from 'expo-file-system';
import { useAssets } from 'expo-asset';
import { WebViewLeafletEvents, OWN_POSTION_MARKER_ID } from './types';
import { StyleSheet } from 'react-native';
import LoadingIndicator from '../LoadingIndicator';
const LEAFLET_HTML_SOURCE = () => {
  const [index] = useAssets(require('../../android/src/main/assets/leaflet.html'));
  const [html, setHtml] = useState('');
  if (index) {
    readAsStringAsync(index[0].localUri).then(data => {
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
  const webViewRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const logMessage = useCallback(message => {
    if (doDebug) {
      console.log(message);
    }
  }, [doDebug]);
  const sendMessage = useCallback(payload => {
    var _webViewRef$current;
    logMessage(`sending: ${JSON.stringify(payload)}`);
    (_webViewRef$current = webViewRef.current) === null || _webViewRef$current === void 0 || _webViewRef$current.injectJavaScript(`window.postMessage(${JSON.stringify(payload)}, '*');`);
  }, [logMessage]);
  const sendInitialMessage = useCallback(() => {
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
        id: OWN_POSTION_MARKER_ID
      };
    }
    startupMessage.zoom = zoom;
    sendMessage(startupMessage);
    setInitialized(true);
    logMessage('sending initial message');
  }, [logMessage, mapCenterPosition, mapLayers, mapMarkers, mapShapes, ownPositionMarker, sendMessage, zoom]);
  const handleMessage = useCallback(event => {
    var _event$nativeEvent;
    const data = event === null || event === void 0 || (_event$nativeEvent = event.nativeEvent) === null || _event$nativeEvent === void 0 ? void 0 : _event$nativeEvent.data;
    if (!data) {
      return;
    }
    const message = JSON.parse(data);
    logMessage(`received: ${JSON.stringify(message)}`);
    if (message.msg === WebViewLeafletEvents.MAP_READY) {
      sendInitialMessage();
    }
    if (message.event === WebViewLeafletEvents.ON_MOVE_END) {
      var _message$payload;
      logMessage(`moved to: ${JSON.stringify((_message$payload = message.payload) === null || _message$payload === void 0 ? void 0 : _message$payload.mapCenterPosition)}`);
    }
    onMessageReceived && onMessageReceived(message);
  }, [logMessage, onMessageReceived, sendInitialMessage]);

  //Handle mapLayers update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapLayers
    });
  }, [initialized, mapLayers, sendMessage]);

  //Handle mapMarkers update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapMarkers
    });
  }, [initialized, mapMarkers, sendMessage]);

  //Handle mapShapes update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapShapes
    });
  }, [initialized, mapShapes, sendMessage]);

  //Handle ownPositionMarker update
  useEffect(() => {
    if (!initialized || !ownPositionMarker) {
      return;
    }
    sendMessage({
      ...ownPositionMarker,
      id: OWN_POSTION_MARKER_ID
    });
  }, [initialized, ownPositionMarker, sendMessage]);

  //Handle mapCenterPosition update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      mapCenterPosition
    });
  }, [initialized, mapCenterPosition, sendMessage]);

  //Handle zoom update
  useEffect(() => {
    if (!initialized) {
      return;
    }
    sendMessage({
      zoom
    });
  }, [initialized, zoom, sendMessage]);
  return /*#__PURE__*/React.createElement(WebView, {
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
  renderLoading: () => /*#__PURE__*/React.createElement(LoadingIndicator, null),
  mapLayers: DEFAULT_MAP_LAYERS,
  zoom: DEFAULT_ZOOM,
  doDebug: __DEV__
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...StyleSheet.absoluteFillObject
  }
});
export default LeafletView;
//# sourceMappingURL=index.js.map