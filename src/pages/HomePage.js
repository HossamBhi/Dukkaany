import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  BackHandler,
  Image,
  useWindowDimensions,
  Text,
  TouchableOpacity,
  RefreshControl,
  ScrollView,
} from "react-native";
import { WebView } from "react-native-webview";
import { bg_color, primary_color } from "../utils/color";

const INJECTED_JS = `
  window.onscroll = function() {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      }),     
    )
  }
`;

const SCROLLVIEW_CONTAINER = {
  flex: 1,
  height: "100%",
};
const WEBVIEW = (height) => ({
  width: "100%",
  height,
});

export default function HomePage() {
  const [isReloadPage, setIsReloadPage] = useState(false);
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [isShowWV, setIsShowWV] = useState(false);
  const [navigationOptions, setNavigationOptions] = useState({});
  const { height, width } = useWindowDimensions();
  const [refreshing, setRefreshing] = React.useState(false);
  const [isPullToRefreshEnabled, setisPullToRefreshEnabled] = useState(true);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const webViewRef = useRef(null);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webViewRef.current.reload();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", goBack);

    return () => BackHandler.removeEventListener("hardwareBackPress", goBack);
  }, [navigationOptions]);

  const goBack = () => {
    if (navigationOptions.canGoBack) {
      webViewRef.current.goBack();
      return true;
    } else {
      BackHandler.exitApp();
    }
  };

  const RenderError = () => (
    <View
      style={{
        height,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: bg_color,
      }}
    >
      <Image
        resizeMode="contain"
        source={require("../assets/loading_error.png")}
        style={{ width, maxHeight: height / 2, height: "40%" }}
      />
      <TouchableOpacity
        style={[styles.btn, isReloadPage && { backgroundColor: "#cecece" }]}
        disabled={isReloadPage}
        onPress={() => {
          webViewRef.current.reload();
          setIsReloadPage(true);
        }}
      >
        <Text style={[styles.btnText, isReloadPage && { color: "#6e7781" }]}>
          {isReloadPage ? "جاري التحميل" : "إعادة المحاولة"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const navChange = (e) => {
    setNavigationOptions(e);
    if (e.title === "Web page not available") {
      setIsShowWV(false);
    } else {
      setIsShowMessage(false);
      setIsShowWV(true);
    }
  };

  const onWebViewMessage = (e) => {
    const { data } = e.nativeEvent;
    try {
      const { scrollTop } = JSON.parse(data);
      setisPullToRefreshEnabled(scrollTop === 0);
    } catch (error) {}
  };

  return (
    <ScrollView
      style={SCROLLVIEW_CONTAINER}
      onLayout={(e) => {
        setScrollViewHeight(e.nativeEvent.layout.height);
      }}
      contentContainerStyle={styles.scrollView}
      refreshControl={
        <RefreshControl
          enabled={isPullToRefreshEnabled}
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={primary_color}
          colors={[primary_color]}
        />
      }
    >
      <View style={[styles.container]}>
        {isShowMessage && <RenderError />}

        <View
          style={{
            width: Dimensions.get("window").width,
            height: isShowWV ? height : 0,
          }}
        >
          <WebView
            ref={webViewRef}
            source={{
              uri: "https://dukkaany.com",
            }}
            // style={{
            //   width: Dimensions.get("window").width,
            //   height: isShowMessage ? height : 0,
            // }}
            onNavigationStateChange={navChange}
            onLoadStart={() => {
              // setLoader(false);
            }}
            onLoadEnd={() => {
              setRefreshing(false);
            }}
            onError={() => {
              setIsReloadPage(false);
              setIsShowWV(false);
              setRefreshing(false);
              setIsShowMessage(true);
            }}
            // startInLoadingState={true}
            // renderLoading={() => <AppLoader />}
            // pullToRefreshEnabled={true}
            allowsBackForwardNavigationGestures
            style={WEBVIEW(isShowWV ? scrollViewHeight : 0)}
            onMessage={onWebViewMessage}
            injectedJavaScript={INJECTED_JS}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: bg_color,
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  btn: {
    padding: 16,
    paddingHorizontal: 38,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
    backgroundColor: primary_color,
  },
  btnText: {
    fontSize: 16,
    color: "#ffffff",
    fontWeight: "700",
  },
});
