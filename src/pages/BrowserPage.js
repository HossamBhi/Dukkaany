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
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { bg_color, primary_color } from "../utils/color";
import { getLocationStorage, setLocationStorage } from "../utils/storage";
import * as Location from "expo-location";
import MessageView from "../component/common/MessageView";
import CustomeButton from "../component/common/CustomeButton";
import { arePointsNear } from "../utils/locationHelper";
import { _MARKZ_BADR_EREA } from "../utils/database";

const INJECTED_JS = `
  window.onscroll = function() {
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        scrollTop: document.documentElement.scrollTop || document.body.scrollTop
      }),     
    )
  }
`;

const SCROLLVIEW_CONTAINER = { flex: 1, height: "100%" };
const WEBVIEW = (height) => ({ width: "100%", height });

export default function BrowserPage() {
  const [isReloadPage, setIsReloadPage] = useState(false);
  const [isShowMessage, setIsShowMessage] = useState(false);
  const [isShowWV, setIsShowWV] = useState(false);
  const [navigationOptions, setNavigationOptions] = useState({});
  const { height, width } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [isPullToRefreshEnabled, setisPullToRefreshEnabled] = useState(true);
  const [scrollViewHeight, setScrollViewHeight] = useState(0);
  const webViewRef = useRef(null);
  // For location
  const [isMarkzBadr, setIsMarkzBadr] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  // const [errorMsg, setErrorMsg] = useState("جاري التحميل...");
  const [LP, setLP] = useState(null);
  const [revLocation, setRevLocation] = useState("");

  useEffect(() => {
    if (isMarkzBadr === null) {
      (async () => {
        const oldLocation = await getLocationStorage();
        if (oldLocation) {
          setLP(true);
          const isInArea = arePointsNear(
            oldLocation.coords,
            _MARKZ_BADR_EREA,
            _MARKZ_BADR_EREA.area
          );
          setIsMarkzBadr(isInArea);
          // const { region } = oldLocation[0];

          // setIsMarkzBadr(
          //   region?.includes("Beheira") || region?.includes("بحيرة")
          // );
        }
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setLP(false);
          setErrorMsg("تم رفض إذن الوصول إلى الموقع.");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});

        // const revLocation = await Location.reverseGeocodeAsync(location.coords);
        // console.log("Rev location: ", revLocation);
        // setRevLocation(revLocation);
        // setErrorMsg("جاري التحميل...");
        setLP(true);

        const isInArea = arePointsNear(
          location.coords,
          _MARKZ_BADR_EREA,
          _MARKZ_BADR_EREA.area
        );
        setIsMarkzBadr(isInArea);

        // const { region } = revLocation[0];
        // setIsMarkzBadr(
        //   region?.includes("Beheira") || region?.includes("بحيرة")
        // );
        // setLocationStorage(revLocation);
        setLocationStorage(location);
      })();
    }

    BackHandler.addEventListener("hardwareBackPress", goBack);
    return () => BackHandler.removeEventListener("hardwareBackPress", goBack);
  }, [navigationOptions]);

  console.log("isMarkz badr: ", isMarkzBadr);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    webViewRef.current.reload();
  }, []);

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

  if (LP === false || isMarkzBadr === null) {
    return (
      <MessageView
        message={errorMsg}
        btn={
          LP === false && (
            <CustomeButton
              text={"افتح الضبط"}
              onPress={() => Linking.openSettings()}
              style={{ marginTop: 40 }}
            />
          )
        }
      />
    );
  }

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
              uri: isMarkzBadr
                ? "https://dukkaany.com/bard-landing-page/"
                : "https://dukkaany.com",
            }}
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
            nestedScrollEnabled={true}
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
    justifyContent: "center",
    width: Dimensions.get("window").width,
  },
  center: { justifyContent: "center", alignItems: "center" },
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
