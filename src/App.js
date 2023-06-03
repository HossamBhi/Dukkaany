import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, Dimensions, Linking } from "react-native";
import Constants from "expo-constants";
import { primary_color } from "./utils/color";
import {
  notificationListener,
  requestUserPermission,
} from "./utils/puchNotificationHelper";
import BrowserPage from "./pages/BrowserPage";
import SplashScreen from "react-native-splash-screen";

export default function App() {
  const [place, setPlace] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
    // const redirectToStore = (url) => {
    //   // const store = url.split('store/')
    //   // setPlace(store[1])
    // };
    // (async () => {
    //   redirectToStore(await Linking.getInitialURL());
    // })();
    // Linking.addEventListener("url", ({ url }) => redirectToStore(url));
  }, [Linking]);

  useEffect(() => {
    requestUserPermission();
    notificationListener();
  }, []);

  return (
    <View style={styles.container}>
      <BrowserPage {...{ place }} />
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
