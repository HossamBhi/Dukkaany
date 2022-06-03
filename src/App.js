import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import HomePage from "./pages/HomePage";
import Constants from "expo-constants";
import { primary_color } from "./utils/color";
import {
  notificationListener,
  requestUserPermission,
} from "./utils/puchNotificationHelper";
export default function App() {
  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <View style={styles.container}>
      <HomePage />
      <StatusBar
        style="light"
        animated
        backgroundColor={primary_color}
        translucent
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: Dimensions.get("window").width,
    paddingTop: Constants.statusBarHeight,
  },
});

// import { StatusBar } from "expo-status-bar";
// import React, { useEffect, useState, useRef } from "react";
// import {
//   Dimensions,
//   StyleSheet,
//   View,
//   BackHandler,
//   Image,
//   useWindowDimensions,
//   Text,
//   TouchableOpacity,
// } from "react-native";
// import Constants from "expo-constants";
// import { WebView } from "react-native-webview";
// import AppLoader from "./component/AppLoader";
// import { bg_color, primary_color_light } from "./assets/utils/color";
// // const DOUBLE_PRESS_DELAY = 700;
// export default function App() {
//   const [loader, setLoader] = useState(1);
//   const [isShowMessage, setIsShowMessage] = useState(false);
//   const [isShowWV, setIsShowWV] = useState(false);
//   const webViewRef = useRef(null);
//   const [navigationOptions, setNavigationOptions] = useState({});
//   const { height, width } = useWindowDimensions();

//   // let lastPress;
//   // const showToast = () =>
//   //   ToastAndroid.show("Click again to close Dukkaany!", ToastAndroid.SHORT);

//   // const isDoublePress = () => {
//   //   const now = new Date().getTime();
//   //   if (lastPress && now - lastPress < DOUBLE_PRESS_DELAY) {
//   //     lastPress = 0;
//   //     return true;
//   //   } else {
//   //     lastPress = now;

//   //     return false;
//   //   }
//   // };

//   // const backAction = () => {
//   //   showToast();
//   //   if (isDoublePress()) {
//   //     BackHandler.exitApp();
//   //   } else {
//   //     return true;
//   //   }
//   // };
//   useEffect(() => {
//     BackHandler.addEventListener("hardwareBackPress", goBack);

//     return () => BackHandler.removeEventListener("hardwareBackPress", goBack);
//   }, [navigationOptions]);

//   const goBack = () => {
//     if (navigationOptions.canGoBack) {
//       webViewRef.current.goBack();
//       return true;
//     } else {
//       BackHandler.exitApp();
//     }
//   };

//   const ShowMessage = ({ message, style }) => (
//     <View
//       style={[
//         { height: height + 20, backgroundColor: primary_color_light },
//         styles.center,
//         style,
//       ]}
//     >
//       {message}
//     </View>
//   );

//   const RenderError = (errorName) => (
//     <View
//       style={{
//         height,
//         justifyContent: "center",
//         alignItems: "center",
//         backgroundColor: bg_color,
//       }}
//     >
//       <Image
//         resizeMode="contain"
//         source={require("./assets/loading_error.png")}
//         style={{ width, maxHeight: height / 2, height: "40%" }}
//       />
//       <TouchableOpacity
//         style={[styles.btn, loader && { backgroundColor: "#cecece" }]}
//         disabled={loader}
//         onPress={() => {
//           webViewRef.current.reload();
//           setLoader(false);
//         }}
//       >
//         <Text style={[styles.btnText, loader && { color: "#6e7781" }]}>
//           {loader ? "جاري التحميل" : "إعادة المحاولة"}
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );

//   const navChange = (e) => {
//     // console.log("nav cahge : ", e);
//     setNavigationOptions(e);
//     if (e.title === "Web page not available") {
//       setIsShowWV(false);
//     } else {
//       setIsShowMessage(false);
//       setIsShowWV(true);
//     }
//   };

//   return (
//     <View style={[styles.container, loader && { alignItems: "center" }]}>
//       {loader === 1 && (
//         <ShowMessage
//           style={{ paddingBottom: Constants.statusBarHeight, width, height }}
//           message={
//             <Image
//               resizeMode="contain"
//               source={require("./assets/logo.png")}
//               style={{ width, height }}
//             />
//           }
//         />
//       )}
//       {isShowMessage && <RenderError />}
//       <View
//         style={{
//           width: Dimensions.get("window").width,
//           height: isShowWV ? height : 0,
//         }}
//       >
//         <WebView
//           ref={webViewRef}
//           source={{ uri: "https://dukkaany.com" }}
//           style={{
//             width: Dimensions.get("window").width,
//             height: isShowMessage ? height : 0,
//           }}
//           onNavigationStateChange={navChange}
//           onLoadStart={() => {
//             setLoader(false);
//           }}
//           onError={() => {
//             setIsShowWV(false);
//             setLoader(false);
//             setIsShowMessage(true);
//           }}
//           pullToRefreshEnabled={true}
//           allowsBackForwardNavigationGestures
//           // renderError={RenderError}

//           // startInLoadingState={true}
//           // renderLoading={() => (
//           //   <ShowMessage
//           //     style={{
//           //       paddingBottom: Constants.statusBarHeight,
//           //       backgroundColor: primary_color_light,
//           //     }}
//           //     message={
//           //       <Image
//           //         resizeMode="contain"
//           //         source={require("./assets/logo.png")}
//           //         style={{ width, height }}
//           //       />
//           //     }
//           //   />
//           // )}
//         />
//       </View>

//       <StatusBar style="light" animated backgroundColor="#100F0D" translucent />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     // backgroundColor: bg_color,
//     justifyContent: "center",
//     width: Dimensions.get("window").width,
//     paddingTop: Constants.statusBarHeight,
//   },
//   center: {
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   btn: {
//     padding: 16,
//     paddingHorizontal: 38,
//     borderRadius: 10,
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 40,
//     marginBottom: 40,
//     backgroundColor: primary_color_light,
//   },
//   btnText: {
//     fontSize: 16,
//     color: "#ffffff",
//     fontWeight: "700",
//   },
// });
